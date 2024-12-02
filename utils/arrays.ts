export function removeFromArray<T extends unknown[]>(arr: T, idx: number, count = 1) {
  const copy = [...arr];
  copy.splice(idx, count);
  return copy;
}
