import Meta from "gi://Meta";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

// monitor counts monitors from left to right, starting at 0. A rule is either
// maximized or a rectangle in fractions of that monitor's work area.
const RULES = [
  {
    wmClass: "com.mitchellh.ghostty",
    monitor: 0,
    x: 0.25,
    y: 0,
    width: 0.75,
    height: 1,
  },
  {
    wmClass: "com.anthropic.Claude",
    monitor: 0,
    x: 0.25,
    y: 0,
    width: 0.75,
    height: 1,
  },
  {
    wmClass: "Chatgpt",
    monitor: 0,
    x: 0.25,
    y: 0,
    width: 0.75,
    height: 1,
  },
  {
    wmClass: "org.gnome.TextEditor",
    monitor: 1,
    x: 0.5,
    y: 0,
    width: 0.5,
    height: 1,
  },
  { wmClass: "com.microsoft.VSCode", monitor: 1, maximized: true },
  { wmClass: "google-chrome", monitor: 2, maximized: true },
  {
    // Microsoft Teams PWA
    wmClass: "chrome-ompifgpmddkgmclendfeacglnodjjndh-Default",
    monitor: 0,
    maximized: true,
  },
];

// Falls back to the rightmost monitor when there are fewer than expected.
function getMonitorIndex(position) {
  const monitors = [...Main.layoutManager.monitors].sort((a, b) => a.x - b.x);

  return monitors[Math.min(position, monitors.length - 1)].index;
}

// Rounds the edges rather than the size, so adjacent fractions never overlap.
function getTargetRect(workArea, rule) {
  const left = Math.round(workArea.width * rule.x);
  const top = Math.round(workArea.height * rule.y);
  const right = Math.round(workArea.width * (rule.x + rule.width));
  const bottom = Math.round(workArea.height * (rule.y + rule.height));

  return {
    x: workArea.x + left,
    y: workArea.y + top,
    width: right - left,
    height: bottom - top,
  };
}

export class WindowRules {
  enable() {
    global.display.connectObject(
      "window-created",
      (_display, window) => this._onWindowCreated(window),
      this,
    );
  }

  disable() {
    global.display.disconnectObject(this);
    for (const actor of global.get_window_actors())
      actor.disconnectObject(this);
  }

  _onWindowCreated(window) {
    // On Wayland the window has no wm_class or size before its first frame.
    window
      .get_compositor_private()
      .connectObject("first-frame", () => this._applyRule(window), this);
  }

  _applyRule(window) {
    if (window.get_window_type() !== Meta.WindowType.NORMAL) return;

    const rule = RULES.find((r) => r.wmClass === window.get_wm_class());
    if (!rule) return;

    const monitor = getMonitorIndex(rule.monitor);
    if (rule.maximized) {
      window.move_to_monitor(monitor);
      window.maximize();
      return;
    }

    const workArea = window.get_work_area_for_monitor(monitor);
    const { x, y, width, height } = getTargetRect(workArea, rule);

    window.move_resize_frame(true, x, y, width, height);
  }
}
