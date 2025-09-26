import type { ChangeEvent } from "react";
import { useRef } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface FilterBlocksProps {
  filters: {
    status: string;
    proposer: string;
  };
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

export default function FilterBlocks({
  filters,
  onFilterChange,
  onClearFilters,
  onClose,
}: FilterBlocksProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  useClickOutside(filterRef, onClose);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      ref={filterRef}
      className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:top-full mt-0 sm:mt-2 z-50 sm:z-10 w-full sm:w-64 bg-[var(--background-primary)] p-4 sm:p-4 rounded-none sm:rounded-lg shadow-lg border-1 sm:border border-[var(--background-secondary)]"
    >
      {/* Mobile header */}
      <div className="sm:hidden flex justify-between items-center mb-4 pb-2 border-b border-[var(--background-secondary)]">
        <h3 className="text-sm font-medium">Filters</h3>
        <button
          onClick={onClose}
          className="text-sm cursor-pointer text-[var(--icon-color)]"
        >
          <X size={20} />
        </button>
      </div>

      {/* Desktop close button (top-right corner) */}
      <div className="hidden sm:flex justify-end">
        <button
          onClick={onClose}
          className="text-xs cursor-pointer text-[var(--text-secondary)] hover:text-[var(--icon-color)]"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4 h-full sm:h-auto overflow-y-auto">
        <div>
          <h4 className="text-xs font-medium mb-2">Status</h4>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
            {["Successful", "Invalid", "All"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-sm cursor-pointer p-2 sm:p-0 hover:bg-[var(--background-secondary)] sm:hover:bg-transparent rounded"
              >
                <input
                  type="radio"
                  name="status"
                  value={status === "All" ? "" : status}
                  checked={filters.status === (status === "All" ? "" : status)}
                  onChange={onFilterChange}
                  className="accent-[var(--icon-color)] outline-none focus:ring "
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--background-secondary)] pt-4">
          <h4 className="text-xs font-medium mb-2">Proposer</h4>
          <input
            type="text"
            name="proposer"
            value={filters.proposer}
            onChange={onFilterChange}
            placeholder="Type in name"
            className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] rounded-md focus:ring"
          />
        </div>

        {/* Mobile footer */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[var(--background-primary)] p-4 border-t border-[var(--background-secondary)]">
          <div className="flex gap-3">
            <button
              onClick={onClearFilters}
              className="flex-1 py-2 text-sm border border-[var(--background-secondary)] rounded transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm bg-[var(--icon-color)] text-white rounded transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Desktop clear button */}
        <button
          onClick={onClearFilters}
          className="hidden sm:block w-full py-2 text-xs text-[var(--icon-color)] hover:bg-[var(--background-secondary)] rounded transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    </motion.div>
  );
}
