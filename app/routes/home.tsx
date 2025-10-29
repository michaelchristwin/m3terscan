import type { Route } from "./+types/home";
import { TrendingUp, CircleX, RefreshCw } from "lucide-react";
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
import { motion } from "motion/react";
import { Suspense, useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import RecentBlocks from "~/components/RecentBlocks";
import { getRecentBlocks } from "~/.server/dune";
import { useFetcher, useLoaderData } from "react-router";
import { Table, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TableSkeleton2 from "~/components/skeletons/TableSkeleton2";
import { queryClient } from "~/queries/ts-client";
import RecentCard from "~/components/RecentCard";
import useStyle from "~/hooks/useStyle";
import Statistics from "~/components/Statistics";
import { Skeleton } from "~/components/ui/skeleton";

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
  const icon = useStyle("--icon");
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First Line",
        data: [10, 25, 15, 30, 22, 40],
        borderColor: icon || "#FD8852",
        backgroundColor: icon || "#FD8852",
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: "Second Line",
        data: [5, 15, 10, 20, 12, 25],
        borderColor: "#00FF00",
        backgroundColor: "#00FF00",
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

  const [showAll, setShowAll] = useState(false);

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
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="md:w-[202px] w-[150px] h-[86px] rounded-[16px]"
                />
              ))}
            </div>
          }
        >
          <Statistics />
        </Suspense>
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
            <motion.div className="flex justify-end items-center mb-4">
              <div className="flex justify-end w-fit space-x-3">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm text-icon"
                >
                  {showAll ? "See less" : "See more"}
                </button>
                <button
                  type="button"
                  className="rounded-full"
                  aria-label="Refresh"
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
                      <RecentCard showAll={showAll} />
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
                      <RecentBlocks showAll={showAll} />
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
