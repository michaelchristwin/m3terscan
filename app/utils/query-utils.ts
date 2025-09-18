export function chunkArray(arr: number[], size: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function getQuarterHoursSince(
  timestamp: number | string | Date
): number {
  const past = new Date(timestamp).getTime();
  const now = Date.now();

  if (past > now) {
    throw new Error("Timestamp must be in the past");
  }

  const diffMs = now - past; // difference in milliseconds
  const diffMinutes = diffMs / (1000 * 60);
  return Math.floor(diffMinutes / 15); // number of 15-minute intervals
}
