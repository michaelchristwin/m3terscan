import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";

import { TableBody, TableCell, TableRow } from "./ui/table";
import FromCell from "./FromCell";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
const MotionTableRow = motion.create(TableRow);

function RecentBlocks() {
  const { data } = useSuspenseQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      const response = await fetch("/api/get-recent-blocks");
      const data = await response.json();
      return data;
    },
  });
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
    <TableBody className="w-full">
      <AnimatePresence mode="sync">
        {data && data.length > 0 ? (
          [...data].reverse().map((block, index) => (
            <MotionTableRow
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={rowVariants}
              className=""
            >
              <TableCell className="truncate text-[var(--icon-color)] underline roboto-mono">
                <Link
                  aria-label="Open proposal page"
                  viewTransition
                  to={`/proposal/${block.hash}`}
                  prefetch="viewport"
                >
                  {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
                </Link>
              </TableCell>
              <FromCell from={block.from} />
              <TableCell
                className={`font-medium whitespace-nowrap ${
                  block.transaction_status
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-invalid)]"
                }`}
              >
                Successful
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(block.block_time), "MMM d, yyyy 'at' h:mm a")}
              </TableCell>
              <TableCell className="truncate text-[rgb(106,181,219,1)] underline roboto-mono">
                <Link
                  aria-label="Open transaction in etherscan"
                  viewTransition
                  to={`https://sepolia.etherscan.io/tx/${block.hash}`}
                  target="_blank"
                  prefetch="viewport"
                  className="flex w-fit items-center space-x-2"
                >
                  <span>
                    {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
                  </span>
                  <ExternalLink size={15} />
                </Link>
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
              className="text-center text-sm text-[var(--text-secondary)]"
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
