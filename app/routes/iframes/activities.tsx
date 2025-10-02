import { motion, AnimatePresence } from "motion/react";
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
import { formatDistanceToNow } from "date-fns";
import { formatAddress } from "~/lib/utils";
import TableSkeleton from "~/components/skeletons/TableSkeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
const MotionTableRow = motion.create(TableRow);

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

function Activities() {
  const [searchParams, _] = useSearchParams();
  const m3terId = searchParams.get("m3terId");
  const dark = decodeURIComponent(searchParams.get("dark") as string);
  console.log(dark);
  return (
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

        {m3terId && (
          <Suspense fallback={<TableSkeleton />}>
            <TableBody className="text-[12px]">
              <AnimatePresence>
                <ChiComponent m3terId={m3terId} />
              </AnimatePresence>
            </TableBody>
          </Suspense>
        )}
      </Table>
    </div>
  );
}

export default Activities;

const ChiComponent = ({ m3terId }: { m3terId: string }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["activities"],
    queryFn: () =>
      m3terClient.v2.dataPoints.getMeterDataPoints({
        meterNumber: Number(m3terId),
      }),
  });

  return (
    <>
      {data.map((item, index) => (
        <MotionTableRow
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="even:bg-[var(--background-primary)] border-0"
          key={index.toString()}
        >
          <TableCell className="p-4">
            {formatDistanceToNow(new Date(item.node?.timestamp as number))} ago
          </TableCell>
          <TableCell className="p-4">
            {item.node?.payload?.energy?.toFixed(2)} kWh
          </TableCell>
          <TableCell className="p-4">
            <span className="lg:hidden block">
              {formatAddress(item.node?.payload?.signature as string)}
            </span>
            <span className="hidden lg:block">
              {item.node?.payload?.signature}
            </span>
          </TableCell>
          <TableCell className="p-4">
            {Number((item.node?.payload?.energy as number) * 0.6).toFixed(2)}{" "}
            USD
          </TableCell>
          <TableCell className="text-[var(--color-success)] p-4">
            Valid
          </TableCell>
        </MotionTableRow>
      ))}
    </>
  );
};
