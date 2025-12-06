import { QueryClient } from "@tanstack/react-query";
import { createClient } from "~/api-client/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1 * 1000,
      staleTime: 60 * 1000,
    },
  },
});

export const m3terscanClient = createClient({
  baseUrl: import.meta.env.VITE_API_URL,
});
