import { useEnsName } from "wagmi";
import { TableCell } from "./ui/table";
import type { Address } from "viem";

function FromCell({ from }: { from: string }) {
  const { data } = useEnsName({
    address: from as Address,
  });

  return (
    <TableCell className="whitespace-nowrap">
      {data ?? `${from.slice(0, 9)}…${from.slice(-9)}`}
    </TableCell>
  );
}

export default FromCell;
