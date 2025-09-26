import React from "react";

interface CalendarHeatmapProps {
  data: { date: string; energy: number }[]; // Always 30 or 31 entries
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data }) => {
  // --- Colors same as before ---
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

  const energyValues = data.map((item) => item.energy);
  const minEnergy = Math.min(...energyValues);
  const maxEnergy = Math.max(...energyValues);

  const getColor = (energy: number) => {
    if (energy === 0) return `rgb(${minColor.r}, ${minColor.g}, ${minColor.b})`;

    if (minEnergy === maxEnergy) {
      return `rgb(${maxColor.r}, ${maxColor.g}, ${maxColor.b})`;
    }

    const ratio = (energy - minEnergy) / (maxEnergy - minEnergy);
    const r = Math.round(minColor.r + (maxColor.r - minColor.r) * ratio);
    const g = Math.round(minColor.g + (maxColor.g - minColor.g) * ratio);
    const b = Math.round(minColor.b + (maxColor.b - minColor.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Alignment logic ---
  const firstDate = new Date(data[0].date); // first entry in data
  const startDay = firstDate.getDay(); // 0=Sun, 1=Mon, etc.

  // prepend nulls for offset
  const paddedData = [...Array(startDay).fill(null), ...data];

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
      <div className="grid grid-cols-7 gap-y-[15px] gap-x-[20px]">
        {paddedData.map((dayData, index) =>
          dayData ? (
            <div
              key={index}
              className="w-18 h-10 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-md hover:z-10"
              style={{ backgroundColor: getColor(dayData.energy) }}
              title={`${dayData.date}: ${dayData.energy.toFixed(2)} units`}
            />
          ) : (
            <div key={index} /> // empty placeholder cell
          )
        )}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
