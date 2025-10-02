export function decodeParam(q: string | null) {
  if (!q) return null;
  else {
    return decodeURIComponent(q);
  }
}
