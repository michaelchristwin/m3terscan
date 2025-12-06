import { getWeeksOfYearM3TerM3TerIdWeeksYearGetOptions } from "~/api-client/@tanstack/react-query.gen";
import { m3terscanClient } from "~/queries/query-client";
import GridHeatmap from "./GridHeatmap";
import { selectedYear, YearSelector } from "../YearSelector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSignals } from "@preact/signals-react/runtime";
import { splitInto4 } from "~/lib/utils";

function WeeklyHeatmap({ m3terId }: { m3terId: string }) {
  useSignals();
  const { data: gridHeatMapData } = useSuspenseQuery({
    ...getWeeksOfYearM3TerM3TerIdWeeksYearGetOptions({
      client: m3terscanClient,
      path: { m3ter_id: Number(m3terId), year: selectedYear.value },
    }),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });

  const [arr1, arr2, arr3, arr4] = splitInto4(gridHeatMapData);

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
          <GridHeatmap data={arr1} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Apr</p>
            <p>May</p>
            <p>Jun</p>
          </div>
          <GridHeatmap data={arr2} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Jul</p>
            <p>Aug</p>
            <p>Sep</p>
          </div>
          <GridHeatmap data={arr3} />
        </div>
        <div>
          <div className="grid grid-cols-3 w-[200px] text-[14px] text-center">
            <p>Oct</p>
            <p>Nov</p>
            <p>Dec</p>
          </div>
          <GridHeatmap data={arr4} />
        </div>
      </div>
    </div>
  );
}

export default WeeklyHeatmap;
