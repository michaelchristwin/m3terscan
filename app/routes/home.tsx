import StatCard from "~/components/StatCard";
import type { Route } from "./+types/home";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | M3terscan" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First Line",
        data: [10, 25, 15, 30, 22, 40],
        borderColor: "#FD8852",
        backgroundColor: "#FD8852",
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: "Second Line",
        data: [5, 15, 10, 20, 12, 25],
        borderColor: "#AEC7ED",
        backgroundColor: "#AEC7ED",
        borderDash: [6, 6], // <-- dashed line
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        // align: "start" as const,
        labels: {
          usePointStyle: true, // <-- round markers in legend
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // <-- removes vertical grid lines
        },
      },
      y: {
        grid: {
          display: false, // <-- removes horizontal grid lines
        },
      },
    },
  };

  return (
    <main className="w-full h-full px-[63px] mt-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-y-5">
        <StatCard title="Total revenue" value="$25K" />
        <StatCard title="Total revenue" value="$25K" />
        <StatCard title="Market cap" value="$10K" />
        <StatCard title="Total regions" value="6 countries" />
        <StatCard title="Total revenue" value="$25K" />
      </div>
      <div className="mt-9.5 w-full">
        <div className="gap-y-[13px]">
          <p className="text-[20px] font-normal">Total revenue</p>
          <div className="gap-x-[3.41px] flex items-center">
            <p className="font-medium text-[24px]">$25K</p>
            <div className="flex items-center justify-center gap-x-0.5 w-[43.09px] h-[16.59px] bg-[#B1FF3B] rounded-[3.87px] p-[5.53px]">
              <p className="font-light text-[8px]">20.0%</p>
              <TrendingUp size={8} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[360px] bg-[var(--background-primary)] p-6 rounded-2xl">
        <Line data={data} options={options} />
      </div>
    </main>
  );
}
