import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1 * 1000,
      staleTime: 60 * 1000,
      refetchInterval: 15 * 60 * 1000, // 15 minutes
    },
  },
});
