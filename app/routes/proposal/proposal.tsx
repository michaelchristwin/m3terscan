import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import ProposalsTable from "~/components/ProposalsTable";
import type { Route } from "./+types/proposal";
import { getProposals } from "~/queries";
import { useLoaderData } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const data = await getProposals(params.hash);
  return { data };
}

export function meta() {
  return [
    { title: "Proposals | M3terscan" },
    { name: "description", content: "" },
  ];
}

function Index() {
  const tablerHeaders = ["M3ter No", "Account", "Nonce"];
  const { data } = useLoaderData<typeof loader>();
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
        <ProposalsTable data={data} />
      </Table>
    </div>
  );
}

export default Index;
