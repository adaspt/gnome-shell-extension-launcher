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

export class FocusRing {
  constructor() {
    this._ring = null;
  }

  // Marks the focused window with a ring that fades out.
  flash() {
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

  destroy() {
    this._remove();
  }

  _remove() {
    this._ring?.destroy();
    this._ring = null;
  }
}
