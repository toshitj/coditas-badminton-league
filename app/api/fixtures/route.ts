import { NextRequest, NextResponse } from "next/server";

const FIXTURES_APPS_SCRIPT_EXEC_URL =
  "https://script.google.com/macros/s/AKfycbx4i6nW3pIP04F_ORAx9IpIDwbb5uOMZOUWwcoxhNwu1hwD06SAG0ldYJAIHUGCEkVr/exec";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(FIXTURES_APPS_SCRIPT_EXEC_URL);
    url.searchParams.set("action", "getFixtures");

    const incoming = new URL(request.url);
    const forward_keys = ["team", "stage", "group", "status", "matchId"];
    for (const key of forward_keys) {
      const value = incoming.searchParams.get(key);
      if (value) url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), { method: "GET", redirect: "follow" });
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch fixtures",
      },
      { status: 500 }
    );
  }
}

