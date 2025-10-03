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
