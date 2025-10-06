import { TableBody, TableCell, TableRow } from "./ui/table";

interface Proposal {
  m3ter_no: number;
  account: string;
  nonce: number;
}
function ProposalsTable({ data }: { data: any }) {
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
