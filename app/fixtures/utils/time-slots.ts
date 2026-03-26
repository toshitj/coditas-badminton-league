import type { Fixture } from "../types";

export type TimeSlotGroup = {
  slotKey: string;
  slotLabel: string;
  sortKey: number;
  fixtures: Fixture[];
};

/** Converts the first time in a range string to minutes from midnight for sorting. */
function parse_time_to_minutes(time_str: string): number {
  const first = time_str.split(/[-–]/)[0].trim();

  // "18:00" 24-hour format
  const hm24 = first.match(/^(\d{1,2}):(\d{2})$/);
  if (hm24) return Number(hm24[1]) * 60 + Number(hm24[2]);

  // "6:00PM" or "6:00 PM" 12-hour format
  const hm12 = first.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (hm12) {
    let h = Number(hm12[1]);
    const m = Number(hm12[2]);
    const period = hm12[3].toUpperCase();
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }

  return 9999;
}

/** Groups a flat fixtures array into time slots, sorted chronologically. */
export function group_by_time_slot(fixtures: Fixture[]): TimeSlotGroup[] {
  const by_slot = new Map<string, { sortKey: number; fixtures: Fixture[] }>();

  for (const fixture of fixtures) {
    const raw = (fixture.matchTime || "").trim();
    const key = raw || "__tbd__";

    if (!by_slot.has(key)) {
      by_slot.set(key, {
        sortKey: raw ? parse_time_to_minutes(raw) : 9998,
        fixtures: [],
      });
    }
    by_slot.get(key)!.fixtures.push(fixture);
  }

  const groups: TimeSlotGroup[] = [];
  by_slot.forEach(({ sortKey, fixtures }, key) => {
    groups.push({
      slotKey: key,
      slotLabel: key === "__tbd__" ? "Time TBD" : key,
      sortKey,
      fixtures,
    });
  });

  return groups.sort((a, b) => a.sortKey - b.sortKey);
}
