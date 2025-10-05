import { redirect } from "react-router";
import type { Route } from "./+types";

export function loader({ params }: Route.LoaderArgs) {
  return redirect(`/m3ter/${params.m3terId}/charts`);
}
