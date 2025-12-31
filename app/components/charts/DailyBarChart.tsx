import { useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { Bar } from "react-chartjs-2";
import useStyle from "~/hooks/useStyle";
import { getDailyM3TerM3TerIdDailyGetOptions } from "~/api-client/@tanstack/react-query.gen";
import { m3terscanClient } from "~/queries/query-client";

function DailyBarChart({ m3terId }: { m3terId: string }) {
  const {
    data: chartData,
    isRefetching,
    error,
  } = useSuspenseQuery({
    ...getDailyM3TerM3TerIdDailyGetOptions({
      client: m3terscanClient,
      path: {
        m3ter_id: Number(m3terId),
      },
    }),
    refetchInterval: 15 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
  });

  const high = useStyle("--chart-high");
  const low = useStyle("--chart-low");
  const colors = chartData.map((entry, index) => {
    if (index === 0) return high || "#28B750";

    return entry.total_energy < chartData[index - 1].total_energy
      ? low || "#EB822A"
      : high || "#28B750";
  });
  const barChartData = {
    labels: chartData.map((d) =>
      new Date(d.hour_start_utc).toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Energy used",
        data: chartData.map((d) => d.total_energy),
        backgroundColor: colors,
        borderRadius: 4, // rounded bars
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: "Hour" },
      },
      y: {
        grid: { drawTicks: false, display: false },
        title: { display: true, text: "Energy used" },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Energy: ${Number(context.raw).toFixed(2)}`,
          title: (items: any) => `Hour: ${items[0].label}`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-text-secondary"
    >
      <div className="flex items-center mb-6">
        <h3 className="text-foreground text-[16px]">Energy usage by hour</h3>
      </div>
      <div className="h-105 relative">
        {isRefetching && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="h-7.5 w-7.5 md:h-10 md:w-10 text-icon animate-spin" />
              <p className="text-sm text-neutral-400">Updating data...</p>
            </div>
          </div>
        )}
        {!error && chartData.length > 0 && (
          <>
            <div className="h-95 md:w-[96%] w-75">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="flex w-full items-center gap-x-5 mt-5.75 pl-17.5">
              <div className="flex items-center gap-x-1.5">
                <div
                  className="w-1.75 h-1.75 rounded-full"
                  style={{ backgroundColor: high || "#28B750" }}
                />
                <span className="text-[12px]">High</span>
              </div>
              <div className="flex items-center gap-x-1.5">
                <div
                  className="w-1.75 h-1.75 rounded-full"
                  style={{ backgroundColor: low || "#EB822A" }}
                />
                <span className="text-[12px]">Low</span>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default DailyBarChart;
