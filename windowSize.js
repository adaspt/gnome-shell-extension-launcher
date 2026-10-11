import Meta from "gi://Meta";

import { Shortcuts } from "./shortcuts.js";

const INCREASE_ACCELERATOR = "<Super>equal";
const DECREASE_ACCELERATOR = "<Super>minus";
const FILL_ACCELERATOR = "<Super>f";
const THREE_QUARTER_ACCELERATOR = "<Super>r";
const WIDTH_STEPS = 10;
const THREE_QUARTER_WIDTH = 0.75;
// Pixels by which a window may miss a step and still count as being on it,
// e.g. when size increments keep it from reaching the exact width.
const SNAP_TOLERANCE = 8;

const ResizeDirection = {
  INCREASE: 1,
  DECREASE: -1,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTargetWidth(currentWidth, workAreaWidth, direction) {
  const step = workAreaWidth / WIDTH_STEPS;
  const targetSteps =
    direction === ResizeDirection.INCREASE
      ? Math.floor((currentWidth + SNAP_TOLERANCE) / step) + 1
      : Math.ceil((currentWidth - SNAP_TOLERANCE) / step) - 1;

  return Math.round(clamp(targetSteps, 1, WIDTH_STEPS) * step);
}

// Keeps the edge nearest to the work area border in place.
function getTargetX(frame, workArea, targetWidth) {
  const frameRight = frame.x + frame.width;
  const workAreaRight = workArea.x + workArea.width;
  const anchorRight = workAreaRight - frameRight < frame.x - workArea.x;

  return clamp(
    anchorRight ? frameRight - targetWidth : frame.x,
    workArea.x,
    workAreaRight - targetWidth,
  );
}

// Right edge first; a window already sitting there goes to the left edge.
function getThreeQuarterX(frame, workArea, targetWidth) {
  const workAreaRight = workArea.x + workArea.width;
  const isAtRight =
    Math.abs(frame.width - targetWidth) <= SNAP_TOLERANCE &&
    Math.abs(frame.x + frame.width - workAreaRight) <= SNAP_TOLERANCE;

  return isAtRight ? workArea.x : workAreaRight - targetWidth;
}

function getResizableFocusedWindow() {
  const window = global.display.focus_window;
  if (window?.get_window_type() !== Meta.WindowType.NORMAL) return null;
  // Unlike allows_resize(), resizeable stays true while maximized.
  if (!window.resizeable || !window.allows_move()) return null;

  return window;
}

function moveResizeWindow(window, x, y, width, height) {
  // Tiled windows are vertically maximized, so this untiles them too.
  if (window.get_maximize_flags() !== 0) window.unmaximize();

  window.move_resize_frame(true, x, y, width, height);
}

function resizeFocusedWindow(direction) {
  const window = getResizableFocusedWindow();
  if (!window) return;

  const frame = window.get_frame_rect();
  const workArea = window.get_work_area_current_monitor();

  const targetWidth = getTargetWidth(frame.width, workArea.width, direction);
  if (targetWidth === frame.width) return;

  const targetX = getTargetX(frame, workArea, targetWidth);

  moveResizeWindow(window, targetX, frame.y, targetWidth, frame.height);
}

function fillWorkArea() {
  const window = getResizableFocusedWindow();
  if (!window) return;

  const { x, y, width, height } = window.get_work_area_current_monitor();

  moveResizeWindow(window, x, y, width, height);
}

function placeThreeQuarterWidth() {
  const window = getResizableFocusedWindow();
  if (!window) return;

  const frame = window.get_frame_rect();
  const workArea = window.get_work_area_current_monitor();

  const targetWidth = Math.round(workArea.width * THREE_QUARTER_WIDTH);
  const targetX = getThreeQuarterX(frame, workArea, targetWidth);

  moveResizeWindow(window, targetX, workArea.y, targetWidth, workArea.height);
}

export class WindowSize {
  enable() {
    this._shortcuts = new Shortcuts();
    this._shortcuts.add(INCREASE_ACCELERATOR, () =>
      resizeFocusedWindow(ResizeDirection.INCREASE),
    );
    this._shortcuts.add(DECREASE_ACCELERATOR, () =>
      resizeFocusedWindow(ResizeDirection.DECREASE),
    );
    this._shortcuts.add(FILL_ACCELERATOR, () => fillWorkArea());
    this._shortcuts.add(THREE_QUARTER_ACCELERATOR, () =>
      placeThreeQuarterWidth(),
    );
  }

  disable() {
    this._shortcuts.destroy();
    this._shortcuts = null;
  }
}
