import { redirect } from "react-router";
import type { Route } from "./+types/m3terId";

export function loader({ params }: Route.LoaderArgs) {
  return redirect(`/m3ters/${params.m3terId}/charts`);
}
