import { getWeeklyCharts } from "~/queries";
import GridHeatmap from "./GridHeatmap";
import { selectedYear, YearSelector } from "../YearSelector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSignals } from "@preact/signals-react/runtime";

function WeeklyHeatmap({ m3terId }: { m3terId: string }) {
  useSignals();
  const { data: gridHeatMapData } = useSuspenseQuery({
    queryKey: ["heatmapData", m3terId, selectedYear.value],
    queryFn: () => getWeeklyCharts(m3terId, selectedYear.value),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });

  return (
    <div className="w-full">
      <YearSelector />
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-y-7 mt-5">
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Jan</p>
            <p>Feb</p>
            <p>Mar</p>
          </div>
          <GridHeatmap data={gridHeatMapData[0]} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Apr</p>
            <p>May</p>
            <p>Jun</p>
          </div>
          <GridHeatmap data={gridHeatMapData[1]} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Jul</p>
            <p>Aug</p>
            <p>Sep</p>
          </div>
          <GridHeatmap data={gridHeatMapData[2]} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Oct</p>
            <p>Nov</p>
            <p>Dec</p>
          </div>
          <GridHeatmap data={gridHeatMapData[3]} />
        </div>
      </div>
    </div>
  );
}

export default WeeklyHeatmap;
