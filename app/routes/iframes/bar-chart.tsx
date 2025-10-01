import { Suspense } from "react";
import { useSearchParams } from "react-router";
import DailyBarChart from "~/components/charts/DailyBarChart";
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
  if (!m3terId) {
    return;
  }
  return (
    <div className="w-full p-3">
      <Suspense fallback={<BarChartSkeleton />}>
        <DailyBarChart
          m3terId={m3terId}
          colorHigh={colorHigh}
          colorLow={colorLow}
        />
      </Suspense>
    </div>
  );
}

export default BarCharts;
