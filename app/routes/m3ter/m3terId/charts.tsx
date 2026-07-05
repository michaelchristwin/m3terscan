import z from "zod";
import { useState } from "react";
import type { Mode } from "~/types";
import { Doughnut } from "react-chartjs-2";
import type { Route } from "./+types/charts";
import { ErrorBoundary } from "react-error-boundary";
import { ViewToggle } from "~/components/ViewToggle";
import DailyBarChart from "~/components/charts/DailyBarChart";
import WeeklyHeatmap from "~/components/heatmaps/WeeklyHeatmap";
import MonthlyHeatmap from "~/components/heatmaps/MonthlyHeatmap";
import { HeatmapError } from "~/components/error-fallback/HeatmapError";
import { BarChartError } from "~/components/error-fallback/BarChartError";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

const pageSchema = z.coerce.number().int().min(0);
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

export default function Charts({ params }: Route.ComponentProps) {
  const [viewMode, setViewMode] = useState<Mode>("yearly");
  const meterId = pageSchema.parse(params.m3terId);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[9fr_2fr] gap-4 pb-12.5">
      <div className="px-4 md:px-6 pt-6 pb-8 bg-background-primary rounded-lg h-full mx-4">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={BarChartError}>
              <DailyBarChart meterId={meterId} />
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
                {viewMode === "yearly" ? (
                  <WeeklyHeatmap meterId={meterId} viewMode={viewMode} />
                ) : (
                  <MonthlyHeatmap viewMode={viewMode} meterId={meterId} />
                )}
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
  );
}
