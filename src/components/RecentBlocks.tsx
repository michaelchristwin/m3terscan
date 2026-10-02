import { useQuery } from "urql";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";

import FromCell from "./FromCell";
import TableSkeleton2 from "./skeletons/TableSkeleton2";
import { commitsQuery } from "~/queries/meterscan.queries";
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
  const [offset, setOffset] = useState(0);
  const [{ data, fetching }] = useQuery({
    query: commitsQuery,
    variables: { limit: 10, offset },
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

  useEffect(() => {
    setCurrentPage(1);
  }, [data, fetching]);

  if (fetching) return <TableSkeleton2 />;

  if (data) {
    const totalPages = Math.ceil(data.commits.totalCount / ITEMS_PER_PAGE);
    return (
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
              {data.commits.items.length > 0 ? (
                data.commits.items.map(
                  ({ sender, blockTime, txHash }, index) => (
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
                            pathname: `/proposal/${txHash}`,
                            search: searchParams.toString(),
                          }}
                          prefetch="viewport"
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
                          className="flex w-fit items-center space-x-2"
                        >
                          <span>
                            {txHash.slice(0, 9)}…{txHash.slice(-9)}
                          </span>
                          <ExternalLink size={15} />
                        </a>
                      </TableCell>
                    </MotionTableRow>
                  ),
                )
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
        <Pagination className="mx-auto mt-4 hidden md:flex">
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
    );
  }
}

export default RecentBlocks;
