import React from "react";

interface EnergyData {
  totalEnergy: number;
  week: number;
}

interface GridHeatmapProps {
  data: EnergyData[];
}

const GridHeatmap: React.FC<GridHeatmapProps> = ({ data }) => {
  // Since we have 13 active cells (weeks) in a 4x4 grid (16 total cells)
  // We'll have 3 inactive cells (null values)
  const totalCells = 16;

  // Find min and max values for color interpolation
  const minEnergy = Math.min(...data.map((item) => item.totalEnergy));
  const maxEnergy = Math.max(...data.map((item) => item.totalEnergy));

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

  // Interpolate between min and max colors based on value
  const getColor = (value: number) => {
    // all values equal → use minColor
    if (minEnergy === maxEnergy) {
      return `rgb(${minColor.r}, ${minColor.g}, ${minColor.b})`;
    }

    // normal interpolation
    const ratio = (value - minEnergy) / (maxEnergy - minEnergy);
    const r = Math.round(minColor.r + (maxColor.r - minColor.r) * ratio);
    const g = Math.round(minColor.g + (maxColor.g - minColor.g) * ratio);
    const b = Math.round(minColor.b + (maxColor.b - minColor.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const gridData: (EnergyData | null)[] = [];

  const startWeek = Math.min(...data.map((d) => d.week));
  const endWeek = Math.max(...data.map((d) => d.week));
  for (let week = startWeek; week <= endWeek; week++) {
    const weekData = data.find((item) => item.week === week);
    gridData.push(weekData || null);
  }
  while (gridData.length < totalCells) {
    gridData.push(null);
  }

  // Arrange in 4x4 grid (column-major order for top-to-bottom rendering)
  const gridColumns = [];
  const numColumns = 4;
  const numRows = 4;

  for (let col = 0; col < numColumns; col++) {
    const column = [];
    for (let row = 0; row < numRows; row++) {
      const index = col * numRows + row; // column-major order
      column.push(gridData[index]);
    }
    gridColumns.push(column);
  }

  return (
    <div className="bg-background rounded-lg">
      <div className="flex gap-2">
        {gridColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {column.map((cell, rowIndex) => {
              const isActive = cell !== null;

              return (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`
                    md:w-16  w-12 h-10 flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    ${isActive ? "cursor-pointer hover:scale-105 hover:shadow-lg" : "bg-gray-100 opacity-50"}
                  `}
                  style={{
                    backgroundColor: isActive
                      ? getColor(cell.totalEnergy)
                      : undefined,
                    borderRadius: "8px",
                  }}
                  title={
                    isActive
                      ? `Week ${cell.week}: ${cell.totalEnergy} units`
                      : "No data"
                  }
                >
                  {!isActive && (
                    <span className="text-gray-400 text-2xl"></span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridHeatmap;
