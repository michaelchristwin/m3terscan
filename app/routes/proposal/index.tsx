import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Suspense } from "react";
import ProposalsTable from "~/components/ProposalsTable";
import type { Route } from "./+types";

function Index({ params }: Route.ActionArgs) {
  const tablerHeaders = ["M3ter No", "Account", "Nonce"];
  return (
    <div className="w-[90%] p-4 mx-auto">
      <Table className="">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            {tablerHeaders.map((item, i) => (
              <TableHead className="text-[var(--icon-color)]" key={i}>
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <Suspense>
          <ProposalsTable hash={params.hash} />
        </Suspense>
      </Table>
    </div>
  );
}

export default Index;
