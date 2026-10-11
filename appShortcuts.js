import Shell from "gi://Shell";

import { APPS } from "./apps.js";

export function addAppShortcuts(shortcuts, focus) {
  const appSystem = Shell.AppSystem.get_default();

  for (const { accelerator, app } of APPS)
    shortcuts.add(accelerator, () =>
      focus.activateApp(appSystem.lookup_app(app)),
    );
}
