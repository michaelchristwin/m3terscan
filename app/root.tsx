import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getColorScheme } from "./.server/cookies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "~/config/wagmi";
import { Loader } from "lucide-react";
import { useState } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  let colorScheme = await getColorScheme(request);
  return { colorScheme };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  let loaderData = useLoaderData<typeof loader>();
  return (
    <html lang="en" className={loaderData?.colorScheme ?? "light"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {isLoading && (
          <div className="absolute flex justify-center items-center z-[70] top-0 left-0 h-[200px] w-full transition-all duration-300">
            {/* Backdrop blur effect */}
            <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-b-[70%]" />

            {/* Loader container */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 blur-xl animate-pulse" />

              {/* Loader background */}
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg dark:shadow-blue-500/10 border border-gray-200 dark:border-gray-700">
                {/* Spinning icon */}
                <Loader className="w-8 h-8 text-[var(--icon-color)] animate-spin" />
              </div>
            </div>

            {/* Optional: Loading text */}
            <span className="absolute bottom-10 text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
              Loading...
            </span>
          </div>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
