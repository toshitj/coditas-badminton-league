import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEAMS_APPS_SCRIPT_EXEC_URL =
  "https://script.google.com/macros/s/AKfycby0mGJ25Sf0PYqdU_ySXhnJgcBRcmWrCIe3_OTWQzeN8uhsgaKUTUbjzl4G6UidONA/exec";

export async function GET(_request: NextRequest) {
  try {
    const url = new URL(TEAMS_APPS_SCRIPT_EXEC_URL);
    url.searchParams.set("action", "teams");
    url.searchParams.set("_ts", String(Date.now()));

    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    const normalized =
      data && typeof data === "object" && !Array.isArray(data)
        ? { isRegistrationClosed: false, ...data }
        : data;

    return NextResponse.json(normalized, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch teams",
      },
      { status: 500 }
    );
  }
}

