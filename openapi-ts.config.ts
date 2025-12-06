import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://127.0.0.1:8000/openapi.json", // sign up at app.heyapi.dev
  output: {
    format: "prettier",
    lint: "eslint",
    path: "app/api-client",
  },
  plugins: [
    "@hey-api/schemas",
    "@tanstack/react-query",
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "javascript",
      name: "@hey-api/typescript",
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
      validator: "zod",
    },
  ],
});
