import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1 * 1000,
      staleTime: 60 * 1000,
    },
  },
});
