import type { Route } from "./+types/charts";
import { useLoaderData } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Suspense, useMemo } from "react";
import {
  chunkArray,
  filterByMonthYear,
  formatDateLocal,
  groupByWeek,
  splitIntoGroups,
} from "~/utils/query-utils";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";
import { LoaderCircle } from "lucide-react";
import { fetchChartData, fetchHeatmapData } from "~/queries";
import { viewMode, ViewToggle } from "~/components/ViewToggle";
import { Doughnut, Bar } from "react-chartjs-2";
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
import CalendarHeatmap from "~/components/CalendarHeatmap";
import GridHeatmap from "~/components/GridHeatmap";
import {
  selectedMonth,
  selectedYear,
  YearSelector,
} from "~/components/YearSelector";
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

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false }, // no vertical grid lines
      title: { display: true, text: "Hour" },
    },
    y: {
      grid: { drawTicks: false }, // only horizontal lines
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
    queryFn: () =>
      fetchHeatmapData(
        new Date(selectedYear.value, 0, 1),
        Number(m3terId),
        100
      ),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });

  const sortedHeatmapData = groupByWeek(heatMapData);
  const chunkedData = splitIntoGroups(sortedHeatmapData, 4);
  const colors = chartData.map((entry, index) => {
    if (index === 0) return "#28B750"; // first bar default green
    return entry.energy < chartData[index - 1].energy ? "#EB822A" : "#28B750";
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

  const calendarData = useMemo(() => {
    const filtered = filterByMonthYear(
      heatMapData,
      selectedYear.value,
      selectedMonth.value
    ).map((item) => ({
      timestamp: item.node?.timestamp as number,
      energy: item.node?.payload?.energy as number,
    }));

    // Group by date
    const grouped = filtered.reduce(
      (acc, curr) => {
        const d = new Date(curr.timestamp);
        const date = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (!acc[date]) {
          acc[date] = { date, energy: 0 };
        }
        acc[date].energy += curr.energy;
        return acc;
      },
      {} as Record<string, { date: string; energy: number }>
    );

    // Get number of days in this month
    const daysInMonth = new Date(
      selectedYear.value,
      selectedMonth.value + 1,
      0
    ).getDate();

    // Build complete array
    const fullMonth: { date: string; energy: number }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDateLocal(
        selectedYear.value,
        selectedMonth.value,
        day
      );
      fullMonth.push(grouped[date] || { date, energy: 0 });
    }

    return fullMonth;
  }, [heatMapData, selectedYear.value, selectedMonth.value]);

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
          <Suspense>
            {isYearly.value && (
              <div className="w-full">
                <YearSelector />
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
              </div>
            )}
          </Suspense>
          {isMonthly.value && (
            <div className="flex w-full items-center justify-center">
              <div>
                <YearSelector />
                <CalendarHeatmap data={calendarData} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <Doughnut data={doughnutChartData} options={options} />
      </div>
    </div>
  );
}
