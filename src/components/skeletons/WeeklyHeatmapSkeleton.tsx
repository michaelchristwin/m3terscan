import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";

function WeeklyHeatmapSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 h-105 min-w-0 flex flex-col items-center justify-center relative w-full"
    >
      <LoaderCircle className="h-7.5 w-7.5 md:h-10 md:w-10 text-icon animate-spin" />
      <p className="text-[13px] md:text-[15px] text-neutral-700 text-center">
        Loading heatmap data...
      </p>
    </motion.div>
  );
}

export default WeeklyHeatmapSkeleton;
