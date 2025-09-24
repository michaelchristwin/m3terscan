import React from "react";

interface CalendarHeatmapProps {
  year?: number;
  month?: number;
  data?: { date: string; energy: number }[]; // Optional energy data by date
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  year = 2024,
  month = 3,
  data = [],
}) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Convert hex colors to RGB for interpolation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const minColor = hexToRgb("#FBE6D4");
  const maxColor = hexToRgb("#EB822A");

  // Get energy values for color scaling
  const energyValues = data.map((item) => item.energy);
  const minEnergy = energyValues.length > 0 ? Math.min(...energyValues) : 0;
  const maxEnergy = energyValues.length > 0 ? Math.max(...energyValues) : 1;

  const getColor = (energy: number) => {
    if (minEnergy === maxEnergy)
      return `rgb(${maxColor.r}, ${maxColor.g}, ${maxColor.b})`;

    const ratio = (energy - minEnergy) / (maxEnergy - minEnergy);
    const r = Math.round(minColor.r + (maxColor.r - minColor.r) * ratio);
    const g = Math.round(minColor.g + (maxColor.g - minColor.g) * ratio);
    const b = Math.round(minColor.b + (maxColor.b - minColor.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const createCalendarData = () => {
    const days = [];

    // Add empty days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
      const dayData = data.find((item) => item.date === dateString);

      days.push({
        day: i,
        energy: dayData?.energy || 0,
        hasData: !!dayData,
      });
    }

    return days;
  };

  const calendarData = createCalendarData();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.map((dayData, index) => (
          <div
            key={index}
            className={`
              w-16 h-10 rounded flex items-center justify-center
              text-xs font-medium transition-all duration-200
              ${
                dayData
                  ? dayData.hasData
                    ? "cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
                    : "bg-gray-100 opacity-40"
                  : ""
              }
            `}
            style={{
              backgroundColor: dayData?.hasData
                ? getColor(dayData.energy)
                : undefined,
            }}
            title={
              dayData
                ? dayData.hasData
                  ? `${month}/${dayData.day}/${year}: ${dayData.energy} units`
                  : `No data for ${month}/${dayData.day}/${year}`
                : ""
            }
          >
            {dayData && (
              <span
                className={dayData.hasData ? "text-gray-800" : "text-gray-400"}
              >
                {/* {dayData.day} */}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
