import Proposals from "~/components/Proposals";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BasePageError } from "~/components/error-fallback/BasePageError";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/proposal/$hash")({
  component: Proposal,
});

function Proposal() {
  const { hash } = Route.useParams();
  return (
    <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
      <title>Proposals</title>
      <meta
        name="description"
        content={`Proposals on the transaction hash: ${hash}`}
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={BasePageError} onReset={reset}>
            <Proposals hash={hash} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}
