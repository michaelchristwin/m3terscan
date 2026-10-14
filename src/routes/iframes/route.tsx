import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/iframes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
