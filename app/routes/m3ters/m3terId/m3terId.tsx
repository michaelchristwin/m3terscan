import { Outlet } from "react-router";
import { data } from "react-router";
import type { Route } from "./+types/m3terId";
import { schema, setColorScheme } from "~/.server/cookies";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let colorScheme = schema.parse(formData.get("color-scheme"));
  return data(null, {
    headers: { "Set-Cookie": await setColorScheme(colorScheme) },
  });
}

export default function M3terId() {
  return <Outlet />;
}
