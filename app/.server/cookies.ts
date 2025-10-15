import { createCookie } from "react-router";
import { createTypedCookie } from "remix-utils/typed-cookie";
import { z } from "zod";

// Create a cookie using React Router's createCookie API
const cookie = createCookie("color-scheme", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secrets: [process.env.COOKIE_SECRET ?? "secret"],
});

// Create a Zod schema to validate the cookie value
export const schema = z.enum(["dark", "light"]).default("dark").catch("dark");

const typedCookie = createTypedCookie({ cookie, schema });

// Helpers to get and set the cookie
export function getColorScheme(request: Request) {
  const colorScheme = typedCookie.parse(request.headers.get("Cookie"));
  return colorScheme ?? "system";
}

export async function setColorScheme(colorScheme: string) {
  return await typedCookie.serialize(colorScheme);
}
