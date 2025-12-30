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
import { useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import RecentBlocks from "~/components/RecentBlocks";
import { getRecentBlocks } from "~/.server/dune";
import { useFetcher, useLoaderData } from "react-router";
import { Table, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { queryClient as qc } from "~/queries/query-client";
import RecentCard from "~/components/RecentCard";
import useStyle from "~/hooks/useStyle";
import Statistics from "~/components/Statistics";

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
    {
      name: "description",
      content:
        "m3terscan is a fast energy usage analytics platform that aggregates meter data into clear daily, weekly, and yearly insights for monitoring consumption and performance.",
    },
  ];
}

export async function loader() {
  await Promise.all([
    await qc.prefetchQuery({
      queryKey: ["recentBlocks"],
      queryFn: getRecentBlocks,
    }),

    qc.prefetchQuery({
      queryKey: ["getWorldState"],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/world-state`
        );
        const data = await response.json();
        return data;
      },
    }),

    await qc.prefetchQuery({
      queryKey: ["recentBlocks"],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/blocks`
        );
        const data = await response.json();
        return data;
      },
    }),
  ]);

  return { dehydratedState: dehydrate(qc) };
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
      <main className="w-full h-full md:px-15 px-5 mt-5">
        <Statistics />
        <div className="mt-9.5 w-full">
          <div className="gap-y-3.25">
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
        <div className="h-90 bg-background-primary p-6 rounded-2xl">
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
                    await qc.refetchQueries({
                      queryKey: ["recentBlocks"],
                      type: "active",
                      exact: true,
                    });
                  }}
                >
                  <RefreshCw
                    className={`${spinning ? "animate-spin" : ""} w-5 float-end text-icon transition-transform`}
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
                    <RecentCard showAll={showAll} />
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
                    <RecentBlocks showAll={showAll} />
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
