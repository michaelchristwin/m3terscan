import StatCard from "~/components/StartCard";
import type { Route } from "./+types/home";
import { TrendingUp } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "M3terscan" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="w-full h-full px-[63px]">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-y-5">
        <StatCard title="Total revenue" value="$25K" />
        <StatCard title="Total revenue" value="$25K" />
        <StatCard title="Market cap" value="$10K" />
        <StatCard title="Total regions" value="6 countries" />
        <StatCard title="Total revenue" value="$25K" />
      </div>
      <div className="mt-9.5 w-full">
        <div className="gap-y-[13px]">
          <p className="text-[20px] font-normal">Total revenue</p>
          <div className="gap-x-[3.41px] flex items-center">
            <p className="font-medium text-[24px]">$25K</p>
            <div className="flex items-center justify-center gap-x-0.5 w-[43.09px] h-[16.59px] bg-[#B1FF3B] rounded-[3.87px] p-[5.53px]">
              <p className="font-light text-[8px]">20.0%</p>
              <TrendingUp size={8} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
