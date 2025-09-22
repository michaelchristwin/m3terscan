import { motion } from "motion/react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
type Mode = "yearly" | "monthly";

export const viewMode = signal<Mode>("yearly");

export const ViewToggle = () => {
  useSignals();

  const views: {
    mode: "yearly" | "monthly";
    label: string;
    targetView: "yearly" | "monthly";
  }[] = [
    {
      mode: "monthly",
      label: "Monthly",
      targetView: "monthly",
    },
    {
      mode: "yearly",
      label: "Yearly",
      targetView: "yearly",
    },
  ];

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex border border-dashed rounded-full p-1 border-[#4B4B4B]">
        {views.map(({ mode, label }) => {
          const isActive = viewMode.value === mode;
          return (
            <button
              key={mode}
              onClick={() => (viewMode.value = mode)}
              className={`relative z-10 px-4 py-1.5 rounded-full transition-colors text-[12px] md:text-sm font-medium`}
            >
              {isActive && (
                <motion.div
                  layoutId="toggle-pill"
                  className="absolute inset-0 bg-green-100 rounded-full z-[-1]"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                  }}
                />
              )}
              <span
                className={
                  isActive
                    ? "text-[var(--color-success)]"
                    : "text-[var(--text-secondary)]"
                }
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
