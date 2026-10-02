import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://m3terscan-api.onrender.com/openapi.json",
  output: "src/client",
});
