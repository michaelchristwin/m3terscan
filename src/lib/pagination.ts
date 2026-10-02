/** Returns e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 20] */
export function getPageItems(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("ellipsis");
    items.push(p);
  });
  return items;
}
