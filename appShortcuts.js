import Shell from "gi://Shell";

import { activateApp } from "./activateApp.js";
import { Shortcuts } from "./shortcuts.js";

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
  constructor(focusRing) {
    this._focusRing = focusRing;
  }

  enable() {
    const appSystem = Shell.AppSystem.get_default();

    this._shortcuts = new Shortcuts();
    for (const { accelerator, app } of SHORTCUTS)
      this._shortcuts.add(accelerator, () =>
        activateApp(appSystem.lookup_app(app), this._focusRing),
      );
  }

  disable() {
    this._shortcuts.destroy();
    this._shortcuts = null;
  }
}
