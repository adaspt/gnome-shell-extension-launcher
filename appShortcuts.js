import Meta from "gi://Meta";
import Shell from "gi://Shell";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const SHORTCUTS = [
  { accelerator: "<Super>Return", app: "com.mitchellh.ghostty.desktop" },
  { accelerator: "<Shift><Super>Return", app: "com.microsoft.VSCode.desktop" },
  { accelerator: "<Shift><Super>w", app: "google-chrome.desktop" },
  { accelerator: "<Shift><Super>a", app: "com.anthropic.Claude.desktop" },
  { accelerator: "<Shift><Super>i", app: "chatgpt.desktop" },
  {
    // Microsoft Teams PWA
    accelerator: "<Shift><Super>m",
    app: "chrome-ompifgpmddkgmclendfeacglnodjjndh-Default.desktop",
  },
  { accelerator: "<Shift><Super>n", app: "org.gnome.TextEditor.desktop" },
];

export class AppShortcuts {
  enable() {
    this._apps = new Map();

    // Unlike Main.wm.addKeybinding(), grabbing needs no settings schema.
    for (const { accelerator, app } of SHORTCUTS) {
      const action = global.display.grab_accelerator(
        accelerator,
        Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
      );
      if (action === Meta.KeyBindingAction.NONE) {
        console.warn(`Launcher: ${accelerator} is already taken`);
        continue;
      }

      Main.wm.allowKeybinding(
        Meta.external_binding_name_for_action(action),
        Shell.ActionMode.NORMAL,
      );
      this._apps.set(action, app);
    }

    global.display.connectObject(
      "accelerator-activated",
      (_display, action) => this._activateApp(action),
      this,
    );
  }

  disable() {
    global.display.disconnectObject(this);
    for (const action of this._apps.keys())
      global.display.ungrab_accelerator(action);

    this._apps = null;
  }

  _activateApp(action) {
    const id = this._apps.get(action);
    if (!id) return;

    // Launches a stopped app; otherwise focuses its most recent window,
    // switching to that window's workspace when needed.
    Shell.AppSystem.get_default().lookup_app(id)?.activate();
  }
}
