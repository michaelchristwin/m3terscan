import z from "zod";
import {
  useSuspenseQuery,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "~/components/ui/table";
import { Suspense } from "react";
import { formatAddress } from "~/lib/utils";
import { useLoaderData } from "react-router";
import { formatDistanceToNow } from "date-fns";
import type { Route } from "./+types/activities";
import { SlidersHorizontal } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "motion/react";
import { meterQueries } from "~/queries/meterscan.queries";
import { ActivitiesTableSkeleton } from "~/components/skeletons/ActivitiesTableSkeleton";
import { ActivitiesTableError } from "~/components/error-fallback/ActivitiesTableError";

const pageSchema = z.coerce.number().int().positive();
const MotionTableRow = motion.create(TableRow);

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    { title: `Actvities of M3ter ${params.m3terId}` },
    { name: "description", content: `Actvities of M3ter ${params.m3terId}` },
    {
      name: "og:title",
      content: `Actvities of M3ter ${params.m3terId} | M3terscan`,
    },
  ];
};

export function loader({ params }: Route.LoaderArgs) {
  const result = pageSchema.safeParse(params.m3terId);
  if (!result.success) {
    throw Error(result.error.message);
  }
  const meterId = result.data;
  return { meterId };
}

function Activity() {
  const { meterId } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
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
              <Suspense fallback={<ActivitiesTableSkeleton />}>
                <Activities meterId={meterId} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    </motion.div>
  );
}

export default Activity;

function Activities({ meterId }: { meterId: number }) {
  const { data: activities } = useSuspenseQuery(
    meterQueries.getActivities(meterId),
  );
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
