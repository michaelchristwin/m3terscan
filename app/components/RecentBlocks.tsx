import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { getRecentBlocks } from "~/queries";

function RecentBlocks() {
  const { data } = useSuspenseQuery({
    queryKey: ["recentBlocks"],
    queryFn: () => getRecentBlocks(),
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
    <tbody className="divide-y divide-[var(--background-secondary)]">
      <AnimatePresence mode="sync">
        {data.length > 0 ? (
          data.reverse().map((block, index) => (
            <motion.tr
              key={block.hash ?? index}
              custom={index}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={rowVariants}
              className="text-sm hover:bg-[var(--background-secondary)] transition-colors"
            >
              <td className="py-3 pr-4 font-medium whitespace-nowrap">
                {data.length - index}
              </td>
              <td className="py-3 pr-4 truncate max-w-[120px] text-[var(--icon-color)] hover:underline">
                <Link
                  to={`/proposal/${data.length - index}/hash/${block.hash}`}
                  prefetch="intent"
                >
                  <span>{block.hash}</span>
                </Link>
              </td>
              <td
                className={`py-3 pr-4 font-medium whitespace-nowrap ${
                  block
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-invalid)]"
                }`}
              >
                Successful
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                <span>{new Date(block.block_time).toLocaleString()}</span>
              </td>
              <td className="py-3 whitespace-nowrap text-xs">{block.from}</td>
            </motion.tr>
          ))
        ) : (
          <motion.tr
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <td
              colSpan={5}
              className="py-4 text-center text-sm text-[var(--text-secondary)]"
            >
              No blocks match your filters
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </tbody>
  );
}

export default RecentBlocks;
