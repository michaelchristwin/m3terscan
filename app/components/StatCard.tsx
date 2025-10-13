interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="md:w-[202px] w-[170px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-[#FFE0CC] justify-center">
      <p className="md:text-[14px] text-[12px] font-normal">{title}</p>
      <p className="font-medium md:text-[25px] text-[20px]">{value}</p>
    </div>
  );
}

export default StatCard;
