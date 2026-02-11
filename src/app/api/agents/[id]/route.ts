import { NextRequest, NextResponse } from "next/server";
import { calculatePortfolio } from "@/lib/paper-trading";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const portfolio = await calculatePortfolio(id);

    if (!portfolio) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch agent portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent portfolio" },
      { status: 500 }
    );
  }
}
