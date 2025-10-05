import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx")]),
  ...prefix("m3ter/:m3terId", [
    layout("routes/m3ter/layout.tsx", [
      index("routes/m3ter/m3terId/index.tsx"),
      route("activities", "routes/m3ter/m3terId/activities.tsx"),
      route("charts", "routes/m3ter/m3terId/charts.tsx"),
      route("overview", "routes/m3ter/m3terId/overview.tsx"),
      route("ask-ai", "routes/m3ter/m3terId/ask-ai.tsx"),
      route("trades", "routes/m3ter/m3terId/trades.tsx"),
    ]),
  ]),
  ...prefix("iframes", [
    route("bar-chart", "routes/iframes/bar-chart.tsx"),
    route("activities", "routes/iframes/activities.tsx"),
  ]),
  route("proposal/:proposalNumer/hash/:hash", "routes/proposal/index.tsx"),
  route("action/set-theme", "routes/action/set-theme.tsx"),
] satisfies RouteConfig;
