import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    BigInt: bigint;
    Boolean: boolean;
    Float: unknown;
    Int: number;
    JSON: unknown;
  };
}>();
