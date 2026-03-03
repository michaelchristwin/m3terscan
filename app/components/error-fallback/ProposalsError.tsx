import { type JSX } from "react";
import { RotateCcw } from "lucide-react";
import { type FallbackProps } from "react-error-boundary";

export function ProposalsError({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  return (
    <div className="flex w-full justify-center">
      <div className="text-center">
        <p className="text-icon">Something went wrong</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>
          <RotateCcw className="text-icon active:animate-spin" />
        </button>
      </div>
    </div>
  );
}
