import Meta from "gi://Meta";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

import { APPS } from "./apps.js";
import { getTargetRect, moveResizeWindow } from "./geometry.js";

// Falls back to the rightmost monitor when there are fewer than expected.
function getMonitorIndex(position) {
  const monitors = [...Main.layoutManager.monitors].sort((a, b) => a.x - b.x);

  return monitors[Math.min(position, monitors.length - 1)].index;
}

export class WindowRules {
  constructor() {
    global.display.connectObject(
      "window-created",
      (_display, window) => this._onWindowCreated(window),
      this,
    );
  }

  destroy() {
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

    const rule = APPS.find((app) => app.wmClass === window.get_wm_class());
    if (!rule) return;

    const monitor = getMonitorIndex(rule.monitor);
    if (rule.maximized) {
      window.move_to_monitor(monitor);
      window.maximize();
      return;
    }

    const workArea = window.get_work_area_for_monitor(monitor);

    moveResizeWindow(window, getTargetRect(workArea, rule.placement));
  }
}
