export function lightenColor(hex, percent) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function computeOrder(before, after) {
  if (before !== undefined && after !== undefined) {
    return (before + after) / 2
  } else if (before === undefined && after !== undefined) {
    return after - 100
  } else if (before !== undefined && after === undefined) {
    return before + 100
  } else {
    return 1000
  }
}
