import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams } from "react-router";
import FromCell from "./FromCell";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton2 from "./skeletons/TableSkeleton2";
import { useMemo, useState, useEffect } from "react";
import { getRecentBlocks } from "~/queries/meterscan.queries";
import {
  Pagination,
  PaginationContent,
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

interface RecentBlocksProps {}

function RecentBlocks({}: RecentBlocksProps) {
  const [searchParams] = useSearchParams();
  const { data, isRefetching, isLoading, isSuccess } = useQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      return await getRecentBlocks();
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
  const ITEMS_PER_PAGE = 10;
  const tableHeaders = [
    "PROPOSAL",
    "PROPOSER",
    "STATUS",
    "DATE/TIME",
    "ETHERSCAN",
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const rows = useMemo(() => {
    if (!data) return [];

    return [...data].reverse();
  }, [data]);
  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return rows.slice(start, end);
  }, [rows, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [rows]);
  if (isLoading) return <TableSkeleton2 />;

  if (isSuccess)
    return (
      <>
        {!isRefetching && data && (
          <>
            <Table className="w-full table-fixed hidden md:table">
              <TableHeader>
                <TableRow className="text-left font-sans border-b border-background-secondary">
                  {tableHeaders.map((item, i) => (
                    <TableHead className="w-[20%]" key={i.toString()}>
                      <small>{item}</small>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                <AnimatePresence mode="sync">
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((block, index) => (
                      <MotionTableRow
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={rowVariants}
                        className=""
                      >
                        <TableCell className="truncate text-icon underline roboto-mono">
                          <Link
                            aria-label="Open proposal page"
                            viewTransition
                            to={{
                              pathname: `/proposal/${block.hash}`,
                              search: searchParams.toString(),
                            }}
                            prefetch="viewport"
                          >
                            {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
                          </Link>
                        </TableCell>
                        <FromCell from={block.from} />
                        <TableCell
                          className={`font-medium whitespace-nowrap ${
                            block.transaction_status
                              ? "text-success"
                              : "text-invalid"
                          }`}
                        >
                          Accepted
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(
                            new Date(block.block_time),
                            "MMM d, yyyy 'at' HH:mm",
                          )}
                        </TableCell>
                        <TableCell className="truncate text-[rgb(106,181,219,1)] underline roboto-mono">
                          <a
                            aria-label="Open transaction in etherscan"
                            href={`https://sepolia.etherscan.io/tx/${block.hash}`}
                            target="_blank"
                            className="flex w-fit items-center space-x-2"
                          >
                            <span>
                              {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
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
                        colSpan={5}
                        className="text-center text-sm text-text-secondary"
                      >
                        No blocks match your filters
                      </TableCell>
                    </MotionTableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
            <Pagination className="mx-auto mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage((page) => page - 1);
                      }
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage((page) => page + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
        {isRefetching && <TableSkeleton2 />}
      </>
    );
}

export default RecentBlocks;
