import { data } from "react-router";
import { schema, setColorScheme } from "~/.server/cookies";
import type { Route } from "./+types/set-theme";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let colorScheme = schema.parse(formData.get("color-scheme"));
  return data(null, {
    headers: { "Set-Cookie": await setColorScheme(colorScheme) },
  });
}
