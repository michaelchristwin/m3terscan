import { Suspense } from "react";
import { data, useSearchParams } from "react-router";
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
import type { Route } from "./+types/bar-chart";
import { setColorScheme } from "~/.server/cookies";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const colorScheme = url.searchParams.get("colorScheme");

  return data(null, {
    headers: { "Set-Cookie": await setColorScheme(colorScheme || "light") },
  });
}

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
