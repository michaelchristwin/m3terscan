import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useLoaderData } from "react-router";
import { getRecentBlocks } from "~/.server/dune";
import Proposals from "~/components/Proposals";
import { queryClient } from "~/queries/query-client";

export async function loader() {
  await queryClient.prefetchQuery({
    queryKey: ["recentBlocks"],
    queryFn: getRecentBlocks,
  });

  return { dehydratedState: dehydrate(queryClient) };
}

export function meta() {
  return [
    { title: "Latest Proposal" },
    { name: "description", content: "The latest m3ters proposal" },
  ];
}

function Latest() {
  const { data } = useQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      const response = await fetch("/api/blocks");
      const data = await response.json();
      return data;
    },
  });
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
        <Suspense
          fallback={
            <div className="w-full flex justify-center items-center h-full">
              <div className="block">
                <Loader2 className="animate-spin mx-auto text-icon" size={30} />
                <p className="text-neutral-700">Loading...</p>
              </div>
            </div>
          }
        >
          {data && <Proposals hash={data.at(-1).hash} />}
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export default Latest;
