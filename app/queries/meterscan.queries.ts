import { queryOptions } from "@tanstack/react-query";
import { Configuration, MeterApi, ProposalApi } from "~/api-sdk";

const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
});

const meterApi = new MeterApi(config);
const proposalApi = new ProposalApi(config);

export const meterQueries = {
  getDaily: (meterId: number) =>
    queryOptions({
      queryKey: ["getDaily", meterId],
      queryFn: () =>
        meterApi.getDailyMeterMeterIdDailyGet(meterId).then((r) => r.data),
    }),

  getMonthOfYear: (meterId: number, year: number, month: number) =>
    queryOptions({
      queryKey: ["getMonthOfYear", meterId, year, month],
      queryFn: () =>
        meterApi
          .getMonthOfYearMeterMeterIdMonthMonthYearGet(meterId, year, month)
          .then((r) => r.data),
    }),

  getWeeksOfYear: (meterId: number, year: number) =>
    queryOptions({
      queryKey: ["getWeeksOfYear", meterId, year],
      queryFn: () =>
        meterApi
          .getWeeksOfYearMeterMeterIdWeeksYearGet(meterId, year)
          .then((r) => r.data),
    }),

  getActivities: (meterId: number, after?: string, limit?: number) =>
    queryOptions({
      queryKey: ["getActivities", meterId, after, limit],
      queryFn: () =>
        meterApi
          .getActivitiesMeterMeterIdActivitiesGet(meterId, after, limit)
          .then((r) => r.data),
    }),
};

export const proposalQueries = {
  getProposals: (txHash: string) =>
    queryOptions({
      queryKey: ["getProposals", txHash],
      queryFn: () =>
        proposalApi.getProposalProposalTxHashGet(txHash).then((r) => r.data),
    }),
};
