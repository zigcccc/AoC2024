export function removeFromArray<T extends unknown[]>(arr: T, idx: number, count = 1) {
  const copy = [...arr];
  copy.splice(idx, count);
  return copy;
}

export function copy2DArray<T extends unknown[][]>(arr: T) {
  return arr.map((arr) => arr.slice()) as T;
}
