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
import { staticBlockData } from "~/mock-data";
import { useMemo, useState } from "react";
import FilterBlocks from "~/components/FilterBlocks";
import { useNavigate } from "react-router";

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

  const navigate = useNavigate();

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
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  const filteredBlocks = useMemo(() => {
    return staticBlockData.filter((block) => {
      const statusMatch = !filters.status || block.status === filters.status;
      const proposerMatch =
        !filters.proposer ||
        block.proposer.toLowerCase().includes(filters.proposer.toLowerCase());
      return statusMatch && proposerMatch;
    });
  }, [staticBlockData, filters]);

  const visibleBlocks = useMemo(() => {
    return showAll ? filteredBlocks : filteredBlocks.slice(0, 5);
  }, [showAll, filteredBlocks]);

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
        <h3 className="text-xl">Recent Blocks</h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[var(--background-primary)] text-[var(--text-secondary)] rounded-xl p-4 relative"
        >
          <motion.div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">
              {showAll
                ? `All Blocks (${staticBlockData.length})`
                : `Last 5 blocks `}
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

                  {/* Filter Dropdown */}
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

              {staticBlockData.length > 5 && (
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
              <div className="min-w-[600px]">
                <table className="w-full">
                  {/* Table Head */}
                  <thead>
                    <tr className="text-left border-b border-[var(--background-secondary)]">
                      <th className="pb-2 pr-4 font-normal whitespace-nowrap">
                        <small>Block number</small>
                      </th>
                      <th className="pb-2 pr-4 font-normal whitespace-nowrap">
                        <small>State Address</small>
                      </th>
                      <th className="pb-2 pr-4 font-normal whitespace-nowrap">
                        <small>Status</small>
                      </th>
                      <th className="pb-2 pr-4 font-normal whitespace-nowrap">
                        <small>Date/Time</small>
                      </th>
                      <th className="pb-2 font-normal whitespace-nowrap">
                        <small>Proposal</small>
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-[var(--background-secondary)]">
                    <AnimatePresence>
                      {visibleBlocks.length > 0 ? (
                        visibleBlocks.map((block, index) => (
                          <motion.tr
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={rowVariants}
                            key={index}
                            onClick={() =>
                              navigate(`/m3ters/${block.meterId}/charts`)
                            }
                            className="text-sm hover:bg-[var(--background-secondary)] transition-colors"
                          >
                            <td className="py-3 pr-4 font-medium whitespace-nowrap">
                              Block {block.number}
                            </td>
                            <td className="py-3 pr-4 truncate max-w-[120px]">
                              <span>{block.address}</span>
                            </td>
                            <td
                              className={`py-3 pr-4 font-medium whitespace-nowrap ${
                                block.status === "Successful"
                                  ? "text-[var(--color-success)]"
                                  : "text-[var(--color-invalid)]"
                              }`}
                            >
                              {block.status}
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <span>{block.date}</span>
                              <span className="text-xs font-extralight ml-1">
                                {block.time}
                              </span>
                            </td>
                            <td className="py-3 whitespace-nowrap text-xs">
                              {block.proposer}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td
                            colSpan={5}
                            className="py-4 text-center text-sm text-[var(--text-secondary)]"
                          >
                            No blocks match your filters
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
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
