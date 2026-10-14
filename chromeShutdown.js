import Gio from "gi://Gio";
import GLib from "gi://GLib";

import { logErrorUnlessCancelled } from "resource:///org/gnome/shell/misc/errorUtils.js";

Gio._promisify(Gio.DBusConnection.prototype, "call");
Gio._promisify(Gio.Subprocess.prototype, "communicate_utf8_async");
Gio._promisify(Gio.Subprocess.prototype, "wait_async");

const APP_ID = "launcher@adaspt";
const QUIT_TIMEOUT_MS = 10000;
const POLL_INTERVAL_MS = 100;

const SESSION_NAME = "org.gnome.SessionManager";
const SESSION_PATH = "/org/gnome/SessionManager";
const CLIENT_IFACE = "org.gnome.SessionManager.ClientPrivate";

// The browser process is the one without a --type, such as renderers have.
async function findBrowserPids() {
  const proc = Gio.Subprocess.new(
    ["pgrep", "-a", "-x", "-u", GLib.get_user_name(), "chrome"],
    Gio.SubprocessFlags.STDOUT_PIPE,
  );
  const [stdout] = await proc.communicate_utf8_async(null, null);

  return stdout
    .split("\n")
    .filter((line) => line && !line.includes(" --type="))
    .map((line) => line.split(" ")[0])
    .filter(isRunning);
}

// Exited processes stay as zombies until gnome-shell, their parent, reaps them.
function isRunning(pid) {
  try {
    const [, bytes] = GLib.file_get_contents(`/proc/${pid}/stat`);
    const stat = new TextDecoder().decode(bytes);

    return stat[stat.lastIndexOf(")") + 2] !== "Z";
  } catch {
    return false;
  }
}

function waitForExit(pids) {
  const deadline = GLib.get_monotonic_time() + QUIT_TIMEOUT_MS * 1000;

  return new Promise((resolve) => {
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, POLL_INTERVAL_MS, () => {
      if (pids.some(isRunning) && GLib.get_monotonic_time() < deadline)
        return GLib.SOURCE_CONTINUE;

      resolve();
      return GLib.SOURCE_REMOVE;
    });
  });
}

// Chrome handles SIGTERM like quitting from its menu, saving its session.
// Installed web apps (PWAs) run in the same browser process.
async function quitChrome() {
  const pids = await findBrowserPids();
  if (pids.length === 0) return;

  // A process may exit before the signal, failing kill, so its status is
  // ignored and the others are still waited for.
  const kill = Gio.Subprocess.new(
    ["kill", "-TERM", ...pids],
    Gio.SubprocessFlags.STDERR_SILENCE,
  );
  await kill.wait_async(null);
  await waitForExit(pids);
}

// Chrome does not take part in GNOME's session management, so it is killed
// at logout and offers to restore tabs next time. As a session client, this
// quits Chrome once a logout, restart or shutdown is confirmed.
export class ChromeShutdown {
  constructor() {
    this._cancellable = new Gio.Cancellable();
    this._clientPath = null;

    // Subscribed before registering, so no signal for the client is missed.
    this._subscription = Gio.DBus.session.signal_subscribe(
      SESSION_NAME,
      CLIENT_IFACE,
      null,
      null,
      null,
      Gio.DBusSignalFlags.NONE,
      (_connection, _sender, path, _iface, signal) =>
        this._onSignal(path, signal),
    );

    this._register().catch(logErrorUnlessCancelled);
  }

  destroy() {
    this._cancellable.cancel();
    Gio.DBus.session.signal_unsubscribe(this._subscription);
    if (!this._clientPath) return;

    // Not cancellable, as the cancellable was just cancelled.
    this._callSession(
      "UnregisterClient",
      "(o)",
      [this._clientPath],
      null,
    ).catch(logErrorUnlessCancelled);
  }

  async _register() {
    const reply = await this._callSession(
      "RegisterClient",
      "(ss)",
      [APP_ID, ""],
      this._cancellable,
    );
    [this._clientPath] = reply.deepUnpack();
  }

  _onSignal(path, signal) {
    if (path !== this._clientPath) return;

    if (signal === "QueryEndSession") {
      this._respond();
    } else if (signal === "EndSession") {
      // Always answer, or gnome-session waits for its timeout.
      quitChrome()
        .catch(logErrorUnlessCancelled)
        .finally(() => this._respond());
    }
  }

  _respond() {
    Gio.DBus.session
      .call(
        SESSION_NAME,
        this._clientPath,
        CLIENT_IFACE,
        "EndSessionResponse",
        new GLib.Variant("(bs)", [true, ""]),
        null,
        Gio.DBusCallFlags.NONE,
        -1,
        null,
      )
      .catch(logErrorUnlessCancelled);
  }

  _callSession(method, signature, args, cancellable) {
    return Gio.DBus.session.call(
      SESSION_NAME,
      SESSION_PATH,
      SESSION_NAME,
      method,
      new GLib.Variant(signature, args),
      null,
      Gio.DBusCallFlags.NONE,
      -1,
      cancellable,
    );
  }
}
