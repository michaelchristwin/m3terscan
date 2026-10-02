import "chart.js/auto";
// @ts-ignore
import "@bprogress/core/css";
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { BProgress } from "@bprogress/core";
import { useEffect } from "react";
import { ThemeProvider } from "~/components/theme-provider";

const RootLayout = () => {
  BProgress.configure({});

  const isLoading = useRouterState({ select: (s) => s.isLoading });

  useEffect(() => {
    if (isLoading) {
      BProgress.start();
    } else {
      BProgress.done();
    }

    return () => {
      BProgress.done();
    };
  }, [isLoading]);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
