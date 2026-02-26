import { NextRequest, NextResponse } from "next/server";

const STANDINGS_APPS_SCRIPT_EXEC_URL =
  "https://script.google.com/macros/s/AKfycbx4i6nW3pIP04F_ORAx9IpIDwbb5uOMZOUWwcoxhNwu1hwD06SAG0ldYJAIHUGCEkVr/exec";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(STANDINGS_APPS_SCRIPT_EXEC_URL);
    url.searchParams.set("action", "getStandings");

    const incoming = new URL(request.url);
    const group = incoming.searchParams.get("group");
    if (group) url.searchParams.set("group", group);

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
        message: error instanceof Error ? error.message : "Failed to fetch standings",
      },
      { status: 500 }
    );
  }
}

