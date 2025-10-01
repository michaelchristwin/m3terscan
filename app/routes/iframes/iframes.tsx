import { data, Outlet } from "react-router";
import { setColorScheme } from "~/.server/cookies";
import type { Route } from "./+types/iframes";

export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const colorScheme = url.searchParams.get("colorScheme");

  return data(null, {
    headers: { "Set-Cookie": await setColorScheme(colorScheme || "light") },
  });
}

function Iframes() {
  return <Outlet />;
}

export default Iframes;
