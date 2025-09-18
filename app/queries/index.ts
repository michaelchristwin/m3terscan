import { readContract } from "@wagmi/core";
import { fromHex } from "viem";
import { config } from "~/config/wagmi";
import { stateContract } from "~/config/contracts";
import { m3terClient } from "~/config/m3terClient";
import { getQuarterHoursSince } from "~/utils/query-utils";

export const fetchChartData = async (m3terId: number) => {
  const result = await readContract(config, {
    ...stateContract,
    functionName: "nonce",
    args: [BigInt(m3terId)],
  });
  const currentNonce = fromHex(result, "number");

  // Then get the last 96 nonces (24 hours)
  const startNonce = Math.max(1, currentNonce - 95); // -95 because we include currentNonce
  const nonces = Array.from({ length: 96 }, (_, i) => startNonce + i);
  return m3terClient.v2.dataPoints.getMeterDataPoints({
    meterNumber: m3terId,
    nonces: nonces,
  });
};

export const fetchHeatmapData = async (
  startDate: Date,
  m3terId: number,
  totalDays: number
) => {
  // Get current nonce from blockchain
  const result = await readContract(config, {
    ...stateContract,
    functionName: "nonce",
    args: [BigInt(m3terId)],
  });
  const currentNonce = fromHex(result, "number");

  // Calculate how many 15-minute intervals since startDate
  const intervalsSinceStart = getQuarterHoursSince(startDate);

  // Calculate the nonce range
  const startNonce = Math.max(1, currentNonce - intervalsSinceStart);
  const nonceMove = totalDays * 96; // 96 intervals per day (24 * 4)
  const endNonce = Math.min(currentNonce, startNonce + nonceMove);

  // Validate range
  if (startNonce > endNonce) {
    throw new Error("Invalid nonce range: startNonce > endNonce");
  }

  // Generate the correct nonce range array
  const nonceRange = Array.from(
    { length: endNonce - startNonce + 1 },
    (_, i) => startNonce + i
  );

  const dataPromise = m3terClient.v2.dataPoints.getMeterDataPoints({
    meterNumber: m3terId,
    nonces: nonceRange,
  });

  return dataPromise;
};
