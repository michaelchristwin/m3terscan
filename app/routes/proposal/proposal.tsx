import {
  dehydrate,
  HydrationBoundary,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/proposal";
import Proposals from "~/components/Proposals";
import { ErrorBoundary } from "react-error-boundary";
import { queryClient } from "~/queries/query-client";
import { proposalQueries } from "~/queries/meterscan.queries";
import { BasePageError } from "~/components/error-fallback/BasePageError";

export async function loader({ params }: Route.LoaderArgs) {
  await queryClient.prefetchQuery(proposalQueries.getProposals(params.hash));
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

function Page({ params }: Route.ComponentProps) {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={BasePageError} onReset={reset}>
              <Suspense
                fallback={
                  <div className="w-full flex justify-center items-center h-[calc(100vh-100px)]">
                    <div className="block">
                      <Loader2
                        className="animate-spin mx-auto text-icon"
                        size={30}
                      />
                      <p className="text-muted-foreground leading-normal">
                        Fetching proposal...
                      </p>
                    </div>
                  </div>
                }
              >
                <Proposals hash={params.hash} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </HydrationBoundary>
  );
}

export default Page;
