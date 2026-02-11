import { NextRequest, NextResponse } from "next/server";
import { getOrderbook } from "@/lib/dflow-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderbook = await getOrderbook(id);

    if (!orderbook) {
      return NextResponse.json(
        { error: "Orderbook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ orderbook }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orderbook:", error);
    return NextResponse.json(
      { error: "Failed to fetch orderbook" },
      { status: 500 }
    );
  }
}
