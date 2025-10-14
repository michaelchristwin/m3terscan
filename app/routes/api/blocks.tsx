import { getRecentBlocks, refreshRecentBlocks } from "~/.server/dune";

export async function loader() {
  const data = await getRecentBlocks();
  return data;
}

export async function action() {
  await refreshRecentBlocks();
}
