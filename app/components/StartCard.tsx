interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="w-[202px] h-[86px] rounded-[16px] flex flex-col items-center gap-y-[6.5px] text-foreground dark:text-background bg-[#FFE0CC] justify-center">
      <p className="text-[14px] font-normal">{title}</p>
      <p className="font-medium text-[25px]">{value}</p>
    </div>
  );
}

export default StatCard;
