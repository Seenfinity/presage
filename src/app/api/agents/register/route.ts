import { NextRequest, NextResponse } from "next/server";
import { registerAgent } from "@/lib/paper-trading";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, strategy } = body;

    if (!name || !strategy) {
      return NextResponse.json(
        { error: "Name and strategy are required" },
        { status: 400 }
      );
    }

    const agent = await registerAgent(name, strategy);

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error("Failed to register agent:", error);
    return NextResponse.json(
      { error: "Failed to register agent" },
      { status: 500 }
    );
  }
}
