import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTimeStore } from "~/store";
import type { Mode } from "~/types";

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

interface YearSelectorProps {
  viewMode: Mode;
}

export function YearSelector({ viewMode }: YearSelectorProps) {
  const { selectedYear, selectedMonth, setSelectedYear, setSelectedMonth } =
    useTimeStore();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isMonthlyView = viewMode === "monthly";

  const handlePrev = () => {
    const minYear = 2025;

    if (isMonthlyView && selectedMonth !== null) {
      if (selectedYear === minYear && selectedMonth === 0) {
        return;
      }

      if (selectedMonth === 0) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      // Prevent going before 2021 in yearly view
      if (selectedYear <= minYear) {
        return;
      }
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNext = () => {
    if (isMonthlyView && selectedMonth !== null) {
      // Prevent moving past current month in current year
      if (
        selectedYear > currentYear ||
        (selectedYear === currentYear && selectedMonth >= currentMonth)
      ) {
        return; // stop here
      }

      if (selectedMonth === 11) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    } else {
      // Prevent moving past current year entirely
      if (selectedYear >= currentYear) {
        return;
      }
      setSelectedYear(selectedYear);
    }
  };

  const isAtCurrent =
    (isMonthlyView &&
      selectedYear === currentYear &&
      selectedMonth === currentMonth) ||
    (!isMonthlyView && selectedYear === currentYear);

  const isAtMinimum =
    (isMonthlyView && selectedYear === 2021 && selectedMonth === 0) ||
    (!isMonthlyView && selectedYear === 2021);

  return (
    <div className="flex justify-center gap-2 flex-wrap items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={isAtMinimum}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors disabled:bg-background-secondary disabled:cursor-not-allowed!"
          aria-label={isMonthlyView ? "Previous month" : "Previous year"}
        >
          <ChevronLeft size={20} />
        </button>
        <h3>
          {isMonthlyView && selectedMonth !== null
            ? `${MONTHS_LONG[selectedMonth]} ${selectedYear}`
            : selectedYear}
        </h3>
        <button
          onClick={handleNext}
          disabled={isAtCurrent}
          className="p-1 rounded-full bg-[#77FF9D] text-[#28B750] transition-colors disabled:bg-background-secondary disabled:cursor-not-allowed!"
          aria-label={isMonthlyView ? "Next month" : "Next year"}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
