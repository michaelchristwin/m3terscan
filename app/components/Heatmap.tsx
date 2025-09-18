import { ViewToggle } from "./ViewToggle";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { useParams } from "react-router";
// import { fetchHeatmapData } from "~/queries";
import { Demo } from "./Demo";

function HeatMap() {
  //   const { m3terId } = useParams();
  //   const { data } = useSuspenseQuery({
  //     queryKey: ["heatmapData"],
  //     queryFn: () => fetchHeatmapData(new Date(2025, 0, 1), Number(m3terId), 30),
  //     refetchInterval: 15 * 60 * 1000, // 15 minutes
  //     staleTime: 15 * 60 * 1000,
  //   });

  const nCol = 10;
  const nRow = 5;

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  type HeatmapData = { x: string; y: string; value: number }[];

  let data2: HeatmapData = [];

  for (let x = 0; x < nCol; x++) {
    for (let y = 0; y < nRow; y++) {
      data2.push({
        x: alphabet[x],
        y: alphabet[y],
        value: Math.random() * 40,
      });
    }
  }

  return (
    <div className="p-6 bg-background text-foreground rounded-lg mt-5 h-[482px]">
      <div className="">
        <div className="text-center flex justify-between items-center mb-3">
          <h3 className="text-foreground text-[16px]">Revenue Heatmap</h3>
          <ViewToggle />
        </div>
      </div>
      <Demo data={data2} width={700} height={400} />
    </div>
  );
}

export default HeatMap;
