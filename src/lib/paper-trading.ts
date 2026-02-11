import { Agent, PaperTrade, Position, Portfolio } from "./types";

const INITIAL_BALANCE = 10000;

// Pure in-memory storage — resets on each Vercel cold start (fine for demo)
let agentsCache: Map<string, Agent> = new Map();
let tradesCache: PaperTrade[] = [];
let seeded = false;

export async function registerAgent(name: string, strategy: string): Promise<Agent> {
  const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const agent: Agent = {
    id,
    name,
    strategy,
    balance: INITIAL_BALANCE,
    initialBalance: INITIAL_BALANCE,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  agentsCache.set(id, agent);
  return agent;
}

export async function getAgent(agentId: string): Promise<Agent | null> {
  await seedDemoAgents();
  return agentsCache.get(agentId) || null;
}

export async function getAllAgents(): Promise<Agent[]> {
  await seedDemoAgents();
  return Array.from(agentsCache.values());
}

export async function getAgentTrades(agentId: string): Promise<PaperTrade[]> {
  await seedDemoAgents();
  return tradesCache.filter((t) => t.agentId === agentId);
}

export async function getAllTrades(): Promise<PaperTrade[]> {
  await seedDemoAgents();
  return [...tradesCache].sort((a, b) => b.timestamp - a.timestamp);
}

export async function executeTrade(
  agentId: string,
  marketTicker: string,
  side: "YES" | "NO",
  quantity: number,
  reasoning?: string
): Promise<{ success: boolean; trade?: PaperTrade; error?: string }> {
  await seedDemoAgents();

  const agent = agentsCache.get(agentId);
  if (!agent) {
    return { success: false, error: "Agent not found" };
  }

  // Use a simulated price since we're in demo mode
  const price = side === "YES" ? 0.55 : 0.45;
  const totalCost = quantity * price;

  if (totalCost > agent.balance) {
    return { success: false, error: "Insufficient balance" };
  }

  const trade: PaperTrade = {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId,
    marketTicker,
    marketTitle: marketTicker,
    side,
    quantity,
    price,
    totalCost,
    timestamp: Date.now(),
    reasoning,
  };

  agent.balance -= totalCost;
  agent.updatedAt = Date.now();
  tradesCache.push(trade);
  agentsCache.set(agentId, agent);

  return { success: true, trade };
}

export async function calculatePositions(agentId: string): Promise<Position[]> {
  await seedDemoAgents();

  const trades = tradesCache.filter((t) => t.agentId === agentId);
  const positionMap = new Map<string, PaperTrade[]>();

  for (const trade of trades) {
    const key = `${trade.marketTicker}-${trade.side}`;
    if (!positionMap.has(key)) positionMap.set(key, []);
    positionMap.get(key)!.push(trade);
  }

  const positions: Position[] = [];

  for (const [key, positionTrades] of positionMap.entries()) {
    const [marketTicker, side] = key.split("-") as [string, "YES" | "NO"];
    const totalQuantity = positionTrades.reduce((sum, t) => sum + t.quantity, 0);
    const totalCost = positionTrades.reduce((sum, t) => sum + t.totalCost, 0);
    const avgPrice = totalCost / totalQuantity;

    // Simulate current price with slight movement from avg
    const currentPrice = avgPrice * (1 + (Math.random() * 0.1 - 0.05));
    const currentValue = totalQuantity * currentPrice;
    const unrealizedPnL = currentValue - totalCost;

    positions.push({
      marketTicker,
      marketTitle: positionTrades[0].marketTitle,
      side,
      quantity: totalQuantity,
      avgPrice,
      currentPrice,
      unrealizedPnL,
    });
  }

  return positions;
}

export async function calculatePortfolio(agentId: string): Promise<Portfolio | null> {
  await seedDemoAgents();

  const agent = agentsCache.get(agentId);
  if (!agent) return null;

  const positions = await calculatePositions(agentId);
  const trades = tradesCache.filter((t) => t.agentId === agentId);

  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
  const totalValue = agent.balance + totalUnrealizedPnL;
  const totalPnL = totalValue - agent.initialBalance;
  const totalPnLPercent = (totalPnL / agent.initialBalance) * 100;

  return {
    agent,
    positions,
    trades,
    totalPnL,
    totalPnLPercent,
  };
}

export async function getLeaderboard(): Promise<Portfolio[]> {
  await seedDemoAgents();

  const agents = Array.from(agentsCache.values());
  const portfolios: Portfolio[] = [];

  for (const agent of agents) {
    const portfolio = await calculatePortfolio(agent.id);
    if (portfolio) portfolios.push(portfolio);
  }

  portfolios.sort((a, b) => b.totalPnLPercent - a.totalPnLPercent);
  portfolios.forEach((p, i) => { p.rank = i + 1; });

  return portfolios;
}

// ── Demo seed data ──────────────────────────────────────────────────

export async function seedDemoAgents() {
  if (seeded) return;
  seeded = true;

  const now = Date.now();
  const hour = 3600_000;

  // Agent 1 — strong performer (+15% ROI)
  const a1: Agent = {
    id: "agent-demo-oracle",
    name: "Oracle Prime",
    strategy: "Multi-timeframe technical analysis with on-chain metrics correlation",
    balance: 8200, // spent 1800 on trades, but positions are up
    initialBalance: INITIAL_BALANCE,
    createdAt: now - 72 * hour,
    updatedAt: now - 1 * hour,
  };

  // Agent 2 — moderate performer (+3% ROI)
  const a2: Agent = {
    id: "agent-demo-sigma",
    name: "Sigma Mind",
    strategy: "NLP analysis of Fed communications and economic indicators",
    balance: 8950,
    initialBalance: INITIAL_BALANCE,
    createdAt: now - 60 * hour,
    updatedAt: now - 3 * hour,
  };

  // Agent 3 — slightly negative (-5% ROI)
  const a3: Agent = {
    id: "agent-demo-quantum",
    name: "Quantum Edge",
    strategy: "High-frequency pattern recognition across prediction market microstructure",
    balance: 7800,
    initialBalance: INITIAL_BALANCE,
    createdAt: now - 48 * hour,
    updatedAt: now - 2 * hour,
  };

  agentsCache.set(a1.id, a1);
  agentsCache.set(a2.id, a2);
  agentsCache.set(a3.id, a3);

  // Helper to make trades
  let tradeIdx = 0;
  function t(
    agentId: string,
    ticker: string,
    title: string,
    side: "YES" | "NO",
    qty: number,
    price: number,
    hoursAgo: number,
    reasoning: string
  ): PaperTrade {
    tradeIdx++;
    return {
      id: `trade-demo-${tradeIdx}`,
      agentId,
      marketTicker: ticker,
      marketTitle: title,
      side,
      quantity: qty,
      price,
      totalCost: qty * price,
      timestamp: now - hoursAgo * hour,
      reasoning,
    };
  }

  tradesCache = [
    // ── Oracle Prime trades (strong performer) ──
    t(a1.id, "SUPERBOWL-LX-KC", "Will the Chiefs win Super Bowl LX?", "YES", 50, 0.62, 68,
      "Chiefs dynasty momentum is real — Mahomes in peak form and Vegas line is tightening toward KC."),
    t(a1.id, "BTC-100K-MAR", "Bitcoin above $100K on March 1?", "YES", 80, 0.45, 55,
      "ETF inflows averaging $400M/day and halving supply squeeze hasn't fully priced in yet."),
    t(a1.id, "FED-RATE-CUT-MAR", "Fed cuts rates at March FOMC?", "NO", 60, 0.35, 48,
      "January CPI came in hot — the Fed will hold steady. Market is over-pricing a cut."),
    t(a1.id, "AI-EXEC-ORDER-Q1", "AI executive order signed by end of Q1?", "YES", 40, 0.58, 36,
      "Senate committee markup scheduled for February. Bipartisan momentum after the deepfake hearings."),
    t(a1.id, "NYC-SNOW-FEB", "NYC snowfall > 12 inches in February?", "YES", 30, 0.40, 24,
      "Polar vortex displacement pattern emerging — GFS and Euro models converging on major nor'easter."),
    t(a1.id, "BTC-100K-MAR", "Bitcoin above $100K on March 1?", "YES", 40, 0.52, 12,
      "Adding to position — spot BTC just broke $92K resistance with massive volume. Momentum confirmed."),

    // ── Sigma Mind trades (moderate performer) ──
    t(a2.id, "FED-RATE-CUT-MAR", "Fed cuts rates at March FOMC?", "NO", 70, 0.38, 58,
      "Parsing Powell's latest testimony — 'patient' appeared 6 times. No cut coming in March."),
    t(a2.id, "SUPERBOWL-LX-KC", "Will the Chiefs win Super Bowl LX?", "NO", 35, 0.40, 50,
      "Regression to the mean is inevitable. KC's defensive metrics are declining week-over-week."),
    t(a2.id, "AI-EXEC-ORDER-Q1", "AI executive order signed by end of Q1?", "YES", 50, 0.55, 40,
      "Congressional NLP sentiment shifted +18% bullish on regulation after Zuckerberg testimony."),
    t(a2.id, "BTC-100K-MAR", "Bitcoin above $100K on March 1?", "NO", 30, 0.52, 30,
      "On-chain whale wallets distributing at $88K. Smart money is taking profits, not adding."),
    t(a2.id, "HURRICANE-CAT4-JUN", "Category 4+ hurricane before June 30?", "NO", 45, 0.25, 20,
      "Sea surface temps in MDR are still below the convective threshold. La Niña fading reduces activity."),

    // ── Quantum Edge trades (slightly negative) ──
    t(a3.id, "BTC-100K-MAR", "Bitcoin above $100K on March 1?", "YES", 100, 0.58, 46,
      "Order flow imbalance detected — buy-side pressure 3.2x sell-side on major exchanges."),
    t(a3.id, "SUPERBOWL-LX-KC", "Will the Chiefs win Super Bowl LX?", "YES", 60, 0.65, 42,
      "Line movement pattern matches 2023 championship game setup. Sharp money is on KC."),
    t(a3.id, "FED-RATE-CUT-MAR", "Fed cuts rates at March FOMC?", "YES", 80, 0.62, 35,
      "Treasury yield curve inversion deepening — historically precedes emergency cuts within 60 days."),
    t(a3.id, "AI-EXEC-ORDER-Q1", "AI executive order signed by end of Q1?", "NO", 40, 0.48, 28,
      "Legislative velocity analysis shows insufficient calendar days for floor vote before March 31."),
    t(a3.id, "NYC-SNOW-FEB", "NYC snowfall > 12 inches in February?", "NO", 55, 0.55, 15,
      "High-res NAM model showing the storm track shifting 50 miles offshore. Bust incoming."),
  ];
}
