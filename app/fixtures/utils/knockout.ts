import type { Fixture } from "../types";

type StagePlaceholders = { team1: string; team2: string }[];

// Ordered by match sequence (sort by matchId within stage to assign position)
const QF_PLACEHOLDERS: StagePlaceholders = [
  { team1: "GA Winner", team2: "GE Winner" }, // QF1
  { team1: "GB Winner", team2: "GF Winner" }, // QF2
  { team1: "GC Winner", team2: "GG Winner" }, // QF3
  { team1: "GD Winner", team2: "GH Winner" }, // QF4
];

const SF_PLACEHOLDERS: StagePlaceholders = [
  { team1: "QF1 Winner", team2: "QF3 Winner" }, // SF1
  { team1: "QF2 Winner", team2: "QF4 Winner" }, // SF2
];

const FINAL_PLACEHOLDERS: StagePlaceholders = [
  { team1: "SF1 Winner", team2: "SF2 Winner" }, // Final
];

function get_placeholders_for_stage(stage: string): StagePlaceholders | null {
  const s = stage.toLowerCase();
  if (s.includes("quarter")) return QF_PLACEHOLDERS;
  if (s.includes("semi")) return SF_PLACEHOLDERS;
  // Matches "Final" but not "Quarter Final" or "Semi Final"
  if (s.includes("final") && !s.includes("quarter") && !s.includes("semi")) return FINAL_PLACEHOLDERS;
  return null;
}

/**
 * Enriches fixtures with placeholder team names for knockout stage matches
 * where team names haven't been determined yet (empty/blank from API).
 *
 * Position within each stage is determined by sorting matchIds alphabetically,
 * so QF fixtures are assigned QF1→QF4 labels in matchId order.
 */
export function enrich_with_knockout_placeholders(fixtures: Fixture[]): Fixture[] {
  // Build a per-stage ordered index (sorted by matchId)
  const stage_index = new Map<string, Map<string, number>>();

  for (const fixture of fixtures) {
    const stage = fixture.stage || "";
    if (!get_placeholders_for_stage(stage)) continue;
    if (!stage_index.has(stage)) stage_index.set(stage, new Map());
    stage_index.get(stage)!.set(fixture.matchId, 0); // placeholder, will sort next
  }

  for (const [stage, id_map] of stage_index) {
    const sorted_ids = [...id_map.keys()].sort((a, b) => a.localeCompare(b));
    sorted_ids.forEach((id, idx) => id_map.set(id, idx));
    stage_index.set(stage, id_map);
  }

  return fixtures.map((fixture) => {
    const stage = fixture.stage || "";
    const placeholders = get_placeholders_for_stage(stage);
    if (!placeholders) return fixture;

    const position = stage_index.get(stage)?.get(fixture.matchId) ?? -1;
    if (position < 0 || position >= placeholders.length) return fixture;

    const { team1, team2 } = placeholders[position];

    // Only fill in placeholder when the API value is absent
    const resolved_team1 = fixture.team1Name?.trim() || team1;
    const resolved_team2 = fixture.team2Name?.trim() || team2;

    if (resolved_team1 === fixture.team1Name && resolved_team2 === fixture.team2Name) return fixture;
    return { ...fixture, team1Name: resolved_team1, team2Name: resolved_team2 };
  });
}
