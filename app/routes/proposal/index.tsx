import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Suspense } from "react";
import ProposalsTable from "~/components/ProposalsTable";
import type { Route } from "./+types";

export function meta() {
  return [
    { title: "Proposals | M3terscan" },
    { name: "description", content: "" },
  ];
}

function Index({ params }: Route.ActionArgs) {
  const tablerHeaders = ["M3ter No", "Account", "Nonce"];
  return (
    <div className="w-[90%] p-4 mx-auto">
      <Table className="">
        <TableCaption>A table of your proposals.</TableCaption>
        <TableHeader>
          <TableRow>
            {tablerHeaders.map((item, i) => (
              <TableHead className="text-[var(--icon-color)]" key={i}>
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <Suspense
          fallback={
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center italic text-neutral-700"
                >
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          }
        >
          <ProposalsTable hash={params.hash} />
        </Suspense>
      </Table>
    </div>
  );
}

export default Index;
