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

export async function fetchFromArweave() {
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
        const data = await response.json();
        const details = JSON.parse(data.input.payload[0]);
        return {
          meter_id: details[0],
          usage: details[1],
          rate: details[2],
          extra: details[3],
        };
      })
    );
    //console.log(dataArray);
    return dataArray;
  } catch (error) {
    console.error(error);
  }
}

//fetchFromArweave()
