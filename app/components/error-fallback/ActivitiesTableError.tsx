import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type FallbackProps } from "react-error-boundary";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "~/components/ui/table";

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

function ActivitiesTableError({ error, resetErrorBoundary }: FallbackProps) {
  const [open, setOpen] = useState(false);

  return (
    <Table className="text-left">
      <TableHeader className="text-[13px] font-semibold">
        <TableRow className="bg-background-secondary">
          {tableHeaders.map((v) => (
            <TableHead className="text-icon p-4" key={v}>
              {v}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
              role="alert"
            >
              <AlertCircle className="h-6 w-6 text-[oklch(62%_0.24_25)]" />

              <p className="mt-2 text-sm text-muted-foreground">
                Failed to load activities.
              </p>

              {/* View Details */}
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

              <AnimatePresence initial={false}>
                {open && (
                  <motion.pre
                    key="details"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 max-w-md text-xs text-muted-foreground/80 whitespace-pre-wrap break-words"
                  >
                    {error.message}
                  </motion.pre>
                )}
              </AnimatePresence>

              <button
                onClick={resetErrorBoundary}
                className="mt-4 rounded-md border border-[oklch(80%_0.06_25)] px-3 py-1.5 text-sm hover:bg-[oklch(94%_0.03_25)] transition-colors"
              >
                Retry
              </button>
            </motion.div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export { ActivitiesTableError };
