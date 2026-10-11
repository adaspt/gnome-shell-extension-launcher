import Meta from "gi://Meta";

import {
  LEFT_THREE_QUARTERS,
  RIGHT_THREE_QUARTERS,
  clamp,
  getTargetRect,
  moveResizeWindow,
} from "./geometry.js";

const INCREASE_ACCELERATOR = "<Super>equal";
const DECREASE_ACCELERATOR = "<Super>minus";
const FILL_ACCELERATOR = "<Super>f";
const THREE_QUARTER_ACCELERATOR = "<Super>r";
const WIDTH_STEPS = 10;
// Pixels by which a window may miss a step and still count as being on it,
// e.g. when size increments keep it from reaching the exact width.
const SNAP_TOLERANCE = 8;

const ResizeDirection = {
  INCREASE: 1,
  DECREASE: -1,
};

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
function getThreeQuarterRect(frame, workArea) {
  const right = getTargetRect(workArea, RIGHT_THREE_QUARTERS);
  const frameRight = frame.x + frame.width;
  const isAtRight =
    Math.abs(frame.width - right.width) <= SNAP_TOLERANCE &&
    Math.abs(frameRight - (right.x + right.width)) <= SNAP_TOLERANCE;

  return isAtRight ? getTargetRect(workArea, LEFT_THREE_QUARTERS) : right;
}

function getResizableFocusedWindow() {
  const window = global.display.focus_window;
  if (window?.get_window_type() !== Meta.WindowType.NORMAL) return null;
  // Unlike allows_resize(), resizeable stays true while maximized.
  if (!window.resizeable || !window.allows_move()) return null;

  return window;
}

function resizeFocusedWindow(direction) {
  const window = getResizableFocusedWindow();
  if (!window) return;

  const frame = window.get_frame_rect();
  const workArea = window.get_work_area_current_monitor();

  const targetWidth = getTargetWidth(frame.width, workArea.width, direction);
  if (targetWidth === frame.width) return;

  const targetX = getTargetX(frame, workArea, targetWidth);

  moveResizeWindow(window, {
    x: targetX,
    y: frame.y,
    width: targetWidth,
    height: frame.height,
  });
}

function fillWorkArea() {
  const window = getResizableFocusedWindow();
  if (!window) return;

  moveResizeWindow(window, window.get_work_area_current_monitor());
}

function placeThreeQuarterWidth() {
  const window = getResizableFocusedWindow();
  if (!window) return;

  const frame = window.get_frame_rect();
  const workArea = window.get_work_area_current_monitor();

  moveResizeWindow(window, getThreeQuarterRect(frame, workArea));
}

export function addWindowSizeShortcuts(shortcuts) {
  shortcuts.add(INCREASE_ACCELERATOR, () =>
    resizeFocusedWindow(ResizeDirection.INCREASE),
  );
  shortcuts.add(DECREASE_ACCELERATOR, () =>
    resizeFocusedWindow(ResizeDirection.DECREASE),
  );
  shortcuts.add(FILL_ACCELERATOR, fillWorkArea);
  shortcuts.add(THREE_QUARTER_ACCELERATOR, placeThreeQuarterWidth);
}
