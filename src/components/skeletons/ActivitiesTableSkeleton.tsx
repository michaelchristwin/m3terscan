import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "~/components/ui/table";

const tableHeaders = ["Time", "Energy", "Signature", "Value", "Status"];

function ActivitiesTableSkeleton() {
  const rows = Array.from({ length: 6 });

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

      <TableBody className="text-[12px]">
        {rows.map((_, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="even:bg-background-primary"
          >
            {Array.from({ length: 5 }).map((__, i) => (
              <TableCell key={i} className="p-4">
                <div className="h-3 w-full max-w-30 animate-pulse rounded bg-background-secondary" />
              </TableCell>
            ))}
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  );
}

export { ActivitiesTableSkeleton };
