import Shell from "gi://Shell";

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

// Launches a stopped app; otherwise focuses its most recent window, switching
// to that window's workspace when needed.
function activateApp(id) {
  Shell.AppSystem.get_default().lookup_app(id)?.activate();
}

export class AppShortcuts {
  enable() {
    this._shortcuts = new Shortcuts();
    for (const { accelerator, app } of SHORTCUTS)
      this._shortcuts.add(accelerator, () => activateApp(app));
  }

  disable() {
    this._shortcuts.destroy();
    this._shortcuts = null;
  }
}
