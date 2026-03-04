import { useNavigate } from "react-router";
import { useState, type JSX } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { type FallbackProps } from "react-error-boundary";

export function BasePageError({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 text-center">
      <AlertCircle className="h-12 w-12 text-[oklch(62%_0.24_25)]" />

      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>

      {/* Disclosure Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 flex items-center gap-1 text-sm text-[rgb(106,181,219)] hover:underline"
      >
        {open ? "Hide technical details" : "Show technical details"}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated Details Panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 w-full max-w-md rounded-md border border-[oklch(85%_0.06_25)] bg-[oklch(90%_0.05_25)] p-3 text-left">
              <pre className="text-xs leading-relaxed text-[oklch(35%_0.05_25)] whitespace-pre-wrap wrap-break-word">
                {error.message}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="rounded-md bg-[oklch(62%_0.24_25)] px-4 py-2 text-white hover:bg-[oklch(55%_0.24_25)]"
        >
          Retry
        </button>

        <button
          className="rounded-md border px-4 py-2"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
