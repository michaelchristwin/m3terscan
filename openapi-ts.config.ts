import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: ["./openapi/openapi.json", "./openapi/ponder.openapi.json"],
  output: ["src/client/m3terscan", "src/client/ponder"],
});
