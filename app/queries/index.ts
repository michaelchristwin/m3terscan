export interface ChartsData {
  hour: string;
  energy: number;
}

export interface WeeklyData {
  data: {
    week: number;
    totalEnergy: number;
  }[][];
}

export interface MonthlyData {
  data: {
    date: string;
    energy: number;
  }[];
}

export interface BlockData {
  block_time: string;
  from: string;
  hash: string;
  transaction_status: boolean;
}

export async function getDailyCharts(m3terId: string) {
  const reponse = await fetch(
    `https://m3terscan-api.onrender.com/m3ter/${m3terId}/daily`
  );
  const initialData: ChartsData[] = await reponse.json();
  return initialData;
}

export async function getWeeklyCharts(m3terId: string, year: number) {
  const reponse = await fetch(
    `https://m3terscan-api.onrender.com/m3ter/${m3terId}/weekly?year=${year}`
  );
  const data: WeeklyData = await reponse.json();

  return data;
}

export async function getMonthlyData(
  m3terId: string,
  year: number,
  month: number
) {
  const reponse = await fetch(
    `https://m3terscan-api.onrender.com/m3ter/${m3terId}/monthly?year=${year}&month=${month}`
  );
  const data: MonthlyData = await reponse.json();

  return data.data;
}

export async function getRecentBlocks() {
  const headers = new Headers();
  headers.append("X-Dune-API-Key", import.meta.env.VITE_DUNE_API_KEY ?? "");
  const response = await fetch(
    "https://api.dune.com/api/v1/query/5911866/results?limit=1000",
    {
      headers,
    }
  );

  const data = await response.json();
  return data.result.rows as BlockData[];
}

export async function getProposals(hash: string) {
  const response = await fetch(
    `https://m3terscan-api.onrender.com/proposal?hash=${hash}`
  );
  const proposals = await response.json();
  return proposals;
}
