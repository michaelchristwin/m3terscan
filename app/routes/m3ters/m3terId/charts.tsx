import { m3terClient } from "~/m3terClient";
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
import { chunkArray } from "~/utils/query-utils";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";

export const description = "An interactive bar chart";

const chartConfig = {
  energy: {
    label: "Energy used",
  },
  hour: {
    label: "Hour",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const fetchChartData = (m3terId: number) => {
  return m3terClient.v2.dataPoints.getMeterDataPoints({
    meterNumber: m3terId,
    nonces: Array.from({ length: 96 }, (_, i) => i + 1),
  });
};

export async function loader({ params }: Route.LoaderArgs) {
  const initialData = await fetchChartData(Number(params.m3terId));
  const m3terId = Number(params.m3terId);
  return { initialData, m3terId };
}

export default function Charts({}: Route.ComponentProps) {
  const { initialData, m3terId } = useLoaderData<typeof loader>();
  const { data, isFetching, error } = useSuspenseQuery({
    queryKey: ["chartData"],
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

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 px-[19px] pt-[37px] pb-[41px] bg-[var(--background-primary)] rounded-lg h-full">
        <Suspense fallback={<BarChartSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[var(--text-secondary)]"
          >
            <div className="flex items-center mb-6">
              <h3>Energy usage by hour</h3>
            </div>
            <div className="h-100">
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
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      <div className="w-[7px] h-[7px] bg-[#EB822A] rounded-full" />
                      <span>Low</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </Suspense>
      </div>
      <div className="w-[300px] hidden md:block"></div>
    </div>
  );
}
