import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";

function BarChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 h-105 min-w-0 flex flex-col items-center justify-center relative w-full"
    >
      <LoaderCircle className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] text-icon animate-spin" />
      <p className="text-[13px] md:text-[15px] text-neutral-700 text-center">
        Loading charts data...
      </p>
    </motion.div>
  );
}

export default BarChartSkeleton;
