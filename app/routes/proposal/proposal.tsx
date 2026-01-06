import type { Route } from "./+types/proposal";
import { useLoaderData } from "react-router";
import { queryClient } from "~/queries/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Proposals from "~/components/Proposals";
import { getProposalProposalTxHashGetOptions } from "~/api-client/@tanstack/react-query.gen";
import { m3terscanClient } from "~/queries/query-client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function loader({ params }: Route.LoaderArgs) {
  await queryClient.prefetchQuery({
    ...getProposalProposalTxHashGetOptions({
      client: m3terscanClient,
      path: { tx_hash: params.hash },
    }),
  });
  return { dehydratedState: dehydrate(queryClient) };
}

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "Proposals" },
    {
      name: "description",
      content: `Proposals on the transaction hash: ${params.hash}`,
    },
  ];
}

function Index({ params }: Route.ComponentProps) {
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
          <Proposals hash={params.hash} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export default Index;
