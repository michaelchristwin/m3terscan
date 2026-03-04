import { useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type FallbackProps } from "react-error-boundary";

function BarChartError({ error, resetErrorBoundary }: FallbackProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 h-105 min-w-0 flex flex-col items-center justify-center relative w-full text-center"
      role="alert"
    >
      {/* Icon — same proportions as loader */}
      <AlertCircle className="h-7.5 w-7.5 md:h-10 md:w-10 text-[oklch(62%_0.24_25)]" />

      <p className="mt-2 text-[13px] md:text-[15px] text-muted-foreground max-w-xs">
        Failed to load daily charts.
      </p>

      {/* View details trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1 flex items-center gap-1 text-xs text-[rgb(106,181,219)] hover:underline"
      >
        {open ? "Hide details" : "View details"}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated details */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.pre
            key="details"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-xs text-muted-foreground/80 max-w-sm whitespace-pre-wrap qrap-break-word"
          >
            {error.message}
          </motion.pre>
        )}
      </AnimatePresence>

      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded-md border border-[oklch(80%_0.06_25)] px-3 py-1.5 text-sm hover:bg-[oklch(90%_0.06_25)] transition-colors"
      >
        Retry
      </button>
    </motion.div>
  );
}

export { BarChartError };
