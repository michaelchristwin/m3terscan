import { getWorldState } from "~/.server/dune";

export async function loader() {
  const data = await getWorldState();
  return data;
}
