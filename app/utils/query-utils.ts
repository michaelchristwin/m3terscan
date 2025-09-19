import type { MeterDataPointEdgeV2 } from "m3ter-graphql-client";
import { getWeek } from "date-fns";

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
  const diffMs = now - past;
  const diffMinutes = diffMs / (1000 * 60);
  return Math.floor(diffMinutes / 15);
}

export function splitIntoGroups<T>(arr: T[], groups: number): T[][] {
  const size = Math.ceil(arr.length / groups);
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

interface WeeklyData {
  totalEnergy: number;
  week: number;
}

export function groupByWeek(data: MeterDataPointEdgeV2[]) {
  const grouped: MeterDataPointEdgeV2[][] = Array.from(
    { length: 52 },
    () => []
  );

  for (const item of data) {
    const ts = item.node?.timestamp;
    if (!ts) continue;

    const d = new Date(ts);
    const week = getWeek(d);
    if (week >= 1 && week <= 52) {
      grouped[week - 1].push(item);
    }
  }
  const final: WeeklyData[] = Array.from({ length: 52 });
  for (let index = 0; index < grouped.length; index++) {
    if (grouped[index].length === 0) {
      final[index] = { totalEnergy: 0, week: index + 1 };
    } else {
      const ts = grouped[index][0].node?.timestamp as number;
      const d = new Date(ts);
      const week = getWeek(d);
      const totalEnergy = grouped[index].reduce(
        (a, b) => a + (b.node?.payload?.energy as number),
        0
      );
      final[index] = { totalEnergy: totalEnergy, week };
    }
  }
  return final;
}
