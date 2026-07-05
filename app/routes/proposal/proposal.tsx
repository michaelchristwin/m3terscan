import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/proposal";
import Proposals from "~/components/Proposals";
import { ErrorBoundary } from "react-error-boundary";
import { BasePageError } from "~/components/error-fallback/BasePageError";

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
  return (
    <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={BasePageError} onReset={reset}>
            <Proposals hash={params.hash} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

export default Page;
