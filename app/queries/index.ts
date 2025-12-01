export interface ChartsData {
  hour: string;
  energy: number;
}

export interface WeeklyData {
  week: number;
  totalEnergy: number;
}

export interface MonthlyData {
  date: string;
  energy: number;
}
export interface ProposalData {
  m3ter_no: number;
  account: string;
  nonce: number;
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
    `https://m3terscan-api.onrender.com/m3ter/${m3terId}/weeks/${year}`
  );
  const data: WeeklyData[][] = await reponse.json();

  return data;
}

export async function getMonthlyData(
  m3terId: string,
  year: number,
  month: number
) {
  const reponse = await fetch(
    `https://m3terscan-api.onrender.com/m3ter/${m3terId}/months/${year}/${month}`
  );
  const data: MonthlyData[] = await reponse.json();

  return data;
}

export async function getProposals(hash: string) {
  const response = await fetch(
    `https://m3terscan-api.onrender.com/proposal/${hash}`
  );
  const proposals: ProposalData[] = await response.json();
  return proposals;
}
