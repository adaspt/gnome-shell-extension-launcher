import Clutter from "gi://Clutter";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import St from "gi://St";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const FADE_DURATION = 2000;
const WINDOW_TYPES = [
  Meta.WindowType.NORMAL,
  Meta.WindowType.DIALOG,
  Meta.WindowType.MODAL_DIALOG,
];

// Switches focus on behalf of the shortcuts and the launcher, flashing a ring
// around the window that receives it.
export class Focus {
  constructor() {
    this._ring = null;
  }

  // Launches a stopped app; otherwise focuses its most recent window, switching
  // to that window's workspace when needed.
  activateApp(app) {
    if (!app) return;

    const isRunning = app.state === Shell.AppState.RUNNING;

    app.activate();
    // A launched app has no window to mark yet.
    if (isRunning) this._flash();
  }

  activateWindow(window) {
    window.activate(global.get_current_time());
    this._flash();
  }

  destroy() {
    this._remove();
  }

  // Marks the focused window with a ring that fades out.
  _flash() {
    this._remove();

    const window = global.display.focus_window;
    if (!WINDOW_TYPES.includes(window?.get_window_type())) return;

    const frame = window.get_frame_rect();
    this._ring = new St.Widget({
      style_class: "launcher-focus-ring",
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
    });

    Main.uiGroup.add_child(this._ring);
    this._ring.ease({
      opacity: 0,
      duration: FADE_DURATION,
      mode: Clutter.AnimationMode.EASE_OUT_QUAD,
      // Only a fade that ran to its end gets here, so the ring is this one.
      onComplete: () => this._remove(),
    });
  }

  _remove() {
    this._ring?.destroy();
    this._ring = null;
  }
}
