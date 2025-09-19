import { ViewToggle } from "./ViewToggle";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchHeatmapData } from "~/queries";
import { Demo } from "./Demo";
import { groupByWeek, splitIntoGroups } from "~/utils/query-utils";
import { Suspense } from "react";

function HeatMap() {
  const { m3terId } = useParams();
  const { data } = useSuspenseQuery({
    queryKey: ["heatmapData"],
    queryFn: () => fetchHeatmapData(new Date(2025, 0, 1), Number(m3terId), 100),
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    staleTime: 15 * 60 * 1000,
  });
  const sortedData = groupByWeek(data);
  const chunkedData = splitIntoGroups(sortedData, 4);

  return (
    <div className="p-6 bg-background text-foreground rounded-lg mt-5 h-[482px]">
      <div className="">
        <div className="text-center flex justify-between items-center mb-3">
          <h3 className="text-foreground text-[16px]">Revenue Heatmap</h3>
          <ViewToggle />
        </div>
      </div>
      <Suspense>
        <div className="grid grid-cols-3 w-full gap-y-3 place-items-center">
          <Demo
            nRows={4}
            data={chunkedData[0]}
            nCols={4}
            width={300}
            height={170}
          />
          <Demo
            nRows={4}
            data={chunkedData[1]}
            nCols={4}
            width={300}
            height={170}
          />
          <Demo
            nRows={4}
            data={chunkedData[2]}
            nCols={4}
            width={300}
            height={170}
          />
          <Demo
            nRows={4}
            data={chunkedData[3]}
            nCols={4}
            width={300}
            height={170}
          />
        </div>
      </Suspense>
    </div>
  );
}

export default HeatMap;
