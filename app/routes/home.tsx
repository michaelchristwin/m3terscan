import type { Route } from "./+types/home";
import {
  TrendingUp,
  SlidersHorizontal,
  CircleX,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "motion/react";
import { Suspense, useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import FilterBlocks from "~/components/FilterBlocks";
import RecentBlocks from "~/components/RecentBlocks";
import { getRecentBlocks } from "~/.server/dune";
import { useFetcher, useLoaderData } from "react-router";
import { Table, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TableSkeleton2 from "~/components/skeletons/TableSkeleton2";
import { queryClient } from "~/queries/ts-client";
import RecentCard from "~/components/RecentCard";

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
    { name: "description", content: "Welcome to M3terscan!" },
  ];
}

export async function loader() {
  await queryClient.prefetchQuery({
    queryKey: ["recentBlocks"],
    queryFn: getRecentBlocks,
  });

  return { dehydratedState: dehydrate(queryClient) };
}

export default function Home() {
  const { dehydratedState } = useLoaderData<typeof loader>();
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
  const fetcher = useFetcher();
  const spinning = fetcher.state !== "idle";

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
      tooltip: {
        enabled: true,
        mode: "nearest" as const, // ✅ literal type, not just string
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  } satisfies ChartOptions<"line">;

  const [showAll, _setShowAll] = useState(false);
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

  const tableHeaders = [
    "PROPOSAL",
    "PROPOSER",
    "STATUS",
    "DATE/TIME",
    "ETHERSCAN",
  ];
  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="w-full h-full md:px-[60px] px-[20px] mt-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-y-5">
          <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-stats justify-center">
            <p className="md:text-[14px] text-[12px] font-normal text-text-primary">
              Total revenue
            </p>
            <p className="font-medium md:text-[25px] text-[20px] text-text-primary">
              $25K
            </p>
          </div>
          <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-stats justify-center">
            <p className="md:text-[14px] text-[12px] font-normal text-text-primary">
              Total revenue
            </p>
            <p className="font-medium md:text-[25px] text-[20px] text-text-primary">
              $25K
            </p>
          </div>
          <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-stats justify-center">
            <p className="md:text-[14px] text-[12px] font-normal text-text-primary">
              Market cap
            </p>
            <p className="font-medium md:text-[25px] text-[20px] text-text-primary">
              $10K
            </p>
          </div>
          <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-stats justify-center">
            <p className="md:text-[14px] text-[12px] font-normal text-text-primary">
              Total regions
            </p>
            <p className="font-medium md:text-[25px] text-[20px] text-text-primary">
              6 countries
            </p>
          </div>

          <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-stats justify-center">
            <p className="md:text-[14px] text-[12px] font-normal text-text-primary">
              See more
            </p>
            <button
              type="button"
              className="bg-[#FFC9B2] rounded-full h-[36px] w-[36px] flex justify-center items-center"
            >
              <ArrowRight size={14} className="text-icon" />
            </button>
          </div>
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
        <div className="h-[360px] bg-background-primary p-6 rounded-2xl">
          <Line data={data} options={options} />
        </div>
        <div className="mt-20 space-y-3">
          <h3 className="text-xl">Recent Proposals</h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-background-primary text-text-secondary rounded-xl p-4 relative"
          >
            <motion.div className="flex justify-between items-center mb-4">
              <div className="flex justify-end w-full px-7">
                <button
                  type="button"
                  className="rounded-full"
                  onClick={async () => {
                    fetcher.submit(null, {
                      method: "post",
                      action: "/api/blocks",
                      preventScrollReset: true,
                    });
                    await queryClient.refetchQueries({
                      queryKey: ["recentBlocks"],
                      type: "active",
                      exact: true,
                    });
                  }}
                >
                  <RefreshCw
                    className={`${spinning ? "animate-spin" : ""} w-[20px] float-end text-icon transition-transform`}
                  />
                </button>
              </div>
              {/* <h3 className="text-sm font-medium">
                {showAll
                  ? `All Blocks (${recent_blocks.length})`
                  : `Last 5 proposals`}
              </h3> */}
              <div className="flex items-center gap-5">
                {showAll && (
                  <motion.div className="relative" layout>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-1 hover:text-icon transition-colors cursor-pointer"
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

                {/* {recent_blocks.length > 5 && (
                  <a
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm cursor-pointer text-icon"
                  >
                    {showAll ? "See less" : "See more"}
                  </a>
                )} */}
              </div>
            </motion.div>

            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ resetErrorBoundary }) => (
                    <div className="flex w-full justify-center">
                      <div className="flex items-center space-x-2">
                        <p className="text-red-500">Something went wrong</p>
                        <CircleX size={17} className="text-red-500" />
                      </div>
                      <button onClick={() => resetErrorBoundary()}>
                        Try again
                      </button>
                    </div>
                  )}
                >
                  <div className="md:hidden space-y-3">
                    <Suspense>
                      <RecentCard />
                    </Suspense>
                  </div>
                  <Table className="w-full table-fixed hidden md:table">
                    <TableHeader>
                      <TableRow className="text-left font-sans border-b border-background-secondary">
                        {tableHeaders.map((item, i) => (
                          <TableHead className="w-[20%]" key={i.toString()}>
                            <small>{item}</small>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <Suspense fallback={<TableSkeleton2 />}>
                      <RecentBlocks />
                    </Suspense>
                  </Table>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </motion.div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
