import { graphql } from "../graphql";
import { client } from "~/client/client.gen";
import {
  getDailyMeterMeterIdDailyGet,
  getMonthOfYearMeterMeterIdMonthMonthYearGet,
  getWeeksOfYearMeterMeterIdWeeksYearGet,
  getActivitiesMeterMeterIdActivitiesGet,
  getProposalProposalTxHashGet,
} from "~/client/sdk.gen";
import { queryOptions } from "@tanstack/react-query";

export const M3TERSCAN_API = import.meta.env.VITE_API_URL;

client.setConfig({ baseUrl: M3TERSCAN_API });

export const meterQueries = {
  getDaily: (meterId: number) =>
    queryOptions({
      queryKey: ["getDaily", meterId],
      queryFn: () =>
        getDailyMeterMeterIdDailyGet({ path: { meter_id: meterId } }).then(
          (r) => r.data,
        ),
    }),

  getMonthOfYear: (meterId: number, year: number, month: number) =>
    queryOptions({
      queryKey: ["getMonthOfYear", meterId, year, month],
      queryFn: () =>
        getMonthOfYearMeterMeterIdMonthMonthYearGet({
          path: { meter_id: meterId, month, year },
        }).then((r) => r.data),
    }),

  getWeeksOfYear: (meterId: number, year: number) =>
    queryOptions({
      queryKey: ["getWeeksOfYear", meterId, year],
      queryFn: () =>
        getWeeksOfYearMeterMeterIdWeeksYearGet({
          path: { meter_id: meterId, year },
        }).then((r) => r.data),
    }),

  getActivities: (meterId: number, after?: string, limit?: number) =>
    queryOptions({
      queryKey: ["getActivities", meterId, after, limit],
      queryFn: () =>
        getActivitiesMeterMeterIdActivitiesGet({
          path: {
            meter_id: meterId,
          },
          query: {
            after,
            limit,
          },
        }).then((r) => r.data),
    }),
};

export const proposalQueries = {
  getProposals: (txHash: string) =>
    queryOptions({
      queryKey: ["getProposals", txHash],
      queryFn: () =>
        getProposalProposalTxHashGet({ path: { tx_hash: txHash } }).then(
          (r) => r.data,
        ),
    }),
};

export const commitsQuery = graphql(`
  query CommitsList($limit: Int = 10, $offset: Int = 0) {
    commits(
      limit: $limit
      offset: $offset
      orderBy: "blockTime"
      orderDirection: "DESC"
    ) {
      items {
        txHash
        blockTime
        sender
      }
      totalCount
    }
  }
`);

export async function getRecentBlocks() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/recent-blocks`,
    {
      method: "GET",
    },
  );
  const data = await response.json();
  return data;
}

export async function refreshRecentBlocks() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/recent-blocks`,
    {
      method: "POST",
    },
  );

  return response;
}

export async function getWorldState() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/world-state`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}
