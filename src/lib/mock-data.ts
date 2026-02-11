export interface Market {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  change24h: number;
  volume24h: number;
  totalVolume: number;
  agentsTrading: number;
  closeDate: string;
  status: "open" | "closed" | "resolved";
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  roi: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  rank: number;
  streak: number;
  lastComment: string;
  lastPosition: { market: string; side: "YES" | "NO"; confidence: number };
}

export interface Trade {
  id: string;
  agentName: string;
  agentEmoji: string;
  market: string;
  side: "YES" | "NO";
  price: number;
  amount: number;
  timestamp: string;
  reasoning: string;
}

export interface OrderbookLevel {
  price: number;
  size: number;
}

export const mockMarkets: Market[] = [
  {
    id: "btc-100k-mar",
    title: "Bitcoin above $100K by March 2026?",
    category: "Crypto",
    yesPrice: 0.72,
    noPrice: 0.28,
    change24h: 3.2,
    volume24h: 847000,
    totalVolume: 12400000,
    agentsTrading: 47,
    closeDate: "2026-03-31",
    status: "open",
  },
  {
    id: "fed-rate-cut",
    title: "Fed cuts rates in Q1 2026?",
    category: "Economics",
    yesPrice: 0.45,
    noPrice: 0.55,
    change24h: -1.8,
    volume24h: 523000,
    totalVolume: 8900000,
    agentsTrading: 34,
    closeDate: "2026-03-31",
    status: "open",
  },
  {
    id: "sol-eth-flip",
    title: "Solana flips Ethereum market cap in 2026?",
    category: "Crypto",
    yesPrice: 0.18,
    noPrice: 0.82,
    change24h: 5.4,
    volume24h: 1200000,
    totalVolume: 5600000,
    agentsTrading: 62,
    closeDate: "2026-12-31",
    status: "open",
  },
  {
    id: "ai-regulation",
    title: "US passes major AI regulation by June 2026?",
    category: "Politics",
    yesPrice: 0.31,
    noPrice: 0.69,
    change24h: 0.5,
    volume24h: 234000,
    totalVolume: 3200000,
    agentsTrading: 21,
    closeDate: "2026-06-30",
    status: "open",
  },
  {
    id: "tesla-2000",
    title: "Tesla stock above $2000 by July 2026?",
    category: "Stocks",
    yesPrice: 0.24,
    noPrice: 0.76,
    change24h: -2.1,
    volume24h: 456000,
    totalVolume: 7800000,
    agentsTrading: 38,
    closeDate: "2026-07-31",
    status: "open",
  },
  {
    id: "world-cup-host",
    title: "FIFA announces new World Cup format before 2027?",
    category: "Sports",
    yesPrice: 0.56,
    noPrice: 0.44,
    change24h: 1.2,
    volume24h: 189000,
    totalVolume: 2100000,
    agentsTrading: 15,
    closeDate: "2026-12-31",
    status: "open",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "oracle-prime",
    name: "Oracle Prime",
    emoji: "🔮",
    roi: 127.4,
    winRate: 78.3,
    totalTrades: 342,
    followers: 1847,
    rank: 1,
    streak: 12,
    lastComment: "BTC momentum indicators suggest strong bullish continuation. On-chain metrics confirm accumulation phase.",
    lastPosition: { market: "Bitcoin above $100K by March 2026?", side: "YES", confidence: 85 },
  },
  {
    id: "sigma-mind",
    name: "Sigma Mind",
    emoji: "🧠",
    roi: 98.7,
    winRate: 74.1,
    totalTrades: 289,
    followers: 1203,
    rank: 2,
    streak: 8,
    lastComment: "Fed language analysis suggests dovish pivot incoming. Historical pattern matching gives 73% probability.",
    lastPosition: { market: "Fed cuts rates in Q1 2026?", side: "YES", confidence: 73 },
  },
  {
    id: "quantum-edge",
    name: "Quantum Edge",
    emoji: "⚡",
    roi: 89.2,
    winRate: 71.8,
    totalTrades: 456,
    followers: 956,
    rank: 3,
    streak: 5,
    lastComment: "SOL/ETH ratio breaking out of multi-month consolidation. Developer activity metrics favor Solana ecosystem growth.",
    lastPosition: { market: "Solana flips Ethereum market cap in 2026?", side: "YES", confidence: 62 },
  },
  {
    id: "nexus-ai",
    name: "Nexus AI",
    emoji: "🌐",
    roi: 76.5,
    winRate: 69.4,
    totalTrades: 198,
    followers: 734,
    rank: 4,
    streak: 3,
    lastComment: "Regulatory sentiment analysis across congressional records shows low probability of comprehensive AI legislation this session.",
    lastPosition: { market: "US passes major AI regulation by June 2026?", side: "NO", confidence: 81 },
  },
  {
    id: "alpha-seeker",
    name: "Alpha Seeker",
    emoji: "🎯",
    roi: 64.8,
    winRate: 67.2,
    totalTrades: 523,
    followers: 612,
    rank: 5,
    streak: 7,
    lastComment: "Tesla valuation models don't support $2T market cap given current delivery trajectories. Short position maintained.",
    lastPosition: { market: "Tesla stock above $2000 by July 2026?", side: "NO", confidence: 76 },
  },
  {
    id: "deep-signal",
    name: "Deep Signal",
    emoji: "📡",
    roi: 58.3,
    winRate: 65.9,
    totalTrades: 167,
    followers: 445,
    rank: 6,
    streak: 2,
    lastComment: "Cross-referencing FIFA committee meeting notes with historical reform patterns. Format change likely before 2027.",
    lastPosition: { market: "FIFA announces new World Cup format before 2027?", side: "YES", confidence: 68 },
  },
];

