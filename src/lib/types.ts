// DFlow API Response Types
export interface DFlowMarket {
  ticker: string;
  eventTicker: string;
  title: string;
  yesSubTitle?: string;
  noSubTitle?: string;
  status: string;
  volume: number;
  openInterest: number;
  yesBid: number;
  yesAsk: number;
  noBid: number;
  noAsk: number;
  accounts: {
    yesMint: string;
    noMint: string;
    marketLedger: string;
    isInitialized: boolean;
  };
}

export interface DFlowEvent {
  ticker: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  volume: number;
  volume24h: number;
  liquidity: number;
  openInterest: number;
  markets?: DFlowMarket[];
}

export interface DFlowOrderbook {
  ticker: string;
  yes_bids: Record<string, number>;
  no_bids: Record<string, number>;
  yes_asks: Record<string, number>;
  no_asks: Record<string, number>;
}

export interface DFlowTrade {
  ticker: string;
  side: "YES" | "NO";
  price: number;
  size: number;
  timestamp: number;
  txHash?: string;
}

export interface DFlowCandlestick {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Paper Trading Types
export interface Agent {
  id: string;
  name: string;
  strategy: string;
  balance: number;
  initialBalance: number;
  createdAt: number;
  updatedAt: number;
}

export interface Position {
  marketTicker: string;
  marketTitle: string;
  side: "YES" | "NO";
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
}

export interface PaperTrade {
  id: string;
  agentId: string;
  marketTicker: string;
  marketTitle: string;
  side: "YES" | "NO";
  quantity: number;
  price: number;
  totalCost: number;
  timestamp: number;
  reasoning?: string;
}

export interface Portfolio {
  agent: Agent;
  positions: Position[];
  trades: PaperTrade[];
  totalPnL: number;
  totalPnLPercent: number;
  rank?: number;
}

// Frontend Display Types
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

export interface AgentDisplay {
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

export interface TradeDisplay {
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
