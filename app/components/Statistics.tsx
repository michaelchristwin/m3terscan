import { useQueries } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

function Statistics() {
  const [worldState, recentBlocks] = useQueries({
    queries: [
      {
        queryKey: ["getWorldState"],
        queryFn: async () => {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/world-state`
          );
          const data = await response.json();
          return data;
        },
      },
      {
        queryKey: ["recentBlocks"],
        queryFn: async () => {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/blocks`
          );
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
      <div className="md:w-50.5 w-37.5 h-21.5 rounded-2xl flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total energy generated
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {Number(totatEnergy.toFixed()).toLocaleString()} MWh
        </p>
      </div>
      <div className="md:w-50.5 w-37.5 h-21.5 rounded-2xl flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total transactions
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {Number(totalNonces.toFixed()).toLocaleString()}
        </p>
      </div>
      <div className="md:w-50.5 w-37.5 h-21.5 rounded-2xl flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total proposals
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {recentBlocks.data.length}
        </p>
      </div>

      <div className="md:w-50.5 w-37.5 h-21.5 rounded-2xl flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          Total active m3ters
        </p>
        <p className="font-medium md:text-[25px] text-[20px] text-text-primary dark:text-stat-text">
          {worldState.data.length} devices
        </p>
      </div>

      <div className="md:w-50.5 w-37.5 h-21.5 rounded-2xl flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-stat-text bg-stats justify-center">
        <p className="md:text-[14px] text-[12px] font-normal text-text-primary dark:text-stat-text">
          See more
        </p>
        <button
          type="button"
          aria-label="See more"
          className="bg-[#FFC9B2] rounded-full h-9 w-9 flex justify-center items-center"
        >
          <ArrowRight size={14} className="text-icon" />
        </button>
      </div>
    </div>
  );
}

export default Statistics;
