import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import type { Route } from "./+types/activity";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { m3terClient } from "~/config/m3terClient";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { formatAddress } from "~/lib/utils";
import TableSkeleton from "~/components/skeletons/TableSkeleton";
const MotionTableRow = motion.create(TableRow);

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

export const loader = ({ params }: Route.LoaderArgs) => {
  const dataPromise = m3terClient.v2.dataPoints.getMeterDataPoints({
    meterNumber: Number(params.m3terId),
  });
  return { dataPromise };
};

function Activity({ params }: Route.ComponentProps) {
  const { dataPromise } = useLoaderData<typeof loader>();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <title>Actvities of M3ter {params.m3terId} | M3terscan</title>
      <meta
        property="og:title"
        content={`Actvities of M3ter ${params.m3terId} | M3terscan`}
      />
      <meta
        name="description"
        content={`Actvities of M3ter ${params.m3terId}`}
      />
      <div className="flex items-center justify-between mb-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Activity
        </motion.h3>

        <SlidersHorizontal
          size={20}
          className="font-bold hover:text-[var(--icon-color)] transition-colors cursor-pointer"
        />
      </div>
      <div className="">
        <Table className="text-left">
          <TableHeader className="text-[13px] font-semibold">
            <TableRow className="bg-[var(--background-secondary)]">
              {tableHeaders.map((v) => (
                <TableHead className="text-[var(--icon-color)] p-4" key={v}>
                  {v}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-[12px]">
            <AnimatePresence>
              <Suspense fallback={<TableSkeleton />}>
                <Await resolve={dataPromise}>
                  {(data) =>
                    data.map((item, index) => (
                      <MotionTableRow
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="even:bg-[var(--background-primary)] border-0"
                        key={index.toString()}
                      >
                        <TableCell className="p-4">
                          {formatDistanceToNow(
                            new Date(item.node?.timestamp as number)
                          )}{" "}
                          ago
                        </TableCell>
                        <TableCell className="p-4">
                          {item.node?.payload?.energy?.toFixed(2)} kWh
                        </TableCell>
                        <TableCell className="p-4">
                          <span className="lg:hidden block">
                            {formatAddress(
                              item.node?.payload?.signature as string
                            )}
                          </span>
                          <span className="hidden lg:block">
                            {item.node?.payload?.signature}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          {Number(
                            (item.node?.payload?.energy as number) * 0.6
                          ).toFixed(2)}{" "}
                          USD
                        </TableCell>
                        <TableCell className="text-[var(--color-success)] p-4">
                          Valid
                        </TableCell>
                      </MotionTableRow>
                    ))
                  }
                </Await>
              </Suspense>
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

export default Activity;
