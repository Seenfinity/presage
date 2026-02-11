import { NextRequest, NextResponse } from "next/server";
import { executeTrade } from "@/lib/paper-trading";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { marketTicker, side, quantity, reasoning } = body;

    if (!marketTicker || !side || !quantity) {
      return NextResponse.json(
        { error: "marketTicker, side, and quantity are required" },
        { status: 400 }
      );
    }

    if (side !== "YES" && side !== "NO") {
      return NextResponse.json(
        { error: "side must be YES or NO" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "quantity must be positive" },
        { status: 400 }
      );
    }

    const result = await executeTrade(
      id,
      marketTicker,
      side,
      quantity,
      reasoning
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ trade: result.trade }, { status: 201 });
  } catch (error) {
    console.error("Failed to execute trade:", error);
    return NextResponse.json(
      { error: "Failed to execute trade" },
      { status: 500 }
    );
  }
}
