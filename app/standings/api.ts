import type { Standing, StandingsApiResponse } from "./types";

const standings_api_url = `${process.env.NEXT_PUBLIC_API_URL ?? ""}?action=getStandings`;

export async function fetch_standings(): Promise<Standing[]> {
  const response = await fetch(standings_api_url, { method: "GET" });
  if (!response.ok) throw new Error(`Failed to fetch standings (${response.status})`);
  const body = (await response.json()) as StandingsApiResponse;
  if (!body?.success) throw new Error(body?.message ?? "Failed to fetch standings");
  const standings = body?.standings;
  if (!Array.isArray(standings)) return [];
  return standings;
}
