export interface BlockData {
  block_time: string;
  from: string;
  hash: string;
  transaction_status: boolean;
}

export async function getRecentBlocks() {
  const headers = new Headers();
  headers.append("X-Dune-API-Key", process.env.DUNE_API_KEY ?? "");
  const response = await fetch(
    "https://api.dune.com/api/v1/query/5911866/results?limit=1000",
    {
      headers,
    }
  );

  const data = await response.json();
  return data.result.rows as BlockData[];
}
