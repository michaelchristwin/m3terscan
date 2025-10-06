import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import type { BlockData } from "~/.server/dune";
import { TableBody, TableCell, TableRow } from "./ui/table";
const MotionTableRow = motion.create(TableRow);

function RecentBlocks({ data }: { data: BlockData[] }) {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <TableBody className="">
      <AnimatePresence mode="sync">
        {data.length > 0 ? (
          [...data].reverse().map((block, index) => (
            <MotionTableRow
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={rowVariants}
              className="text-sm hover:bg-[var(--background-secondary)] transition-colors"
            >
              <TableCell className="py-3 pr-4 truncate max-w-[120px] text-[var(--icon-color)] hover:underline">
                <Link
                  to={`/proposal/${data.length - index}/hash/${block.hash}`}
                  prefetch="viewport"
                >
                  <span>{block.hash}</span>
                </Link>
              </TableCell>
              <TableCell className="py-3 whitespace-nowrap text-xs">
                {block.from}
              </TableCell>
              <TableCell
                className={`py-3 pr-4 font-medium whitespace-nowrap ${
                  block.transaction_status
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-invalid)]"
                }`}
              >
                Successful
              </TableCell>
              <TableCell className="py-3 pr-4 whitespace-nowrap">
                <span>{new Date(block.block_time).toLocaleString()}</span>
              </TableCell>
            </MotionTableRow>
          ))
        ) : (
          <MotionTableRow
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TableCell
              colSpan={5}
              className="py-4 text-center text-sm text-[var(--text-secondary)]"
            >
              No blocks match your filters
            </TableCell>
          </MotionTableRow>
        )}
      </AnimatePresence>
    </TableBody>
  );
}

export default RecentBlocks;
