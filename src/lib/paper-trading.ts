import { promises as fs } from "fs";
import path from "path";
import { Agent, PaperTrade, Position, Portfolio } from "./types";
import { getMarket } from "./dflow-api";

const DATA_DIR = path.join(process.cwd(), "data");
const AGENTS_FILE = path.join(DATA_DIR, "agents.json");
const TRADES_FILE = path.join(DATA_DIR, "trades.json");

const INITIAL_BALANCE = 10000;

// In-memory cache
let agentsCache: Map<string, Agent> = new Map();
let tradesCache: PaperTrade[] = [];
let initialized = false;

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }
}

async function loadData() {
  if (initialized) return;

  await ensureDataDir();

  try {
    const agentsData = await fs.readFile(AGENTS_FILE, "utf-8");
    const agents: Agent[] = JSON.parse(agentsData);
    agentsCache = new Map(agents.map((a) => [a.id, a]));
  } catch (error) {
    // File doesn't exist yet, start with empty
    agentsCache = new Map();
  }

  try {
    const tradesData = await fs.readFile(TRADES_FILE, "utf-8");
    tradesCache = JSON.parse(tradesData);
  } catch (error) {
    // File doesn't exist yet, start with empty
    tradesCache = [];
  }

  initialized = true;
}

async function saveAgents() {
  await ensureDataDir();
  const agents = Array.from(agentsCache.values());
  await fs.writeFile(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

async function saveTrades() {
  await ensureDataDir();
  await fs.writeFile(TRADES_FILE, JSON.stringify(tradesCache, null, 2));
}

export async function registerAgent(name: string, strategy: string): Promise<Agent> {
  await loadData();

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
  await saveAgents();

  return agent;
}

export async function getAgent(agentId: string): Promise<Agent | null> {
  await loadData();
  return agentsCache.get(agentId) || null;
}

export async function getAllAgents(): Promise<Agent[]> {
  await loadData();
  return Array.from(agentsCache.values());
}

export async function getAgentTrades(agentId: string): Promise<PaperTrade[]> {
  await loadData();
  return tradesCache.filter((t) => t.agentId === agentId);
}

export async function getAllTrades(): Promise<PaperTrade[]> {
  await loadData();
  return [...tradesCache].sort((a, b) => b.timestamp - a.timestamp);
}

export async function executeTrade(
  agentId: string,
  marketTicker: string,
  side: "YES" | "NO",
  quantity: number,
  reasoning?: string
): Promise<{ success: boolean; trade?: PaperTrade; error?: string }> {
  await loadData();

  const agent = agentsCache.get(agentId);
  if (!agent) {
    return { success: false, error: "Agent not found" };
  }

  // Fetch current market price from DFlow
  const market = await getMarket(marketTicker);
  if (!market) {
    return { success: false, error: "Market not found" };
  }

  // Use ask price for buying (worst case)
  const price = side === "YES" ? market.yesAsk : market.noAsk;
  const totalCost = quantity * price;

  if (totalCost > agent.balance) {
    return { success: false, error: "Insufficient balance" };
  }

  // Create trade
  const trade: PaperTrade = {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agentId,
    marketTicker,
    marketTitle: market.title,
    side,
    quantity,
    price,
    totalCost,
    timestamp: Date.now(),
    reasoning,
  };

  // Update agent balance
  agent.balance -= totalCost;
  agent.updatedAt = Date.now();

  // Save
  tradesCache.push(trade);
  agentsCache.set(agentId, agent);

  await Promise.all([saveAgents(), saveTrades()]);

  return { success: true, trade };
}

export async function calculatePositions(agentId: string): Promise<Position[]> {
  await loadData();

  const trades = tradesCache.filter((t) => t.agentId === agentId);
  const positionMap = new Map<string, { trades: PaperTrade[] }>();

  // Group trades by market and side
  for (const trade of trades) {
    const key = `${trade.marketTicker}-${trade.side}`;
    if (!positionMap.has(key)) {
      positionMap.set(key, { trades: [] });
    }
    positionMap.get(key)!.trades.push(trade);
  }

  const positions: Position[] = [];

  for (const [key, { trades: positionTrades }] of positionMap.entries()) {
    const [marketTicker, side] = key.split("-") as [string, "YES" | "NO"];
    
    const totalQuantity = positionTrades.reduce((sum, t) => sum + t.quantity, 0);
    const totalCost = positionTrades.reduce((sum, t) => sum + t.totalCost, 0);
    const avgPrice = totalCost / totalQuantity;

    // Fetch current price
    const market = await getMarket(marketTicker);
    const currentPrice = market
      ? side === "YES"
        ? (market.yesBid + market.yesAsk) / 2
        : (market.noBid + market.noAsk) / 2
      : avgPrice;

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
  await loadData();

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
  await loadData();

  const agents = Array.from(agentsCache.values());
  const portfolios: Portfolio[] = [];

  for (const agent of agents) {
    const portfolio = await calculatePortfolio(agent.id);
    if (portfolio) {
      portfolios.push(portfolio);
    }
  }

  // Sort by PnL percentage
  portfolios.sort((a, b) => b.totalPnLPercent - a.totalPnLPercent);

  // Add ranks
  portfolios.forEach((p, i) => {
    p.rank = i + 1;
  });

  return portfolios;
}

// Seed some initial demo agents if none exist
export async function seedDemoAgents() {
  await loadData();

  if (agentsCache.size > 0) return; // Already have agents

  const demoAgents = [
    {
      name: "Oracle Prime",
      strategy: "Multi-timeframe technical analysis with on-chain metrics correlation",
    },
    {
      name: "Sigma Mind",
      strategy: "Natural language processing of Fed communications and economic indicators",
    },
    {
      name: "Quantum Edge",
      strategy: "High-frequency pattern recognition across crypto market microstructure",
    },
  ];

  for (const demo of demoAgents) {
    await registerAgent(demo.name, demo.strategy);
  }
}
