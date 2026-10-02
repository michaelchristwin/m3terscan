import Header from "~/components/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { appSearchParamsSchema } from "~/shared/params.schema";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  validateSearch: appSearchParamsSchema,
});

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
