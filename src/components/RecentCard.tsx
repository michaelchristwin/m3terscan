import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "urql";
import { useState } from "react";

import { PaginationBar } from "~/components/PaginationBar";
import { commitsQuery } from "~/queries/meterscan.queries";

const PAGE_SIZE = 10;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const shorten = (hash: string) => `${hash.slice(0, 9)}…${hash.slice(-9)}`;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-xs text-text-secondary mb-1">{label}</div>
      {children}
    </div>
  );
}

// Mobile card list
const RecentCard = () => {
  const [page, setPage] = useState(1);

  const [{ data, fetching }] = useQuery({
    query: commitsQuery,
    variables: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
  });

  if (fetching) {
    return (
      <div className="space-y-4" aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-lg bg-background-secondary"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { items, totalCount } = data.commits;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      <AnimatePresence mode="sync">
        {items.length > 0 ? (
          items.map(({ sender, blockTime, txHash }, index) => (
            <motion.div
              key={txHash}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              className="mb-4 bg-background-primary border border-background-secondary rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-background-secondary">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-secondary mb-1">
                    Proposal
                  </div>
                  <Link
                    aria-label="Open proposal page"
                    viewTransition
                    to="/proposal/$hash"
                    params={{ hash: txHash }}
                    preload="intent"
                    className="text-icon underline roboto-mono text-sm font-medium block truncate"
                  >
                    {shorten(txHash)}
                  </Link>
                </div>
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    blockTime
                      ? "bg-success/10 text-success"
                      : "bg-invalid/10 text-invalid"
                  }`}
                >
                  Accepted
                </span>
              </div>

              <Field label="Proposer">
                <div className="text-sm whitespace-nowrap roboto-mono">
                  {shorten(sender)}
                </div>
              </Field>

              <Field label="Time">
                <div className="text-sm text-text-primary">
                  {format(
                    new Date(Number(blockTime) * 1000),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </div>
              </Field>

              <Field label="View on Etherscan">
                <a
                  aria-label="Open transaction in etherscan"
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 text-[rgb(106,181,219)] underline roboto-mono text-sm"
                >
                  <span>{shorten(txHash)}</span>
                  <ExternalLink size={14} />
                </a>
              </Field>
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

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default RecentCard;
