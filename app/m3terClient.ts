import { MeterClient } from "m3ter-graphql-client";

export const m3terClient = new MeterClient({
  endpoint: "https://subgraph.m3ter.ing/v2",
});
