import type { Fixture, FixturesApiResponse } from "./types";

const fixtures_api_url = `${process.env.NEXT_PUBLIC_API_URL ?? ""}?action=getFixtures`;

export async function fetch_fixtures(): Promise<Fixture[]> {
  const response = await fetch(fixtures_api_url, { method: "GET" });
  if (!response.ok) throw new Error(`Failed to fetch fixtures (${response.status})`);
  const body = (await response.json()) as FixturesApiResponse;
  if (!body?.success) throw new Error(body?.message ?? "Failed to fetch fixtures");
  const fixtures = body?.fixtures;
  if (!Array.isArray(fixtures)) return [];
  return fixtures;
}
