import { NextRequest, NextResponse } from "next/server";

const HUB_BASE = "https://hub.coditas.org";
const PROJECT = "CBL";
// Note: move TOKEN_PASSWORD to an env variable (CODITAS_HUB_PASSWORD) for production
const TOKEN_PASSWORD = "Xk9mN2pLqR4wS7tY";

let tokenCache: { access_token: string; refresh_token: string } | null = null;

async function fetchFreshTokens(): Promise<{ access_token: string; refresh_token: string }> {
  const res = await fetch(`${HUB_BASE}/api/getTokens?project=${PROJECT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: TOKEN_PASSWORD }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getTokens HTTP ${res.status}`);
  const json = await res.json();
  // Handle both { access_token, refresh_token } and { data: { access_token, refresh_token } }
  const payload: Record<string, unknown> = json?.data ?? json;
  const access_token = String(payload.access_token ?? payload.accessToken ?? "");
  const refresh_token = String(payload.refresh_token ?? payload.refreshToken ?? "");
  if (!access_token) throw new Error("access_token missing in getTokens response");
  return { access_token, refresh_token };
}

async function getTokens() {
  if (!tokenCache) tokenCache = await fetchFreshTokens();
  return tokenCache;
}

function extractStr(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim() && v.trim().toLowerCase() !== "n/a") return v.trim();
    if (typeof v === "number" && !isNaN(v)) return String(v);
  }
  return "";
}

/** Strip non-digits and keep the last 10 digits (handles +91 prefix etc.) */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Normalize date to YYYY-MM-DD for HTML date input */
function normalizeDob(raw: string): string {
  // Strip time component from ISO datetime (e.g. "1992-08-30T00:00:00.000Z")
  if (raw.includes("T")) raw = raw.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // DD/MM/YYYY or DD-MM-YYYY
  const m1 = raw.match(/^(\d{2})[/\-](\d{2})[/\-](\d{4})$/);
  if (m1) return `${m1[3]}-${m1[2]}-${m1[1]}`;
  // M/D/YYYY or MM/DD/YYYY
  const m2 = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) return `${m2[3]}-${m2[1].padStart(2, "0")}-${m2[2].padStart(2, "0")}`;
  return raw;
}

async function queryEmployee(
  employeeId: string,
  tokens: { access_token: string; refresh_token: string },
) {
  return fetch(
    `${HUB_BASE}/api/employees/${encodeURIComponent(employeeId)}?project=${PROJECT}`,
    {
      headers: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
      cache: "no-store",
    },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId")?.trim();

  if (!employeeId || employeeId.length < 2) {
    return NextResponse.json({ error: "Valid employeeId is required" }, { status: 400 });
  }

  try {
    let tokens = await getTokens();
    let res = await queryEmployee(employeeId, tokens);

    // On auth error, clear cached tokens and retry once with fresh ones
    if (res.status === 401 || res.status === 403) {
      tokenCache = null;
      tokens = await fetchFreshTokens();
      tokenCache = tokens;
      res = await queryEmployee(employeeId, tokens);
    }

    if (res.status === 404) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: 502 });
    }

    const json = await res.json();
    // Handle both flat and data-wrapped responses
    const raw: Record<string, unknown> = json?.data ?? json;

    const rawPhone = extractStr(raw, [
      "mobileNumber", "mobile_no", "mobile", "phone",
      "contactNumber", "contact_number", "phoneNumber", "phone_number",
    ]);
    const rawDob = extractStr(raw, [
      "dateOfBirth", "date_of_birth", "dob", "birthDate", "birth_date", "DOB",
    ]);

    const employee = {
      name: extractStr(raw, [
        "name", "fullName", "full_name", "employeeName", "employee_name", "displayName",
      ]),
      email: extractStr(raw, [
        "email", "officialEmail", "official_email", "workEmail", "work_email",
        "emailId", "email_id",
      ]),
      phone: rawPhone ? normalizePhone(rawPhone) : "",
      dob: rawDob ? normalizeDob(rawDob) : "",
    };

    return NextResponse.json({ success: true, employee });
  } catch (err) {
    console.error("[employee-lookup]", err);
    return NextResponse.json({ error: "Failed to fetch employee data" }, { status: 500 });
  }
}
