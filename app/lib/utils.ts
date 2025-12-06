import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { WeeksOfYearResponse } from "~/api-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function splitInto4(arr: WeeksOfYearResponse[]) {
  const size = Math.ceil(arr.length / 4);
  return [
    arr.slice(0, size),
    arr.slice(size, size * 2),
    arr.slice(size * 2, size * 3),
    arr.slice(size * 3),
  ];
}
