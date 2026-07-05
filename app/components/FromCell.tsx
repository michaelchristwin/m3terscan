import { useQuery } from "@tanstack/react-query";
import { TableCell } from "./ui/table";

import { publicClient } from "~/config/viem";
import type { Address } from "viem";

function FromCell({ from }: { from: string }) {
  const { data } = useQuery({
    queryKey: ["getEnsAdress"],
    queryFn: async () => {
      return await publicClient.getEnsName({ address: from as Address });
    },
  });

  return (
    <TableCell className="whitespace-nowrap roboto-mono">
      {data ?? `${from.slice(0, 9)}…${from.slice(-9)}`}
    </TableCell>
  );
}

export default FromCell;
