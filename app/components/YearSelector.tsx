import { ChevronLeft, ChevronRight } from "lucide-react";
import { viewMode } from "./ViewToggle";
import { signal } from "@preact/signals-react";

export const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const selectedMonth = signal(new Date().getMonth());
export const selectedYear = signal(new Date().getFullYear());
export const YearSelector = () => {
  const isMonthlyView = viewMode.value === "monthly";

  const handlePrev = () => {
    if (isMonthlyView && selectedMonth !== null) {
      if (selectedMonth.value === 0) {
        selectedYear.value--;
        selectedMonth.value = 11;
      } else {
        selectedMonth.value--;
      }
    } else {
      selectedYear.value--;
    }
  };

  const handleNext = () => {
    if (isMonthlyView && selectedMonth !== null) {
      if (selectedMonth.value === 11) {
        selectedYear.value++;
        selectedMonth.value = 0;
      } else {
        selectedMonth.value++;
      }
    } else {
      selectedYear.value++;
    }
  };

  return (
    <div className="flex justify-center gap-2 flex-wrap items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors"
          aria-label={isMonthlyView ? "Previous month" : "Previous year"}
        >
          <ChevronLeft size={20} />
        </button>
        <h3>
          {isMonthlyView && selectedMonth !== null
            ? `${MONTHS_LONG[selectedMonth.value]} ${selectedYear}`
            : selectedYear}
        </h3>
        <button
          onClick={handleNext}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors"
          aria-label={isMonthlyView ? "Next month" : "Next year"}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
