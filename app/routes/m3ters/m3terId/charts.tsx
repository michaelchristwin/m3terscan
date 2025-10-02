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
      data: [25, 5, 25, 10, 3, 5, 22], // 👈 values
      backgroundColor: [
        "#94E9B8",
        "#72F1FF",
        "#92BFFF",
        "#FEA883",
        "#D575ED",
        "#5582E9",
        "#646464",
      ],
      borderRadius: 10, // 👈 rounded edges
      spacing: 5, // 👈 gap between slices
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "bottom" as const, // 👈 force literal type
    },
  },
};

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

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[10fr_2fr] pb-[50px]">
      <div className="px-[30px] pt-[37px] pb-[41px] bg-[var(--background-primary)] rounded-lg h-full mx-4">
        <Suspense fallback={<BarChartSkeleton />}>
          <DailyBarChart m3terId={m3terId} />
        </Suspense>
        <div className="p-10 bg-background text-foreground rounded-lg mt-5 min-h-[482px]">
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
      <div className="">
        <Doughnut data={doughnutChartData} options={options} />
      </div>
    </div>
  );
}
