import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { formatAddress } from "~/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { createFileRoute } from "@tanstack/react-router";
import { meterQueries } from "~/queries/meterscan.queries";
import { IFRAME_SEARCH } from "~/shared/params.schema";
import { ActivitiesTableSkeleton } from "~/components/skeletons/ActivitiesTableSkeleton";
const MotionTableRow = motion.create(TableRow);

const TABLEHEADERS = ["Time", "Energy", "Signature", "Value", "Status"];

export const Route = createFileRoute("/iframes/activities")({
  component: Activities,
  validateSearch: IFRAME_SEARCH.Activities,
});

function Activities() {
  const { m3terId, colorScheme, dark, even, odd } = Route.useSearch();
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
            {TABLEHEADERS.map((v) => (
              <TableHead className="text-icon p-4" key={v}>
                {v}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {m3terId && (
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
        )}
      </Table>
    </div>
  );
}

const ChiComponent = ({
  m3terId,
  even,
  odd,
  colorScheme,
}: {
  m3terId: number;
  even?: string;
  odd?: string;
  colorScheme: string;
}) => {
  const {
    data: activities,
    isLoading,
    isSuccess,
  } = useQuery(meterQueries.getActivities(m3terId));
  if (isLoading) return <ActivitiesTableSkeleton />;
  if (isSuccess)
    return (
      <>
        {activities?.data.map((item, index) => (
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
              {formatDistanceToNow(new Date(item.timestamp))}
              ago
            </TableCell>
            <TableCell className="p-4">{item.energy.toFixed(2)} kWh</TableCell>
            <TableCell className="p-4">
              <span className="lg:hidden block">
                {formatAddress(item.signature)}
              </span>
              <span className="hidden lg:block">{item.signature}</span>
            </TableCell>
            <TableCell className="p-4">
              {Number(item.energy * 0.6).toFixed(2)} USD
            </TableCell>
            <TableCell className="text-success p-4">Valid</TableCell>
          </MotionTableRow>
        ))}
      </>
    );
};
