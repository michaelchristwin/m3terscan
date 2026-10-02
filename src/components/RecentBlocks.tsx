import { useQuery } from "urql";
import { format } from "date-fns";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";

import FromCell from "./FromCell";
import TableSkeleton2 from "./skeletons/TableSkeleton2";
import { commitsQuery } from "~/queries/meterscan.queries";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "~/components/ui/table";

const MotionTableRow = motion.create(TableRow);

const PAGE_SIZE = 10;
const TABLE_HEADERS = [
  "PROPOSAL",
  "PROPOSER",
  "STATUS",
  "DATE/TIME",
  "ETHERSCAN",
];

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

/** Returns e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 20] */
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("ellipsis");
    items.push(p);
  });
  return items;
}

function RecentBlocks() {
  const [page, setPage] = useState(1);

  const [{ data, fetching }] = useQuery({
    query: commitsQuery,
    variables: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
  });

  if (fetching) return <TableSkeleton2 />;
  if (!data) return null;

  const { items, totalCount } = data.commits;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const goTo = (p: number) => setPage(Math.min(Math.max(p, 1), totalPages));

  return (
    <>
      <Table className="w-full table-fixed hidden md:table">
        <TableHeader>
          <TableRow className="text-left font-sans border-b border-background-secondary">
            {TABLE_HEADERS.map((item) => (
              <TableHead className="w-[20%]" key={item}>
                <small>{item}</small>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          <AnimatePresence mode="sync">
            {items.length > 0 ? (
              items.map(({ sender, blockTime, txHash }, index) => (
                <MotionTableRow
                  key={txHash}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={rowVariants}
                >
                  <TableCell className="truncate text-icon underline roboto-mono">
                    <Link
                      aria-label="Open proposal page"
                      viewTransition
                      to="/proposal/$hash"
                      params={{ hash: txHash }}
                      search={(prev) => ({ ...prev })}
                      preload="intent"
                    >
                      {txHash.slice(0, 9)}…{txHash.slice(-9)}
                    </Link>
                  </TableCell>
                  <FromCell from={sender} />
                  <TableCell
                    className={`font-medium whitespace-nowrap ${
                      blockTime ? "text-success" : "text-invalid"
                    }`}
                  >
                    Accepted
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(
                      new Date(Number(blockTime) * 1000),
                      "MMM d, yyyy 'at' HH:mm",
                    )}
                  </TableCell>
                  <TableCell className="truncate text-[rgb(106,181,219,1)] underline roboto-mono">
                    <a
                      aria-label="Open transaction in etherscan"
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-fit items-center space-x-2"
                    >
                      <span>
                        {txHash.slice(0, 9)}…{txHash.slice(-9)}
                      </span>
                      <ExternalLink size={15} />
                    </a>
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
                  colSpan={TABLE_HEADERS.length}
                  className="text-center text-sm text-text-secondary"
                >
                  No blocks match your filters
                </TableCell>
              </MotionTableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>

      <Pagination className="mx-auto mt-4 hidden md:flex">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={(e) => {
                e.preventDefault();
                goTo(page - 1);
              }}
            />
          </PaginationItem>

          {getPageItems(page, totalPages).map((item, i) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={page === item}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                goTo(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default RecentBlocks;
