import { getRecentBlocks } from "~/.server/dune";

export async function loader() {
  const data = await getRecentBlocks();
  return data;
}
