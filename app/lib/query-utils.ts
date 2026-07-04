export function decodeParam(q: string | null) {
  if (!q) return null;
  else {
    return decodeURIComponent(q);
  }
}

export function formatDateTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;

  const day = date.getDate();
  const year = date.getFullYear();

  const month = date.toLocaleString("default", { month: "long" });

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month}, ${year} at ${time}`;
}

export function hexToChunks(hexStr: string, chunkSize = 6) {
  if (hexStr.startsWith("0x")) {
    hexStr = hexStr.slice(2);
  }
  const newHex = "00".concat(hexStr);

  const chunks = [];
  for (let i = 0; i < newHex.length; i += chunkSize * 2) {
    const part = newHex.slice(i, i + chunkSize * 2);
    if (part.length === 0) continue;

    // Convert the chunk to a number
    const num = parseInt(part, 16);
    chunks.push(num);
  }
  return chunks;
}
