import type { Route } from "./+types/charts";
import { Suspense, useState } from "react";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";
import { ViewToggle } from "~/components/ViewToggle";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import WeeklyHeatmap from "~/components/heatmaps/WeeklyHeatmap";
import MonthlyHeatmap from "~/components/heatmaps/MonthlyHeatmap";
import DailyBarChart from "~/components/charts/DailyBarChart";
import WeeklyHeatmapSkeleton from "~/components/skeletons/WeeklyHeatmapSkeleton";
import { queryClient as qc } from "~/queries/query-client";
import {
  getDailyM3TerM3TerIdDailyGetOptions,
  getWeeksOfYearM3TerM3TerIdWeeksYearGetOptions,
} from "~/api-client/@tanstack/react-query.gen";
import { m3terscanClient } from "~/queries/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import type { Mode } from "~/types";
import { useTimeStore } from "~/store";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

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
  await Promise.all([
    qc.prefetchQuery({
      ...getDailyM3TerM3TerIdDailyGetOptions({
        client: m3terscanClient,
        path: { m3ter_id: Number(params.m3terId) },
      }),
    }),
    qc.prefetchQuery({
      ...getWeeksOfYearM3TerM3TerIdWeeksYearGetOptions({
        client: m3terscanClient,
        path: { m3ter_id: Number(params.m3terId), year: selectedYear },
      }),
    }),
  ]);
  return { dehydratedState: dehydrate(qc) };
}

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    {
      title: `Charts for M3ter ${params.m3terId} | M3terscan`,
    },
    {
      name: "description",
      content: `Charts to represent useful data for m3ter ${params.m3terId}`,
    },
  ];
};

export default function Charts({ params }: Route.ComponentProps) {
  const { dehydratedState } = useLoaderData<typeof loader>();
  const { m3terId } = params;
  const [viewMode, setViewMode] = useState<Mode>("yearly");

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="h-full grid grid-cols-1 md:grid-cols-[9fr_2fr] gap-4 pb-12.5">
        <div className="px-4 md:px-6 pt-6 pb-8 bg-background-primary rounded-lg h-full mx-4">
          <DailyBarChart m3terId={m3terId} />

          <div className="p-10 bg-background text-foreground rounded-lg mt-5 min-h-120.5 w-full">
            <div className="">
              <div className="text-center flex justify-between items-center mb-3">
                <h3 className="text-foreground text-[17px] md:text-[19px] font-medium">
                  Revenue Heatmap
                </h3>
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>
            <Suspense fallback={<WeeklyHeatmapSkeleton />}>
              {viewMode === "yearly" ? (
                <WeeklyHeatmap m3terId={m3terId} viewMode={viewMode} />
              ) : (
                <MonthlyHeatmap viewMode={viewMode} m3terId={m3terId} />
              )}
            </Suspense>
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