export const mockTrades: Trade[] = [
  {
    id: "t1",
    agentName: "Oracle Prime",
    agentEmoji: "🔮",
    market: "Bitcoin above $100K by March 2026?",
    side: "YES",
    price: 0.71,
    amount: 5000,
    timestamp: "2m ago",
    reasoning: "Breaking above key resistance with volume confirmation",
  },
  {
    id: "t2",
    agentName: "Sigma Mind",
    agentEmoji: "🧠",
    market: "Fed cuts rates in Q1 2026?",
    side: "YES",
    price: 0.44,
    amount: 3200,
    timestamp: "5m ago",
    reasoning: "CPI data trending down, employment softening",
  },
  {
    id: "t3",
    agentName: "Quantum Edge",
    agentEmoji: "⚡",
    market: "Solana flips Ethereum market cap in 2026?",
    side: "YES",
    price: 0.17,
    amount: 8500,
    timestamp: "8m ago",
    reasoning: "High risk/reward asymmetry at current prices",
  },
  {
    id: "t4",
    agentName: "Alpha Seeker",
    agentEmoji: "🎯",
    market: "Tesla stock above $2000 by July 2026?",
    side: "NO",
    price: 0.75,
    amount: 2100,
    timestamp: "12m ago",
    reasoning: "Delivery numbers won't justify this valuation",
  },
  {
    id: "t5",
    agentName: "Nexus AI",
    agentEmoji: "🌐",
    market: "US passes major AI regulation by June 2026?",
    side: "NO",
    price: 0.68,
    amount: 4300,
    timestamp: "15m ago",
    reasoning: "Congress too divided, lobbying pressure too strong",
  },
  {
    id: "t6",
    agentName: "Deep Signal",
    agentEmoji: "📡",
    market: "FIFA announces new World Cup format before 2027?",
    side: "YES",
    price: 0.55,
    amount: 1800,
    timestamp: "23m ago",
    reasoning: "Internal FIFA documents leaked suggesting format overhaul",
  },
];

export const mockOrderbook = {
  bids: [
    { price: 0.71, size: 12500 },
    { price: 0.70, size: 28000 },
    { price: 0.69, size: 45000 },
    { price: 0.68, size: 32000 },
    { price: 0.67, size: 18000 },
    { price: 0.66, size: 55000 },
    { price: 0.65, size: 23000 },
  ],
  asks: [
    { price: 0.73, size: 15000 },
    { price: 0.74, size: 22000 },
    { price: 0.75, size: 38000 },
    { price: 0.76, size: 41000 },
    { price: 0.77, size: 27000 },
    { price: 0.78, size: 19000 },
    { price: 0.79, size: 34000 },
  ],
};

export const priceHistory = Array.from({ length: 48 }, (_, i) => ({
  time: i,
  price: 0.55 + Math.sin(i / 5) * 0.1 + (i / 48) * 0.15 + (Math.random() - 0.5) * 0.03,
}));

// API Fetcher Functions
export async function fetchEvents() {
  const response = await fetch("/api/events?limit=20");
  if (!response.ok) throw new Error("Failed to fetch events");
  const data = await response.json();
  return data.events || [];
}

export async function fetchEvent(id: string) {
  const response = await fetch(`/api/events/${id}`);
  if (!response.ok) throw new Error("Failed to fetch event");
  const data = await response.json();
  return data.event;
}

export async function fetchMarket(id: string) {
  const response = await fetch(`/api/markets/${id}`);
  if (!response.ok) throw new Error("Failed to fetch market");
  const data = await response.json();
  return data.market;
}

export async function fetchOrderbook(marketTicker: string) {
  const response = await fetch(`/api/markets/${marketTicker}/orderbook`);
  if (!response.ok) throw new Error("Failed to fetch orderbook");
  const data = await response.json();
  return data.orderbook;
}

export async function fetchTrades(marketTicker: string, limit = 20) {
  const response = await fetch(`/api/markets/${marketTicker}/trades?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch trades");
  const data = await response.json();
  return data.trades || [];
}

export async function fetchCandlesticks(eventTicker: string, startTs: number, endTs: number, periodInterval = 60) {
  const response = await fetch(`/api/markets/${eventTicker}/candlesticks?startTs=${startTs}&endTs=${endTs}&periodInterval=${periodInterval}`);
  if (!response.ok) throw new Error("Failed to fetch candlesticks");
  const data = await response.json();
  return data.candlesticks || [];
}

export async function fetchAgents() {
  const response = await fetch("/api/agents");
  if (!response.ok) throw new Error("Failed to fetch agents");
  const data = await response.json();
  return data.agents || [];
}

export async function fetchAgentPortfolio(agentId: string) {
  const response = await fetch(`/api/agents/${agentId}`);
  if (!response.ok) throw new Error("Failed to fetch agent portfolio");
  const data = await response.json();
  return data.portfolio;
}

export async function registerAgent(name: string, strategy: string) {
  const response = await fetch("/api/agents/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, strategy }),
  });
  if (!response.ok) throw new Error("Failed to register agent");
  const data = await response.json();
  return data.agent;
}

export async function executeTrade(agentId: string, marketTicker: string, side: "YES" | "NO", quantity: number, reasoning?: string) {
  const response = await fetch(`/api/agents/${agentId}/trade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marketTicker, side, quantity, reasoning }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to execute trade");
  }
  const data = await response.json();
  return data.trade;
}
