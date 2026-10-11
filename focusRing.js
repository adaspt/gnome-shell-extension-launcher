import Clutter from "gi://Clutter";
import Meta from "gi://Meta";
import St from "gi://St";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const FADE_DURATION = 2000;
const WINDOW_TYPES = [
  Meta.WindowType.NORMAL,
  Meta.WindowType.DIALOG,
  Meta.WindowType.MODAL_DIALOG,
];

// Marks the newly focused window with a ring that fades out.
export class FocusRing {
  enable() {
    this._ring = null;

    global.display.connectObject(
      "notify::focus-window",
      () => this._flash(),
      this,
    );
  }

  disable() {
    global.display.disconnectObject(this);
    this._remove();
  }

  _flash() {
    this._remove();

    const window = global.display.focus_window;
    if (!WINDOW_TYPES.includes(window?.get_window_type())) return;

    const frame = window.get_frame_rect();
    const ring = new St.Widget({
      style_class: "launcher-focus-ring",
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
    });
    this._ring = ring;

    Main.uiGroup.add_child(ring);
    ring.ease({
      opacity: 0,
      duration: FADE_DURATION,
      mode: Clutter.AnimationMode.EASE_OUT_QUAD,
      onComplete: () => {
        if (this._ring === ring) this._ring = null;

        ring.destroy();
      },
    });
  }

  _remove() {
    this._ring?.destroy();
    this._ring = null;
  }
}
