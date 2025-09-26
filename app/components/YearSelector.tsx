import { ChevronLeft, ChevronRight } from "lucide-react";
import { viewMode } from "./ViewToggle";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

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
  useSignals();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isMonthlyView = viewMode.value === "monthly";

  const handlePrev = () => {
    const minYear = 2021;

    if (isMonthlyView && selectedMonth !== null) {
      // Prevent going before Jan 2021
      if (selectedYear.value === minYear && selectedMonth.value === 0) {
        return; // stop here
      }

      if (selectedMonth.value === 0) {
        selectedYear.value--;
        selectedMonth.value = 11;
      } else {
        selectedMonth.value--;
      }
    } else {
      // Prevent going before 2021 in yearly view
      if (selectedYear.value <= minYear) {
        return;
      }
      selectedYear.value--;
    }
  };

  const handleNext = () => {
    if (isMonthlyView && selectedMonth !== null) {
      // Prevent moving past current month in current year
      if (
        selectedYear.value > currentYear ||
        (selectedYear.value === currentYear &&
          selectedMonth.value >= currentMonth)
      ) {
        return; // stop here
      }

      if (selectedMonth.value === 11) {
        selectedYear.value++;
        selectedMonth.value = 0;
      } else {
        selectedMonth.value++;
      }
    } else {
      // Prevent moving past current year entirely
      if (selectedYear.value >= currentYear) {
        return;
      }
      selectedYear.value++;
    }
  };

  const isAtCurrent =
    (isMonthlyView &&
      selectedYear.value === currentYear &&
      selectedMonth.value === currentMonth) ||
    (!isMonthlyView && selectedYear.value === currentYear);

  const isAtMinimum =
    (isMonthlyView &&
      selectedYear.value === 2021 &&
      selectedMonth.value === 0) ||
    (!isMonthlyView && selectedYear.value === 2021);

  return (
    <div className="flex justify-center gap-2 flex-wrap items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={isAtMinimum}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors disabled:bg-[var(--background-secondary)] disabled:!cursor-not-allowed"
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
          disabled={isAtCurrent}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors disabled:bg-[var(--background-secondary)] disabled:!cursor-not-allowed"
          aria-label={isMonthlyView ? "Next month" : "Next year"}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
