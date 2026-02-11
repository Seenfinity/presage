import { NextResponse } from "next/server";
import { getLeaderboard, seedDemoAgents } from "@/lib/paper-trading";

export async function GET() {
  try {
    // Seed demo agents if none exist
    await seedDemoAgents();

    const leaderboard = await getLeaderboard();

    return NextResponse.json({ agents: leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
