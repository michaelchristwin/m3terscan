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
import { decodeParam } from "~/utils/query-utils";
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
  const colorLow = decodeParam(searchParams.get("colorLow"));
  const colorHigh = decodeParam(searchParams.get("colorHigh"));
  const colorScheme = searchParams.get("colorScheme") || "light";
  const dark = decodeParam(searchParams.get("dark"));

  if (!m3terId) {
    return;
  }
  return (
    <div
      style={{
        backgroundColor:
          colorScheme === "dark" && dark ? dark : "var(--background)",
        color:
          colorScheme === "dark" && dark ? "white" : "var(--text-secondary)",
      }}
      className="w-full p-3"
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
