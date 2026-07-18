import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import { getRecentBlocks } from "~/queries/meterscan.queries";

// Mobile Card Component
const RecentCard = () => {
  const { data, isRefetching } = useQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      return await getRecentBlocks();
    },
  });

  const cardVariants = (index: number) => {
    return {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.05, duration: 0.3 },
      },
    };
  };
  const ITEMS_PER_PAGE = 10;

  const rows = useMemo(() => {
    if (!data) return [];

    return [...data].reverse();
  }, [data]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return rows.slice(start, end);
  }, [rows, currentPage]);
  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | "ellipsis")[] = [];

    // Beginning
    if (currentPage <= 3) {
      items.push(1, 2, 3, "ellipsis", totalPages);
      return items;
    }

    // End
    if (currentPage >= totalPages - 2) {
      items.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
      return items;
    }

    // Middle
    items.push(
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    );

    return items;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rows, isRefetching]);
  return (
    <AnimatePresence mode="sync">
      {rows.length > 0 ? (
        <>
          {paginatedRows.map((block, index) => (
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              key={index.toString()}
              exit="hidden"
              variants={cardVariants(index)}
              className="bg-background-primary border border-background-secondary rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header with Status */}
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-background-secondary">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-secondary mb-1">
                    Proposal
                  </div>
                  <Link
                    aria-label="Open proposal page"
                    viewTransition
                    to={`/proposal/${block.hash}`}
                    prefetch="viewport"
                    className="text-icon underline roboto-mono text-sm font-medium block truncate"
                  >
                    {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
                  </Link>
                </div>
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    block.transaction_status
                      ? "bg-success/10 text-success"
                      : "bg-invalid/10 text-invalid"
                  }`}
                >
                  Successful
                </span>
              </div>

              {/* From Address */}
              <div className="mb-3">
                <div className="text-xs text-text-secondary mb-1">Proposer</div>
                <div className="text-sm">
                  <span className="whitespace-nowrap roboto-mono md:hidden block">
                    {`${block.from.slice(0, 9)}…${block.from.slice(-9)}`}
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="mb-3">
                <div className="text-xs text-text-secondary mb-1">Time</div>
                <div className="text-sm text-text-primary">
                  {format(
                    new Date(block.block_time),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </div>
              </div>

              {/* Etherscan Link */}
              <div>
                <div className="text-xs text-text-secondary mb-1">
                  View on Etherscan
                </div>
                <Link
                  aria-label="Open transaction in etherscan"
                  viewTransition
                  to={`https://sepolia.etherscan.io/tx/${block.hash}`}
                  target="_blank"
                  prefetch="viewport"
                  className="inline-flex items-center space-x-2 text-[rgb(106,181,219)] underline roboto-mono text-sm"
                >
                  <span>
                    {block.hash.slice(0, 9)}…{block.hash.slice(-9)}
                  </span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage((p) => p - 1);
                    }
                  }}
                />
              </PaginationItem>

              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === item}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(item);
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage((p) => p + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-8 text-sm text-text-secondary"
        >
          No blocks match your filters
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentCard;
