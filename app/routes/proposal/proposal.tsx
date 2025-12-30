import type { Route } from "./+types/proposal";
import { useLoaderData } from "react-router";
import { queryClient } from "~/queries/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Proposals from "~/components/Proposals";
import { getProposalProposalTxHashGetOptions } from "~/api-client/@tanstack/react-query.gen";
import { m3terscanClient } from "~/queries/query-client";

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
    { title: "Proposals | M3terscan" },
    {
      name: "description",
      content: `Proposals for transaction hash ${params.hash}`,
    },
  ];
}

function Index({ params }: Route.ComponentProps) {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
        <Proposals hash={params.hash} />
      </div>
    </HydrationBoundary>
  );
}

export default Index;
