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
import { decodeParam } from "~/utils/query-utils";
const MotionTableRow = motion.create(TableRow);

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

function Activities() {
  const [searchParams, _] = useSearchParams();
  const m3terId = searchParams.get("m3terId");
  const colorScheme = searchParams.get("colorScheme") || "light";
  const dark = decodeParam(searchParams.get("dark"));
  const even = decodeParam(searchParams.get("even"));
  const odd = decodeParam(searchParams.get("odd"));

  return (
    <div
      style={{
        backgroundColor:
          colorScheme === "dark" && dark ? dark : "var(--background)",
        color:
          colorScheme === "dark" && dark ? "white" : "var(--text-secondary)",
      }}
    >
      <Table className="text-left">
        <TableHeader className="text-[13px] font-semibold">
          <TableRow
            style={{
              backgroundColor:
                colorScheme === "dark" && dark
                  ? dark
                  : "var(--background-secondary)",
            }}
          >
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
                <ChiComponent
                  m3terId={m3terId}
                  even={even}
                  odd={odd}
                  colorScheme={colorScheme}
                />
              </AnimatePresence>
            </TableBody>
          </Suspense>
        )}
      </Table>
    </div>
  );
}

export default Activities;

const ChiComponent = ({
  m3terId,
  even,
  odd,
  colorScheme,
}: {
  m3terId: string;
  even: string | null;
  odd: string | null;
  colorScheme: string;
}) => {
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
          className="border-0"
          style={{
            backgroundColor:
              colorScheme === "dark"
                ? index % 2 === 0 && even
                  ? even
                  : `${odd || "var(--background-primary)"}`
                : "var(--background-primary)",
          }}
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
