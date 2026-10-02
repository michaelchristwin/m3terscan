import { QueryErrorResetBoundary, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "~/components/ui/table";
import { formatAddress } from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { SlidersHorizontal } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "motion/react";
import { meterQueries } from "~/queries/meterscan.queries";
import { ActivitiesTableSkeleton } from "~/components/skeletons/ActivitiesTableSkeleton";
import { ActivitiesTableError } from "~/components/error-fallback/ActivitiesTableError";
import { createFileRoute } from "@tanstack/react-router";
import { paramsSchema } from "~/shared/params.schema";

const MotionTableRow = motion.create(TableRow);

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

export const Route = createFileRoute("/m3ter/$m3terId/activities")({
  component: Activities,
  params: {
    parse: (raw) => paramsSchema.parse(raw),
  },
});

function Activities() {
  const { m3terId } = Route.useParams();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <title>Actvities of M3ter {m3terId}</title>
      <div className="flex items-center justify-between mb-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Activities
        </motion.h3>

        <SlidersHorizontal
          size={20}
          className="font-bold hover:text-icon transition-colors cursor-pointer"
        />
      </div>
      <div>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={ActivitiesTableError}
            >
              <Activity m3terId={m3terId} />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </motion.div>
  );
}

function Activity({ m3terId }: { m3terId: number }) {
  const {
    data: activities,
    isLoading,
    isSuccess,
  } = useQuery(meterQueries.getActivities(m3terId));
  if (isLoading) return <ActivitiesTableSkeleton />;
  if (isSuccess)
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

        <AnimatePresence>
          <TableBody className="text-[12px]">
            {activities?.data.map((item, index) => (
              <MotionTableRow
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="even:bg-background-primary border-0"
                key={index.toString()}
              >
                <TableCell className="p-4">
                  {formatDistanceToNow(new Date(item.timestamp))} ago
                </TableCell>
                <TableCell className="p-4">
                  {item.energy.toFixed(2)} kWh
                </TableCell>
                <TableCell className="p-4">
                  <span className="2xl:hidden block">
                    {formatAddress(item.signature)}
                  </span>
                  <span className="hidden 2xl:block">{item.signature}</span>
                </TableCell>
                <TableCell className="p-4">
                  {Number(item.energy * 0.6).toFixed(2)} USD
                </TableCell>
                <TableCell className="text-success p-4">Valid</TableCell>
              </MotionTableRow>
            ))}
          </TableBody>
        </AnimatePresence>
      </Table>
    );
}
