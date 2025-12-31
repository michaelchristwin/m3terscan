import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Mobile Card Component
const RecentCard = ({ showAll }: { showAll: boolean }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blocks`
      );
      const data = await response.json();
      return data;
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

  const visibleRows = useMemo(() => {
    return showAll ? [...data].reverse() : [...data].reverse().slice(0, 5);
  }, [data, showAll]);

  return (
    <AnimatePresence mode="sync">
      {data && data.length > 0 ? (
        visibleRows.map((block, index) => (
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
                <div className="text-xs text-text-secondary mb-1">Proposal</div>
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
                {format(new Date(block.block_time), "MMM d, yyyy 'at' h:mm a")}
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
        ))
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
