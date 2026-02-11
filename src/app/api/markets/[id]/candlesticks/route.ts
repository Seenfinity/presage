import { NextRequest, NextResponse } from "next/server";
import { getCandlesticks } from "@/lib/dflow-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const startTs = parseInt(searchParams.get("startTs") || "0");
    const endTs = parseInt(searchParams.get("endTs") || Date.now().toString());
    const periodInterval = parseInt(searchParams.get("periodInterval") || "60");

    if (!startTs || !endTs) {
      return NextResponse.json(
        { error: "startTs and endTs are required" },
        { status: 400 }
      );
    }

    const candlesticks = await getCandlesticks(id, {
      startTs,
      endTs,
      periodInterval,
    });

    return NextResponse.json({ candlesticks }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch candlesticks:", error);
    return NextResponse.json(
      { error: "Failed to fetch candlesticks" },
      { status: 500 }
    );
  }
}
