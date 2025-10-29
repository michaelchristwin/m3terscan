import { useSuspenseQueries } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

function Statistics() {
  const [recentBlocks, worldState] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["recentBlocks"],
        queryFn: async () => {
          const response = await fetch("/api/blocks");
          const data = await response.json();
          return data;
        },
      },
      {
        queryKey: ["getWorldState"],
        queryFn: async () => {
          const response = await fetch("/api/world-state");
          const data = await response.json();
          return data;
        },
      },
    ],
  });

  const totatEnergy: number = worldState.data.reduce(
    (sum: number, item: any) => sum + Number(item.account),
    0
  );
  const totalNonces: number = worldState.data.reduce(
    (sum: number, item: any) => sum + Number(item.nonce),
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-y-5">
      <div className="md:w-[202px] w-[140px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total energy generated
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {Number(totatEnergy.toFixed()).toLocaleString()} MWh
        </p>
      </div>
      <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total transactions
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {Number(totalNonces.toFixed()).toLocaleString()}
        </p>
      </div>
      <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total proposals
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {recentBlocks.data.length}
        </p>
      </div>

      <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total active m3ters
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {worldState.data.length} devices
        </p>
      </div>

      <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          See more
        </p>
        <button
          type="button"
          aria-label="See more"
          className="bg-[#FFC9B2] rounded-full h-[36px] w-[36px] flex justify-center items-center"
        >
          <ArrowRight size={14} className="text-icon" />
        </button>
      </div>
    </div>
  );
}

export default Statistics;
