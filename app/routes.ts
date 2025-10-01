import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [index("routes/home.tsx")]),
  route("m3ters", "routes/m3ters/m3ters.tsx", [
    index("routes/m3ters/index.tsx"),
    route(":m3terId", "routes/m3ters/m3terId/m3terId.tsx", [
      index("routes/m3ters/m3terId/index.tsx"),
      route("activity", "routes/m3ters/m3terId/activity.tsx"),
      route("charts", "routes/m3ters/m3terId/charts.tsx"),
      route("overview", "routes/m3ters/m3terId/overview.tsx"),
      route("ask-ai", "routes/m3ters/m3terId/ask-ai.tsx"),
    ]),
  ]),
  route("iframes", "routes/iframes/iframes.tsx", [
    index("routes/iframes/index.tsx"),
    route("bar-chart", "routes/iframes/bar-chart.tsx"),
    route("activities", "routes/iframes/activities.tsx"),
  ]),
] satisfies RouteConfig;
