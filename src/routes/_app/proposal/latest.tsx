import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import Proposals from "~/components/Proposals";

export const Route = createFileRoute("/_app/proposal/latest")({
  component: Latest,
});
function Latest() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["recentBlocks"],
    queryFn: async () => {
      const response = await fetch("/api/blocks");
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background lg:p-8 md:p-6 p-4">
      <title>Latest Proposals</title>
      <meta
        name="description"
        content="The list of the latest proposals on the m3terchain, their IDs and nonces."
      />
      {isLoading && (
        <div className="w-full flex justify-center items-center h-full">
          <div className="block">
            <Loader2 className="animate-spin mx-auto text-icon" size={30} />
            <p className="text-neutral-700">Loading...</p>
          </div>
        </div>
      )}
      {isSuccess && <Proposals hash={data.at(-1).hash} />}
    </div>
  );
}

export default Latest;
