import z from "zod";
import {
  dehydrate,
  HydrationBoundary,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import type { Mode } from "~/types";
import { useTimeStore } from "~/store";
import { Suspense, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/charts";
import { ErrorBoundary } from "react-error-boundary";
import { ViewToggle } from "~/components/ViewToggle";
import { meterQueries } from "~/queries/meterscan.queries";
import { queryClient as qc } from "~/queries/query-client";
import DailyBarChart from "~/components/charts/DailyBarChart";
import WeeklyHeatmap from "~/components/heatmaps/WeeklyHeatmap";
import MonthlyHeatmap from "~/components/heatmaps/MonthlyHeatmap";
import { BarChartSkeleton } from "~/components/skeletons/BarChartSkeleton";
import WeeklyHeatmapSkeleton from "~/components/skeletons/WeeklyHeatmapSkeleton";
import { BarChartError } from "~/components/error-fallback/BarChartError";
import { HeatmapError } from "~/components/error-fallback/HeatmapError";

const pageSchema = z.coerce.number().int().positive();
const doughnutChartData = {
  labels: ["cUSD", "USDT", "USDe", "xDAI", "DAI", "PYUSD", "USDC"],
  datasets: [
    {
      label: "Tokens",
      data: [25, 5, 25, 10, 3, 5, 22],
      backgroundColor: [
        "#94E9B8",
        "#72F1FF",
        "#92BFFF",
        "#FEA883",
        "#D575ED",
        "#5582E9",
        "#646464",
      ],
      borderRadius: 10,
      spacing: 5,
    },
  ],
};

const options = {
  responsive: true,
  // maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: "bottom" as const,
    },
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const { selectedYear } = useTimeStore.getState();
  const result = pageSchema.safeParse(params.m3terId);
  if (!result.success) {
    throw Error(result.error.message);
  }
  const meterId = result.data;
  await Promise.all([
    qc.prefetchQuery(meterQueries.getDaily(meterId)),
    qc.prefetchQuery(meterQueries.getWeeksOfYear(meterId, selectedYear)),
  ]);
  return { dehydratedState: dehydrate(qc), meterId: meterId };
}

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    {
      title: `Charts for M3ter ${params.m3terId}`,
    },
    {
      name: "description",
      content: `Charts to represent useful data for m3ter ${params.m3terId}`,
    },
  ];
};

export default function Charts() {
  const { dehydratedState, meterId } = useLoaderData<typeof loader>();

  const [viewMode, setViewMode] = useState<Mode>("yearly");

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="h-full grid grid-cols-1 md:grid-cols-[9fr_2fr] gap-4 pb-12.5">
        <div className="px-4 md:px-6 pt-6 pb-8 bg-background-primary rounded-lg h-full mx-4">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={BarChartError}>
                <Suspense fallback={<BarChartSkeleton />}>
                  <DailyBarChart meterId={meterId} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>

          <div className="p-10 bg-background text-foreground rounded-lg mt-5 min-h-120.5 w-full">
            <div className="">
              <div className="text-center flex justify-between items-center mb-3">
                <h3 className="text-foreground text-[17px] md:text-[19px] font-medium">
                  Revenue Heatmap
                </h3>
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary onReset={reset} FallbackComponent={HeatmapError}>
                  <Suspense fallback={<WeeklyHeatmapSkeleton />}>
                    {viewMode === "yearly" ? (
                      <WeeklyHeatmap meterId={meterId} viewMode={viewMode} />
                    ) : (
                      <MonthlyHeatmap viewMode={viewMode} meterId={meterId} />
                    )}
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </div>
        </div>
        <div className="w-full">
          <div className="w-[97%] md:block flex justify-center mx-auto h-75">
            <Doughnut data={doughnutChartData} options={options} />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
