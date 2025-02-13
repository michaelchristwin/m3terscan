"use server";

import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";

const client = new Client({
  url: "https://arweave-search.goldsky.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const QUERY = gql`
  query {
    transactions(
      tags: [
        { name: "Contract-Use", values: ["M3tering Protocol"] }
        { name: "Bundle-Format", values: ["binary", "json"], op: NEQ }
      ]
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

async function fetchFromArweave() {
  try {
    const { data, error } = await client.query(QUERY, {});
    if (error) {
      throw error;
    }
    // console.log(data);
    const edges = data.transactions.edges;
    const dataArray = await Promise.all(
      edges.map(async (edge: any) => {
        const nodeId = edge.node.id;
        const response = await fetch(`https://ar-io.net/${nodeId}`);
        return response.json();
      })
    );
    console.log(dataArray);
    return dataArray;
  } catch (error) {
    console.error(error);
  }
}

fetchFromArweave();
