import Meta from "gi://Meta";
import Shell from "gi://Shell";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

// Unlike Main.wm.addKeybinding(), grabbing needs no settings schema.
export class Shortcuts {
  constructor() {
    this._handlers = new Map();

    global.display.connectObject(
      "accelerator-activated",
      (_display, action) => this._handlers.get(action)?.(),
      this,
    );
  }

  add(accelerator, handler) {
    const action = global.display.grab_accelerator(
      accelerator,
      Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
    );
    if (action === Meta.KeyBindingAction.NONE) {
      console.warn(`Launcher: ${accelerator} is already taken`);
      return;
    }

    Main.wm.allowKeybinding(
      Meta.external_binding_name_for_action(action),
      Shell.ActionMode.NORMAL,
    );
    this._handlers.set(action, handler);
    return action;
  }

  setActionModes(action, modes) {
    if (!this._handlers.has(action)) return;

    Main.wm.allowKeybinding(
      Meta.external_binding_name_for_action(action),
      modes,
    );
  }

  destroy() {
    global.display.disconnectObject(this);
    for (const action of this._handlers.keys())
      global.display.ungrab_accelerator(action);

    this._handlers.clear();
  }
}
