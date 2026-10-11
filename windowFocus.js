import Meta from "gi://Meta";

const MONITOR_LEFT_ACCELERATOR = "<Super><Control>Left";
const MONITOR_RIGHT_ACCELERATOR = "<Super><Control>Right";
const NEXT_WINDOW_ACCELERATOR = "<Super><Control>Down";
const PREVIOUS_WINDOW_ACCELERATOR = "<Super><Control>Up";

const CycleDirection = {
  NEXT: 1,
  PREVIOUS: -1,
};

// The focused window's monitor, or the pointer's one if nothing is focused.
function getCurrentMonitor() {
  return (
    global.display.focus_window?.get_monitor() ??
    global.display.get_current_monitor()
  );
}

// Switchable windows visible on the monitor in the active workspace.
function getMonitorWindows(monitor) {
  const workspace = global.workspace_manager.get_active_workspace();

  return global.display
    .get_tab_list(Meta.TabList.NORMAL, workspace)
    .filter(
      (window) =>
        window.get_monitor() === monitor && window.showing_on_its_workspace(),
    );
}

// New windows open on the pointer's monitor, so the pointer follows focus.
function movePointerToMonitor(monitor) {
  const geometry = global.display.get_monitor_geometry(monitor);
  const seat = global.stage.context.get_backend().get_default_seat();

  seat.warp_pointer(
    Math.round(geometry.x + geometry.width / 2),
    Math.round(geometry.y + geometry.height / 2),
  );
}

function focusNeighborMonitor(direction, focusRing) {
  const monitor = global.display.get_monitor_neighbor_index(
    getCurrentMonitor(),
    direction,
  );
  if (monitor < 0) return;

  movePointerToMonitor(monitor);

  const windows = getMonitorWindows(monitor);
  if (windows.length === 0) {
    // Without a focused window the pointer's monitor is the current one.
    global.display.unset_input_focus(global.get_current_time());
    return;
  }

  // Sorted from the lowest to the topmost.
  const topmost = global.display.sort_windows_by_stacking(windows).at(-1);

  focusRing.activateWindow(topmost);
}

function cycleMonitorWindows(direction, focusRing) {
  // Activating a window changes both stacking and MRU order, so the cycle
  // follows the order in which the windows were created instead.
  const windows = getMonitorWindows(getCurrentMonitor()).sort(
    (a, b) => a.get_stable_sequence() - b.get_stable_sequence(),
  );
  if (windows.length === 0) return;

  const index = windows.indexOf(global.display.focus_window);
  // Nothing in the cycle is focused: start from its first or last window.
  const targetIndex =
    index < 0 && direction === CycleDirection.PREVIOUS
      ? windows.length - 1
      : (index + direction + windows.length) % windows.length;
  if (targetIndex === index) return;

  focusRing.activateWindow(windows[targetIndex]);
}

export function addWindowFocusShortcuts(shortcuts, focusRing) {
  shortcuts.add(MONITOR_LEFT_ACCELERATOR, () =>
    focusNeighborMonitor(Meta.DisplayDirection.LEFT, focusRing),
  );
  shortcuts.add(MONITOR_RIGHT_ACCELERATOR, () =>
    focusNeighborMonitor(Meta.DisplayDirection.RIGHT, focusRing),
  );
  shortcuts.add(NEXT_WINDOW_ACCELERATOR, () =>
    cycleMonitorWindows(CycleDirection.NEXT, focusRing),
  );
  shortcuts.add(PREVIOUS_WINDOW_ACCELERATOR, () =>
    cycleMonitorWindows(CycleDirection.PREVIOUS, focusRing),
  );
}
