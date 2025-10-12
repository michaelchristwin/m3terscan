import type { Route } from "./+types/proposal";
import { getProposals } from "~/queries";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import { queryClient } from "~/queries/ts-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Proposals from "~/components/Proposals";
import { Loader2 } from "lucide-react";

export async function loader({ params }: Route.LoaderArgs) {
  await queryClient.prefetchQuery({
    queryKey: ["getProposals", params.hash],
    queryFn: () => getProposals(params.hash),
  });
  return { dehydratedState: dehydrate(queryClient) };
}

export function meta() {
  return [
    { title: "Proposals | M3terscan" },
    { name: "description", content: "" },
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
                <Loader2
                  className="animate-spin mx-auto text-[var(--icon-color)]"
                  size={30}
                />
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
