import { redirect } from "react-router";
import type { Route } from "./+types";

export function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const chain = url.searchParams.get("chain");
  if (chain) return redirect(`/m3ter/${params.m3terId}/charts/?chain=${chain}`);
  else return redirect(`/m3ter/${params.m3terId}/charts`);
}
