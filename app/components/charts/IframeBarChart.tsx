import { useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { Bar } from "react-chartjs-2";
import { getDailyCharts } from "~/queries";

function IframeBarChart({
  m3terId,
  colorHigh = null,
  colorLow = null,
  colorScheme,
  dark,
}: {
  m3terId: string;
  colorLow: string | null;
  colorHigh?: string | null;
  colorScheme: string;
  dark: string | null;
}) {
  const {
    data: chartData,
    isRefetching,
    error,
  } = useSuspenseQuery({
    queryKey: ["chartData", m3terId],
    queryFn: () => getDailyCharts(m3terId),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });
  const darkT = "#" + dark;
  console.log("colorScheme: ", colorScheme);
  console.log("Dark: ", dark);

  const colors = chartData.map((entry, index) => {
    if (index === 0) return colorHigh || "#28B750"; // first bar default green
    return entry.energy < chartData[index - 1].energy
      ? colorLow || "#EB822A"
      : colorHigh || "#28B750";
  });
  const barChartData = {
    labels: chartData.map((d) => d.hour),
    datasets: [
      {
        label: "Energy used",
        data: chartData.map((d) => d.energy),
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
      style={{
        backgroundColor:
          colorScheme === "dark" && dark ? darkT : "var(--background)",
        color:
          colorScheme === "dark" && dark ? "white" : "var(--text-secondary)",
      }}
    >
      <div className="flex items-center mb-6">
        <h3
          style={{
            color:
              colorScheme === "dark" && dark
                ? "white"
                : "var(--text-foreground)",
          }}
          className="text-[16px]"
        >
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
            <div className="h-95 w-full">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
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
  );
}

export default IframeBarChart;
