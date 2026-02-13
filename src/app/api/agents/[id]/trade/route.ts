import { NextRequest, NextResponse } from "next/server";
import { executeTrade } from "@/lib/paper-trading";
import { verifyApiKey } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authentication
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required. Include x-api-key header." },
        { status: 401 }
      );
    }

    if (!verifyApiKey(apiKey, id)) {
      return NextResponse.json(
        { error: "Invalid API key or unauthorized for this agent" },
        { status: 403 }
      );
    }

    // Rate limit: 30 trades per agent per minute
    const rl = rateLimit(`trade:${id}`, 30, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many trades. Slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

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

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "quantity must be a positive number" },
        { status: 400 }
      );
    }

    const result = await executeTrade(id, marketTicker, side, quantity, reasoning);

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
