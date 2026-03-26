import type { DateInfo, Fixture, FixturesTab } from "../types";

const MONTH_BY_KEY: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
};

function pad_2(value: number): string {
  return String(value).padStart(2, "0");
}

function format_day_month_label(date_key: string, has_year_in_label: boolean): string {
  const date = new Date(`${date_key}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return date_key;
  return new Intl.DateTimeFormat("en-IN", has_year_in_label
    ? { day: "2-digit", month: "short", year: "numeric" }
    : { day: "2-digit", month: "short" }
  ).format(date);
}

export function to_date_info(match_date: string): DateInfo | null {
  const raw = (match_date ?? "").trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const key = `${iso[1]}-${iso[2]}-${iso[3]}`;
    return { key, sortKey: key, label: format_day_month_label(key, true) };
  }

  const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}|\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = dmy[3].length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    const key = `${year}-${pad_2(month)}-${pad_2(day)}`;
    return { key, sortKey: key, label: format_day_month_label(key, true) };
  }

  const ordinal_day_first = raw.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)(?:\s+(\d{4}))?$/i);
  if (ordinal_day_first) {
    const day = Number(ordinal_day_first[1]);
    const month_key = ordinal_day_first[2].toLowerCase();
    const month = MONTH_BY_KEY[month_key.slice(0, 3)] ?? MONTH_BY_KEY[month_key] ?? null;
    if (!month) return { key: `unknown:${raw}`, sortKey: `9999-99-99:${raw}`, label: raw };
    const year = ordinal_day_first[3] ? Number(ordinal_day_first[3]) : new Date().getFullYear();
    const key = `${year}-${pad_2(month)}-${pad_2(day)}`;
    return { key, sortKey: key, label: format_day_month_label(key, Boolean(ordinal_day_first[3])) };
  }

  const ordinal_month_first = raw.match(/^([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/i);
  if (ordinal_month_first) {
    const month_key = ordinal_month_first[1].toLowerCase();
    const month = MONTH_BY_KEY[month_key.slice(0, 3)] ?? MONTH_BY_KEY[month_key] ?? null;
    if (!month) return { key: `unknown:${raw}`, sortKey: `9999-99-99:${raw}`, label: raw };
    const day = Number(ordinal_month_first[2]);
    const year = ordinal_month_first[3] ? Number(ordinal_month_first[3]) : new Date().getFullYear();
    const key = `${year}-${pad_2(month)}-${pad_2(day)}`;
    return { key, sortKey: key, label: format_day_month_label(key, Boolean(ordinal_month_first[3])) };
  }

  return { key: `unknown:${raw}`, sortKey: `9999-99-99:${raw}`, label: raw };
}

export function build_tabs_from_fixtures(fixtures: Fixture[]): FixturesTab[] {
  const by_date = new Map<string, { sortKey: string; label: string; fixtures: Fixture[] }>();

  for (const fixture of fixtures) {
    const date_info = to_date_info(fixture.matchDate);
    if (!date_info) continue;
    const prev = by_date.get(date_info.key);
    if (!prev)
      by_date.set(date_info.key, { sortKey: date_info.sortKey, label: date_info.label, fixtures: [fixture] });
    else
      prev.fixtures.push(fixture);
  }

  const entries: Array<[string, { sortKey: string; label: string; fixtures: Fixture[] }]> = [];
  by_date.forEach((value, date_key) => entries.push([date_key, value]));

  return entries
    .sort(([, a], [, b]) => a.sortKey.localeCompare(b.sortKey))
    .map(([date_key, value]) => ({ key: date_key, label: value.label, fixtures: value.fixtures }));
}
