// Placements in fractions of a work area.
export const LEFT_THREE_QUARTERS = { x: 0, y: 0, width: 0.75, height: 1 };
export const RIGHT_THREE_QUARTERS = { x: 0.25, y: 0, width: 0.75, height: 1 };
export const RIGHT_HALF = { x: 0.5, y: 0, width: 0.5, height: 1 };

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Rounds the edges rather than the size, so adjacent fractions never overlap.
export function getTargetRect(workArea, placement) {
  const left = Math.round(workArea.width * placement.x);
  const top = Math.round(workArea.height * placement.y);
  const right = Math.round(workArea.width * (placement.x + placement.width));
  const bottom = Math.round(
    workArea.height * (placement.y + placement.height),
  );

  return {
    x: workArea.x + left,
    y: workArea.y + top,
    width: right - left,
    height: bottom - top,
  };
}

export function moveResizeWindow(window, { x, y, width, height }) {
  // Tiled windows are vertically maximized, so this untiles them too.
  if (window.get_maximize_flags() !== 0) window.unmaximize();

  window.move_resize_frame(true, x, y, width, height);
}
