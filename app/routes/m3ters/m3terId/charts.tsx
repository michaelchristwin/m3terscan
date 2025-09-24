import type { Route } from "./+types/charts";
import { useLoaderData } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Suspense } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { chunkArray, groupByWeek, splitIntoGroups } from "~/utils/query-utils";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";
import { LoaderCircle } from "lucide-react";
import { fetchChartData, fetchHeatmapData } from "~/queries";
import { viewMode, ViewToggle } from "~/components/ViewToggle";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSignals } from "@preact/signals-react/runtime";
import { useComputed } from "@preact/signals-react";
import CalendarHeatmap from "~/components/CalendarHeatmap";
import GridHeatmap from "~/components/GridHeatmap";
ChartJS.register(ArcElement, Tooltip, Legend);

const chartConfig = {
  energy: {
    label: "Energy used",
  },
  hour: {
    label: "Hour",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const doughnutChartData = {
  labels: ["Apples", "Bananas", "Cherries"],
  datasets: [
    {
      label: "Fruits",
      data: [10, 20, 30], // 👈 values
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      borderRadius: 20, // 👈 rounded edges
      spacing: 5, // 👈 gap between slices
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const, // 👈 force literal type
    },
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const initialData = await fetchChartData(Number(params.m3terId));
  const m3terId = Number(params.m3terId);
  return { initialData, m3terId };
}

export default function Charts() {
  useSignals();
  const isYearly = useComputed(() => viewMode.value === "yearly");
  const isMonthly = useComputed(() => viewMode.value === "monthly");
  const { initialData, m3terId } = useLoaderData<typeof loader>();
  const { data, isRefetching, error } = useSuspenseQuery({
    queryKey: ["chartData", m3terId],
    queryFn: () => fetchChartData(m3terId),
    initialData,
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });

  const sortedData = data
    .sort(
      (a, b) =>
        (a.node?.payload?.nonce as number) - (b.node?.payload?.nonce as number)
    )
    .map((v) => v.node?.payload?.energy);
  const chartData = chunkArray(sortedData as number[], 4)
    .map((item) => item.reduce((acc, num) => acc + num, 0))
    .map((energy, i) => {
      return { hour: `${String(i).padStart(2, "0")}:00`, energy };
    });

  const { data: heatMapData } = useSuspenseQuery({
    queryKey: ["heatmapData"],
    queryFn: () => fetchHeatmapData(new Date(2025, 0, 1), Number(m3terId), 100),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });
  const sortedHeatmapData = groupByWeek(heatMapData);
  const chunkedData = splitIntoGroups(sortedHeatmapData, 4);

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[10fr_2fr] pb-[50px]">
      <div className="px-[30px] pt-[37px] pb-[41px] bg-[var(--background-primary)] rounded-lg h-full mx-4">
        <Suspense fallback={<BarChartSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[var(--text-secondary)]"
          >
            <div className="flex items-center mb-6">
              <h3 className="text-foreground text-[16px]">
                Energy usage by hour
              </h3>
            </div>
            <div className="h-105 relative">
              {isRefetching && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <LoaderCircle className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] text-[var(--icon-color)] animate-spin" />
                    <p className="text-sm text-neutral-400">Updating data...</p>
                  </div>
                </div>
              )}
              {!error && chartData.length > 0 && (
                <>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] h-[370px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} className="" />
                      <YAxis
                        dataKey="energy"
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                      />
                      <XAxis
                        dataKey="hour"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={10}
                        tickFormatter={(value) => value}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="energy"
                            labelFormatter={(value) => value}
                          />
                        }
                      />

                      <Bar dataKey={"energy"}>
                        {chartData.map((entry, index) => {
                          let color = "#28B750"; // default
                          if (index > 0) {
                            color =
                              entry.energy < chartData[index - 1].energy
                                ? "#EB822A"
                                : "#28B750";
                          }
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                  <div className="flex w-full items-center gap-x-5 mt-[23px] pl-[70px]">
                    <div className="flex items-center gap-x-1.5">
                      <div className="w-[7px] h-[7px] bg-[#28B750] rounded-full" />
                      <span className="text-[12px]">High</span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      <div className="w-[7px] h-[7px] bg-[#EB822A] rounded-full" />
                      <span className="text-[12px]">Low</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </Suspense>
        <div className="p-10 bg-background text-foreground rounded-lg mt-5 min-h-[482px]">
          <div className="">
            <div className="text-center flex justify-between items-center mb-3">
              <h3 className="text-foreground text-[17px] md:text-[19px] font-semibold">
                Revenue Heatmap
              </h3>
              <ViewToggle />
            </div>
          </div>
          <Suspense>
            {isYearly.value && (
              <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-y-7 mt-5">
                <div>
                  <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
                    <p>Jan</p>
                    <p>Feb</p>
                    <p>Mar</p>
                  </div>
                  <GridHeatmap data={chunkedData[0]} />
                </div>
                <div>
                  <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
                    <p>Apr</p>
                    <p>May</p>
                    <p>Jun</p>
                  </div>
                  <GridHeatmap data={chunkedData[1]} />
                </div>
                <div>
                  <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
                    <p>Jul</p>
                    <p>Aug</p>
                    <p>Sep</p>
                  </div>
                  <GridHeatmap data={chunkedData[2]} />
                </div>
                <div>
                  <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
                    <p>Oct</p>
                    <p>Nov</p>
                    <p>Dec</p>
                  </div>
                  <GridHeatmap data={chunkedData[3]} />
                </div>
              </div>
            )}
            {isMonthly.value && (
              <div className="flex w-full items-center justify-center">
                <div>
                  <h3 className="font-medium text-foreground text-center mb-4">
                    {new Date(2024, 4 - 1).toLocaleString("default", {
                      month: "long",
                    })}{" "}
                    {2024}
                  </h3>
                  <CalendarHeatmap
                    data={[
                      { date: "2024-03-01", energy: 150 },
                      { date: "2024-03-05", energy: 200 },
                      { date: "2024-03-10", energy: 180 },
                      { date: "2024-03-15", energy: 220 },
                      { date: "2024-03-20", energy: 190 },
                      { date: "2024-03-25", energy: 210 },
                    ]}
                  />
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
      <div className="">
        <Doughnut data={doughnutChartData} options={options} />
      </div>
    </div>
  );
}
