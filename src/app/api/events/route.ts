import { NextRequest, NextResponse } from "next/server";
import { getEvents, GetEventsParams } from "@/lib/dflow-api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params: GetEventsParams = {
      limit: parseInt(searchParams.get("limit") || "20"),
      withNestedMarkets: searchParams.get("withNestedMarkets") !== "false",
      sort: (searchParams.get("sort") as any) || "volume24h",
      order: (searchParams.get("order") as any) || "desc",
    };

    const events = await getEvents(params);

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
