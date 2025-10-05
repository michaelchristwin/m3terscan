import { useSuspenseQuery } from "@tanstack/react-query";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { getProposals } from "~/queries";

interface Proposal {
  m3ter_no: number;
  account: number;
  nonce: number;
}
function ProposalsTable({ hash }: { hash: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ["proposals"],
    queryFn: () => getProposals(hash),
  });

  return (
    <TableBody>
      {data.data.map((item: Proposal) => (
        <TableRow
          key={item.m3ter_no.toString()}
          className="even:bg-[var(--background-primary)] border-0 text-[13px]"
        >
          <TableCell className="font-medium">{item.m3ter_no}</TableCell>
          <TableCell>{item.account}</TableCell>
          <TableCell className="">{item.nonce}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ProposalsTable;
