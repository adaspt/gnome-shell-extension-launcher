import Shell from "gi://Shell";

// Launches a stopped app; otherwise focuses its most recent window, switching
// to that window's workspace when needed, and flashes the focus ring on it.
export function activateApp(app, focusRing) {
  if (!app) return;

  const isRunning = app.state === Shell.AppState.RUNNING;

  app.activate();
  // A launched app has no window to mark yet.
  if (isRunning) focusRing.flash();
}
