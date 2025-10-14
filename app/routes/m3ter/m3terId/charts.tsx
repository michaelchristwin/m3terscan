import type { Route } from "./+types/charts";
import { Suspense } from "react";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";
import { viewMode, ViewToggle } from "~/components/ViewToggle";
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
import { useSignals } from "@preact/signals-react/runtime";
import { useComputed } from "@preact/signals-react";
import WeeklyHeatmap from "~/components/heatmaps/WeeklyHeatmap";
import MonthlyHeatmap from "~/components/heatmaps/MonthlyHeatmap";
import DailyBarChart from "~/components/charts/DailyBarChart";
import WeeklyHeatmapSkeleton from "~/components/skeletons/WeeklyHeatmapSkeleton";
import { queryClient } from "~/queries/ts-client";
import { getDailyCharts, getWeeklyCharts } from "~/queries";
import { selectedYear } from "~/components/YearSelector";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useLoaderData } from "react-router";
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
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["chartData", params.m3terId],
      queryFn: () => getDailyCharts(params.m3terId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["heatmapData", params.m3terId, selectedYear.value],
      queryFn: () => getWeeklyCharts(params.m3terId, selectedYear.value),
    }),
  ]);
  return { dehydratedState: dehydrate(queryClient) };
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
  useSignals();
  const { m3terId } = params;
  const isYearly = useComputed(() => viewMode.value === "yearly");
  const isMonthly = useComputed(() => viewMode.value === "monthly");
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="h-full grid grid-cols-1 md:grid-cols-[9fr_2fr] gap-4 pb-[50px]">
        <div className="px-4 md:px-6 pt-6 pb-8 bg-[var(--background-primary)] rounded-lg h-full mx-4">
          <Suspense fallback={<BarChartSkeleton />}>
            <DailyBarChart m3terId={m3terId} />
          </Suspense>
          <div className="p-10 bg-background text-foreground rounded-lg mt-5 min-h-[482px] w-full">
            <div className="">
              <div className="text-center flex justify-between items-center mb-3">
                <h3 className="text-foreground text-[17px] md:text-[19px] font-medium">
                  Revenue Heatmap
                </h3>
                <ViewToggle />
              </div>
            </div>
            <Suspense fallback={<WeeklyHeatmapSkeleton />}>
              {isYearly.value && <WeeklyHeatmap m3terId={m3terId} />}
            </Suspense>
            {isMonthly.value && <MonthlyHeatmap m3terId={m3terId} />}
          </div>
        </div>
        <div className="w-full">
          <div className="w-[97%] md:block flex justify-center mx-auto h-[300px]">
            <Doughnut data={doughnutChartData} options={options} />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
