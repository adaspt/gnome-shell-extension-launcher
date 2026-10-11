import Shell from "gi://Shell";

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

export function addAppShortcuts(shortcuts, focusRing) {
  const appSystem = Shell.AppSystem.get_default();

  for (const { accelerator, app } of SHORTCUTS)
    shortcuts.add(accelerator, () =>
      focusRing.activateApp(appSystem.lookup_app(app)),
    );
}
