import IframeBarChart from "~/components/charts/IframeBarChart";
import { createFileRoute } from "@tanstack/react-router";
import { IFRAME_SEARCH } from "~/shared/params.schema";

export const Route = createFileRoute("/iframes/bar-chart")({
  component: BarCharts,
  validateSearch: IFRAME_SEARCH.BarCharts,
});
function BarCharts() {
  const { m3terId, colorScheme, dark, colorHigh, colorLow } = Route.useSearch();

  return (
    <div
      style={{
        backgroundColor:
          colorScheme === "dark" && dark ? dark : "var(--background)",
        color:
          colorScheme === "dark" && dark ? "white" : "var(--text-secondary)",
      }}
      className="w-full p-3"
    >
      <IframeBarChart
        m3terId={m3terId.toString()}
        colorHigh={colorHigh}
        colorLow={colorLow}
        colorScheme={colorScheme}
        dark={dark}
      />
    </div>
  );
}
