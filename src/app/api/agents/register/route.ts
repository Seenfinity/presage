import { NextRequest, NextResponse } from "next/server";
import { registerAgent } from "@/lib/paper-trading";
import { generateApiKey } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per hour
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many registrations. Try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { name, strategy } = body;

    if (!name || !strategy) {
      return NextResponse.json(
        { error: "Name and strategy are required" },
        { status: 400 }
      );
    }

    const result = await registerAgent(name, strategy);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Generate API key for the new agent
    const apiKey = generateApiKey(result.agent.id);

    return NextResponse.json(
      {
        agent: result.agent,
        apiKey,
        note: "Save this API key — it is shown once and required for trading.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register agent:", error);
    return NextResponse.json(
      { error: "Failed to register agent" },
      { status: 500 }
    );
  }
}
