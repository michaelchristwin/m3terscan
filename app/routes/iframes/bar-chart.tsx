import { Suspense } from "react";
import { useSearchParams } from "react-router";
import BarChartSkeleton from "~/components/skeletons/BarChartSkeleton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import IframeBarChart from "~/components/charts/IframeBarChart";
import clsx from "clsx";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

function BarCharts() {
  const [searchParams, _] = useSearchParams();
  const m3terId = searchParams.get("m3terId");
  const colorLow = searchParams.get("colorLow");
  const colorHigh = searchParams.get("colorHigh");
  const colorScheme = searchParams.get("colorScheme") || "light";
  const dark = searchParams.get("dark");
  if (!m3terId) {
    return;
  }
  return (
    <div
      className={clsx(
        colorScheme === "dark" && dark ? [dark, "text-white"] : "bg-background",
        "w-full p-3"
      )}
    >
      <Suspense fallback={<BarChartSkeleton />}>
        <IframeBarChart
          m3terId={m3terId}
          colorHigh={colorHigh}
          colorLow={colorLow}
          colorScheme={colorScheme}
          dark={dark}
        />
      </Suspense>
    </div>
  );
}

export default BarCharts;
