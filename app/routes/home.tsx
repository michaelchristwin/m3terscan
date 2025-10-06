import StatCard from "~/components/StatCard";
import type { Route } from "./+types/home";
import { TrendingUp, SlidersHorizontal } from "lucide-react";
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
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import FilterBlocks from "~/components/FilterBlocks";
import RecentBlocks from "~/components/RecentBlocks";
import { getRecentBlocks } from "~/.server/dune";
import { useLoaderData } from "react-router";
import { Table, TableHead, TableHeader, TableRow } from "~/components/ui/table";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    ...loaderHeaders,
    "Cache-Control": "public, max-age=900, stale-while-revalidate=900",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | M3terscan" },
    { name: "description", content: "Welcome to M3terscan!" },
  ];
}

export async function loader() {
  const data = await getRecentBlocks();
  return { data };
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
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const [showAll, setShowAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    proposer: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: "", proposer: "" });
    setShowFilters(false);
  };
  const { data: recent_blocks } = useLoaderData<typeof loader>();

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
              <p className="font-light text-[8px] text-black">20.0%</p>
              <TrendingUp size={8} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[360px] bg-[var(--background-primary)] p-6 rounded-2xl">
        <Line data={data} options={options} />
      </div>
      <div className="mt-20 space-y-3">
        <h3 className="text-xl">Recent Proposals</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[var(--background-primary)] text-[var(--text-secondary)] rounded-xl p-4 relative"
        >
          <motion.div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">
              {showAll
                ? `All Blocks (${recent_blocks.length})`
                : `Last 5 proposals`}
            </h3>
            <div className="flex items-center gap-5">
              {showAll && (
                <motion.div className="relative" layout>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-1 hover:text-[var(--icon-color)] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal />
                  </motion.button>

                  <AnimatePresence>
                    {showFilters && (
                      <FilterBlocks
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onClose={() => setShowFilters(false)}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {recent_blocks.length > 5 && (
                <a
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm cursor-pointer text-[var(--icon-color)]"
                >
                  {showAll ? "See less" : "See more"}
                </a>
              )}
            </div>
          </motion.div>

          <div className="relative">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="text-left border-b border-[var(--background-secondary)]">
                    <TableHead className="font-normal whitespace-nowrap">
                      <small>Proposal</small>
                    </TableHead>
                    <TableHead className="font-normal whitespace-nowrap">
                      <small>Proposer</small>
                    </TableHead>
                    <TableHead className="font-normal whitespace-nowrap">
                      <small>Status</small>
                    </TableHead>
                    <TableHead className="font-normal whitespace-nowrap">
                      <small>Date/Time</small>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <RecentBlocks data={recent_blocks} />
              </Table>
            </div>
            <div className="md:hidden text-center mt-2 text-xs text-[var(--text-secondary)]">
              ← Scroll horizontally →
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
