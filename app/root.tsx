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
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "~/config/wagmi";
import "@bprogress/core/css";
import { BProgress } from "@bprogress/core";
import { useEffect } from "react";
import { queryClient } from "./queries/ts-client";

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
  let loaderData = useLoaderData<typeof loader>();
  BProgress.configure({});
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

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
    <html
      lang="en"
      className={loaderData?.colorScheme ?? "light"}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var params = new URLSearchParams(window.location.search);
  var chain = params.get('chain');
  var chains = {
    base: {
      '--stats': '#001f3f',
      '--text-primary': '#ffffff',
      '--accent': '#0070f3',
      '--icon': '#0099ff'
    },
    celo: {
      '--stats': '#252830',
      '--text': '#FFFFFF',
      '--accent': '#FCFF52',
      '--accent-secondary': '#FFF799',
      '--accent-tertiary': '#D4E831',
      '--heatmap-min': '#1A1C20',
      '--heatmap-max': '#FCFF52',
      '--icon': '#E8A800'
    },
    optimism: {
      '--stats': '#fff5f5',
      '--text-primary': '#111111',
      '--accent': '#ff0420',
      '--icon': '#e00000'
    }
  };

  if (chain && chains[chain]) {
    var vars = chains[chain];
    for (var key in vars) {
      document.documentElement.style.setProperty(key, vars[key]);
    }
  }
})();
    `,
          }}
        />

        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
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
