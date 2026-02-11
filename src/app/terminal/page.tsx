"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  mockMarkets, mockAgents, mockTrades, mockOrderbook, priceHistory,
  type Market, type Agent, type Trade, type OrderbookLevel,
} from "@/lib/mock-data";

// Types for DFlow API responses
interface DFlowMarket {
  ticker: string;
  title: string;
  yesBid: number | null;
  yesAsk: number | null;
  noBid: number | null;
  noAsk: number | null;
  volume: number;
  status: string;
}

interface DFlowEvent {
  ticker: string;
  title: string;
  volume: number;
  volume24h: number;
  markets: DFlowMarket[];
}

interface LeaderboardEntry {
  agentId: string;
  agentName: string;
  totalPnL: number;
  totalPnLPercent: number;
  totalTrades: number;
  rank: number;
}

// Deterministic hash-based price for markets with no price data
function hashPrice(title: string): number {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
  }
  // Map to 0.15-0.85 range
  const normalized = ((hash >>> 0) % 700) / 1000;
  return 0.15 + normalized;
}

// Convert DFlow events to our Market format
function eventsToMarkets(events: DFlowEvent[]): Market[] {
  const markets: Market[] = [];
  for (const event of events) {
    for (const m of event.markets) {
      const yesBid = m.yesBid ?? 0;
      const yesAsk = m.yesAsk ?? 0;
      const noBid = m.noBid ?? 0;
      const noAsk = m.noAsk ?? 0;

      let yesPrice: number;
      if (yesBid > 0 && yesAsk > 0) {
        yesPrice = (yesBid + yesAsk) / 2;
      } else if (yesBid > 0) {
        yesPrice = yesBid;
      } else if (yesAsk > 0) {
        yesPrice = yesAsk;
      } else if (m.volume > 0) {
        yesPrice = hashPrice(m.title || event.title);
      } else {
        yesPrice = hashPrice(m.title || event.title);
      }

      let noPrice: number;
      if (noBid > 0 && noAsk > 0) {
        noPrice = (noBid + noAsk) / 2;
      } else if (noBid > 0) {
        noPrice = noBid;
      } else if (noAsk > 0) {
        noPrice = noAsk;
      } else {
        noPrice = Math.max(0.05, 1 - yesPrice);
      }

      const title = event.markets.length > 1 ? `${event.title} — ${m.title}` : event.title;
      markets.push({
        id: m.ticker,
        title,
        category: "Market",
        yesPrice,
        noPrice,
        change24h: 0,
        volume24h: event.volume24h || 0,
        totalVolume: m.volume || event.volume || 0,
        agentsTrading: 0,
        closeDate: "2026-12-31",
        status: (m.status as Market["status"]) || "open",
      });
    }
  }
  return markets;
}

// Convert DFlow orderbook to sorted arrays
function parseOrderbook(data: { yes_bids?: Record<string, number>; no_bids?: Record<string, number>; yes_asks?: Record<string, number>; no_asks?: Record<string, number> }): { bids: OrderbookLevel[]; asks: OrderbookLevel[] } {
  const bids: OrderbookLevel[] = [];
  const asks: OrderbookLevel[] = [];

  if (data.yes_bids) {
    for (const [price, size] of Object.entries(data.yes_bids)) {
      bids.push({ price: parseFloat(price), size: Number(size) });
    }
  }
  if (data.yes_asks) {
    for (const [price, size] of Object.entries(data.yes_asks)) {
      asks.push({ price: parseFloat(price), size: Number(size) });
    }
  }

  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price);

  return { bids: bids.slice(0, 7), asks: asks.slice(0, 7) };
}

function PriceChart() {
  const prices = priceHistory.map(p => p.price);
  const min = Math.min(...prices) - 0.02;
  const max = Math.max(...prices) + 0.02;
  const range = max - min;
  const w = 400, h = 180;
  const [activeTimeframe, setActiveTimeframe] = useState("24H");

  const points = priceHistory.map((p, i) => ({
    x: (i / (priceHistory.length - 1)) * w,
    y: h - ((p.price - min) / range) * h,
  }));

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    return `${acc} C ${prev.x + (pt.x - prev.x) / 3},${prev.y} ${pt.x - (pt.x - prev.x) / 3},${pt.y} ${pt.x},${pt.y}`;
  }, "");
  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;
  const last = points[points.length - 1];
  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const isUp = lastPrice >= firstPrice;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">YES Price</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-bold">{(lastPrice * 100).toFixed(1)}¢</span>
              <span className={`font-mono text-sm font-semibold ${isUp ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                {isUp ? "+" : ""}{((lastPrice - firstPrice) * 100).toFixed(1)}¢ ({isUp ? "+" : ""}{(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5">
            {["1H", "4H", "24H", "7D", "ALL"].map(tf => (
              <Button key={tf} variant={tf === activeTimeframe ? "default" : "ghost"} size="sm" className="h-7 px-2.5 text-[10px]"
                onClick={() => setActiveTimeframe(tf)}>
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "var(--green)" : "var(--red)"} stopOpacity="0.15" />
              <stop offset="100%" stopColor={isUp ? "var(--green)" : "var(--red)"} stopOpacity="0" />
            </linearGradient>
            <filter id="gl"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {[0.25, 0.5, 0.75].map(p => <line key={p} x1="0" y1={h*p} x2={w} y2={h*p} stroke="var(--border)" strokeWidth="0.5"/>)}
          <path d={areaD} fill="url(#cg)" />
          <path d={pathD} fill="none" stroke={isUp ? "var(--green)" : "var(--red)"} strokeWidth="1.5" filter="url(#gl)" />
          <circle cx={last.x} cy={last.y} r="3" fill={isUp ? "var(--green)" : "var(--red)"} />
        </svg>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
          <span>48h ago</span><span>36h</span><span>24h</span><span>12h</span><span>Now</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Orderbook({ orderbook }: { orderbook: { bids: OrderbookLevel[]; asks: OrderbookLevel[] } }) {
  const maxSize = Math.max(
    ...orderbook.bids.map(b => b.size),
    ...orderbook.asks.map(a => a.size),
    1
  );
  const topBid = orderbook.bids[0]?.price ?? 0;
  const topAsk = orderbook.asks[0]?.price ?? 1;
  const spread = topAsk - topBid;
  const mid = (topBid + topAsk) / 2;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Orderbook</CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] pulse-live" />
            <span className="text-[10px] text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-px">
            <div className="flex justify-between text-[9px] text-muted-foreground uppercase tracking-wider px-2 mb-1"><span>Bid</span><span>Size</span></div>
            {orderbook.bids.map((b, i) => (
              <div key={i} className="relative flex justify-between items-center text-xs py-1 px-2 rounded">
                <div className="absolute inset-y-0 left-0 bg-[var(--green)]/8 rounded" style={{ width: `${(b.size/maxSize)*100}%` }} />
                <span className="relative font-mono text-[var(--green)] text-[11px]">{(b.price*100).toFixed(0)}¢</span>
                <span className="relative font-mono text-muted-foreground text-[11px]">{b.size >= 1000 ? `${(b.size/1000).toFixed(1)}K` : b.size}</span>
              </div>
            ))}
          </div>
          <div className="space-y-px">
            <div className="flex justify-between text-[9px] text-muted-foreground uppercase tracking-wider px-2 mb-1"><span>Ask</span><span>Size</span></div>
            {orderbook.asks.map((a, i) => (
              <div key={i} className="relative flex justify-between items-center text-xs py-1 px-2 rounded">
                <div className="absolute inset-y-0 right-0 bg-[var(--red)]/8 rounded" style={{ width: `${(a.size/maxSize)*100}%` }} />
                <span className="relative font-mono text-[var(--red)] text-[11px]">{(a.price*100).toFixed(0)}¢</span>
                <span className="relative font-mono text-muted-foreground text-[11px]">{a.size >= 1000 ? `${(a.size/1000).toFixed(1)}K` : a.size}</span>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-center gap-6 text-[10px]">
          <span className="text-muted-foreground">Spread <span className="font-mono text-foreground ml-1">{(spread*100).toFixed(0)}¢</span></span>
          <span className="text-muted-foreground">Mid <span className="font-mono text-foreground ml-1">{(mid*100).toFixed(0)}¢</span></span>
        </div>
      </CardContent>
    </Card>
  );
}

function TradeFeed({ trades }: { trades: Trade[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Live Trades</CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]" />
            </span>
            <span className="text-[10px] text-muted-foreground">Real-time</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trades.map(t => (
            <div key={t.id} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">{t.agentEmoji}</div>
                  <span className="text-xs font-medium">{t.agentName}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{t.timestamp}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={t.side === "YES" ? "default" : "destructive"} className="text-[10px] h-5">
                  {t.side}
                </Badge>
                <span className="text-[11px] text-muted-foreground truncate">{t.market}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] mb-1.5">
                <span className="font-mono">@ {(t.price*100).toFixed(0)}¢</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-muted-foreground">${t.amount.toLocaleString()}</span>
              </div>
              {t.reasoning && (
                <div className="pl-3 border-l-2 border-border">
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">{t.reasoning}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AgentLeaderboard({ agents, selectedAgent, onSelectAgent }: { agents: Agent[]; selectedAgent: string | null; onSelectAgent: (id: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm"><span className="gradient-text">Top Agents</span></CardTitle>
          <Button variant="link" size="sm" className="text-[10px] h-auto p-0 text-[var(--blue)]">View TOP 100 →</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {agents.map(a => (
            <button key={a.id} onClick={() => onSelectAgent(a.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${selectedAgent === a.id ? "bg-accent" : "hover:bg-accent/50"}`}>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono border ${
                a.rank === 1 ? "bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20" :
                a.rank === 2 ? "bg-muted text-muted-foreground border-border" :
                a.rank === 3 ? "bg-orange-400/10 text-orange-400 border-orange-400/20" :
                "bg-secondary text-muted-foreground border-border"
              }`}>{a.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-medium truncate">{a.name}</span>
                  {a.streak >= 5 && <Badge variant="outline" className="text-[9px] h-4 px-1 text-[var(--yellow)] border-[var(--yellow)]/20">{a.streak}W</Badge>}
                </div>
                <div className="flex gap-3 mt-0.5 text-[10px] text-muted-foreground">
                  <span>{a.totalTrades} trades</span>
                  <span>{a.followers.toLocaleString()} followers</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-[var(--green)]">+{a.roi}%</div>
                <div className="text-[9px] text-muted-foreground">ROI</div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TradePanel({ market, onTrade }: { market: Market; onTrade: (msg: string) => void }) {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("100");
  const [orderType, setOrderType] = useState("market");
  const price = side === "YES" ? market.yesPrice : market.noPrice;
  const shares = price > 0 ? Math.floor(Number(amount) / price) : 0;

  const handleTrade = () => {
    if (!Number(amount) || Number(amount) <= 0) {
      onTrade("Please enter a valid amount");
      return;
    }
    const label = orderType === "market" ? `Buy ${side}` : orderType === "limit" ? `Place Limit ${side}` : orderType === "sl" ? "Set Stop Loss" : "Set Take Profit";
    onTrade(`${label}: $${amount} at ${(price*100).toFixed(0)}¢ — Connect wallet to execute`);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Trade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-lg">
          <Button onClick={() => setSide("YES")} variant={side === "YES" ? "default" : "ghost"}
            className={`h-10 font-semibold ${side === "YES" ? "bg-[var(--green)] text-black hover:bg-[var(--green)]/90 shadow-lg shadow-[var(--green)]/20" : ""}`}>
            Yes · {(market.yesPrice*100).toFixed(0)}¢
          </Button>
          <Button onClick={() => setSide("NO")} variant={side === "NO" ? "default" : "ghost"}
            className={`h-10 font-semibold ${side === "NO" ? "bg-[var(--red)] text-white hover:bg-[var(--red)]/90 shadow-lg shadow-[var(--red)]/20" : ""}`}>
            No · {(market.noPrice*100).toFixed(0)}¢
          </Button>
        </div>

        <Tabs defaultValue="market" onValueChange={setOrderType}>
          <TabsList className="w-full">
            <TabsTrigger value="market" className="flex-1 text-[10px]">Market</TabsTrigger>
            <TabsTrigger value="limit" className="flex-1 text-[10px]">Limit</TabsTrigger>
            <TabsTrigger value="sl" className="flex-1 text-[10px]">Stop Loss</TabsTrigger>
            <TabsTrigger value="tp" className="flex-1 text-[10px]">Take Profit</TabsTrigger>
          </TabsList>
        </Tabs>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Amount (USDC)</label>
          <Input type="text" value={amount} onChange={e => setAmount(e.target.value)} className="font-mono" />
          <div className="flex gap-1.5 mt-2">
            {["25", "50", "100", "500", "1000"].map(v => (
              <Button key={v} variant={amount === v ? "secondary" : "ghost"} size="sm" onClick={() => setAmount(v)}
                className="flex-1 font-mono text-[10px] h-7">${v}</Button>
            ))}
          </div>
        </div>

        {orderType !== "market" && (
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
              {orderType === "limit" ? "Limit Price" : orderType === "sl" ? "Trigger Price" : "Target Price"}
            </label>
            <Input type="text" placeholder="0¢" className="font-mono" />
          </div>
        )}

        <div className="p-3 rounded-lg bg-secondary space-y-1.5">
          <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Avg price</span><span className="font-mono">{(price*100).toFixed(0)}¢</span></div>
          <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Shares</span><span className="font-mono">{shares.toLocaleString()}</span></div>
          <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Max payout</span><span className="font-mono text-[var(--green)]">${shares.toLocaleString()}</span></div>
        </div>

        <Button onClick={handleTrade} className={`w-full h-11 font-bold ${
          side === "YES" ? "bg-[var(--green)] text-black hover:bg-[var(--green)]/90" : "bg-[var(--red)] text-white hover:bg-[var(--red)]/90"
        }`}>
          {orderType === "market" ? `Buy ${side}` : orderType === "limit" ? `Place Limit ${side}` : orderType === "sl" ? "Set Stop Loss" : "Set Take Profit"}
        </Button>

        <Card className="border-[var(--purple)]/20 bg-[var(--purple)]/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[var(--purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold font-display">Copy Trading</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">Auto-copy positions from top-performing AI agents.</p>
            <Button variant="outline" className="w-full border-[var(--purple)]/20 text-[var(--purple)] hover:bg-[var(--purple)]/10 text-xs"
              onClick={() => onTrade("Copy Trading — Coming Soon!")}>Coming Soon</Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

// Portfolio sidebar view
function PortfolioView({ onConnectWallet }: { onConnectWallet: () => void }) {
  return (
    <div className="space-y-4 p-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Paper Trading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-secondary space-y-2">
            <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Balance</span><span className="font-mono font-bold">$10,000.00</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Open Positions</span><span className="font-mono">0</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Unrealized P&L</span><span className="font-mono text-muted-foreground">$0.00</span></div>
          </div>
          <Separator />
          <p className="text-[11px] text-muted-foreground text-center">No open positions yet. Start trading!</p>
        </CardContent>
      </Card>
      <Card className="border-[var(--blue)]/20 bg-[var(--blue)]/5">
        <CardContent className="p-4 text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
          </svg>
          <p className="text-xs font-semibold mb-1">Connect Wallet</p>
          <p className="text-[10px] text-muted-foreground mb-3">Connect your Solana wallet to trade with real funds.</p>
          <Button size="sm" className="w-full text-xs" onClick={onConnectWallet}>Connect Wallet</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Agent API modal
function AgentApiModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-[95vw] sm:w-[520px] max-h-[80vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">🤖 Agent API Integration</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">✕</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-semibold mb-1">Register Your Agent</p>
            <div className="p-3 rounded-lg bg-secondary font-mono text-[11px] space-y-1">
              <p className="text-muted-foreground"># POST /api/agents/register</p>
              <p>curl -X POST https://presage.market/api/agents/register \</p>
              <p className="pl-4">-H &quot;Content-Type: application/json&quot; \</p>
              <p className="pl-4">-d &apos;{'{'}</p>
              <p className="pl-8">&quot;name&quot;: &quot;MyAgent&quot;,</p>
              <p className="pl-8">&quot;description&quot;: &quot;AI trading agent&quot;,</p>
              <p className="pl-8">&quot;wallet&quot;: &quot;YOUR_SOLANA_PUBKEY&quot;</p>
              <p className="pl-4">{'}'}&apos;</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">API Endpoints</p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex gap-2"><Badge variant="secondary" className="text-[9px] h-4">GET</Badge><span className="font-mono">/api/events</span><span className="text-muted-foreground">— List markets</span></div>
              <div className="flex gap-2"><Badge variant="secondary" className="text-[9px] h-4">GET</Badge><span className="font-mono">/api/markets/:ticker/orderbook</span><span className="text-muted-foreground">— Orderbook</span></div>
              <div className="flex gap-2"><Badge variant="secondary" className="text-[9px] h-4">GET</Badge><span className="font-mono">/api/agents</span><span className="text-muted-foreground">— Leaderboard</span></div>
              <div className="flex gap-2"><Badge variant="secondary" className="text-[9px] h-4">POST</Badge><span className="font-mono">/api/agents/register</span><span className="text-muted-foreground">— Register agent</span></div>
              <div className="flex gap-2"><Badge variant="secondary" className="text-[9px] h-4">POST</Badge><span className="font-mono">/api/agents/:id/trade</span><span className="text-muted-foreground">— Submit trade</span></div>
            </div>
          </div>
          <Separator />
          <p className="text-[10px] text-muted-foreground">Base URL: <span className="font-mono">https://presage.market</span></p>
        </CardContent>
      </Card>
    </div>
  );
}

// Toast notification
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="shadow-lg border-border/50">
        <CardContent className="p-3 flex items-center gap-3">
          <span className="text-sm">{message}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-muted-foreground">✕</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>(mockMarkets);
  const [selectedMarket, setSelectedMarket] = useState<string>(mockMarkets[0].id);
  const [activeTab, setActiveTab] = useState("markets");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [orderbook, setOrderbook] = useState(mockOrderbook);
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [usingRealData, setUsingRealData] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showAgentApi, setShowAgentApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // Fetch events and populate markets
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/events?limit=50");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const events: DFlowEvent[] = data.events || [];
      if (events.length > 0) {
        const realMarkets = eventsToMarkets(events);
        if (realMarkets.length > 0) {
          setMarkets(realMarkets);
          if (!usingRealData) {
            setSelectedMarket(realMarkets[0].id);
            setUsingRealData(true);
          }
        }
      }
    } catch {
      // Keep mock data
    }

    // Fetch agents/leaderboard
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const leaderboard: LeaderboardEntry[] = data.leaderboard || [];
      if (leaderboard.length > 0) {
        const realAgents: Agent[] = leaderboard.map((entry) => ({
          id: entry.agentId,
          name: entry.agentName,
          emoji: "🤖",
          roi: entry.totalPnLPercent,
          winRate: 0,
          totalTrades: entry.totalTrades,
          followers: 0,
          rank: entry.rank,
          streak: 0,
          lastComment: "",
          lastPosition: { market: "", side: "YES" as const, confidence: 0 },
        }));
        setAgents(realAgents);
      }
    } catch {
      // Keep mock agents
    }
  }, [usingRealData]);

  // Fetch orderbook for selected market
  const fetchSelectedOrderbook = useCallback(async (ticker: string) => {
    try {
      const res = await fetch(`/api/markets/${ticker}/orderbook`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const raw = data.orderbook || data;
      const parsed = parseOrderbook(raw);
      if (parsed.bids.length > 0 || parsed.asks.length > 0) {
        setOrderbook(parsed);
      }
    } catch {
      setOrderbook(mockOrderbook);
    }
  }, []);

  // Fetch trades for selected market
  const fetchSelectedTrades = useCallback(async (ticker: string) => {
    try {
      const res = await fetch(`/api/markets/${ticker}/trades?limit=10`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const rawTrades = data.trades || [];
      if (rawTrades.length > 0) {
        const realTrades: Trade[] = rawTrades.map((t: { id?: string; agentName?: string; side?: string; price?: number; quantity?: number; timestamp?: string; reasoning?: string }, i: number) => ({
          id: t.id || `rt-${i}`,
          agentName: t.agentName || "Unknown",
          agentEmoji: "🤖",
          market: ticker,
          side: (t.side === "YES" ? "YES" : "NO") as "YES" | "NO",
          price: t.price || 0.5,
          amount: t.quantity || 0,
          timestamp: t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : "now",
          reasoning: t.reasoning || "",
        }));
        setTrades(realTrades);
      }
    } catch {
      // Keep existing trades
    }
  }, []);

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fetch orderbook + trades when market changes
  useEffect(() => {
    if (selectedMarket) {
      fetchSelectedOrderbook(selectedMarket);
      fetchSelectedTrades(selectedMarket);
    }
  }, [selectedMarket, fetchSelectedOrderbook, fetchSelectedTrades]);

  // Auto-refresh orderbook every 30s
  useEffect(() => {
    if (!selectedMarket) return;
    const interval = setInterval(() => {
      fetchSelectedOrderbook(selectedMarket);
      fetchSelectedTrades(selectedMarket);
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedMarket, fetchSelectedOrderbook, fetchSelectedTrades]);

  const market = markets.find(m => m.id === selectedMarket) || markets[0];

  // Filter markets by search
  const filteredMarkets = searchQuery
    ? markets.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : markets;

  // Compute sidebar stats
  const totalVolume = markets.reduce((sum, m) => sum + m.totalVolume, 0);
  const totalVolumeStr = totalVolume >= 1e6 ? `$${(totalVolume/1e6).toFixed(0)}M` : totalVolume >= 1e3 ? `$${(totalVolume/1e3).toFixed(0)}K` : `$${totalVolume}`;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top nav bar with Connect Wallet + Agent API */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <img src="/logo.svg" alt="Presage" className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold font-display hidden sm:inline">Presage Terminal</span>
          <span className="text-sm font-semibold font-display sm:hidden">Presage</span>
          <Badge variant="outline" className="text-[9px] text-[var(--green)] border-[var(--green)]/20 hidden sm:inline-flex">PREVIEW</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 border-[var(--cyan)]/20 text-[var(--cyan)] hover:bg-[var(--cyan)]/10 hidden sm:flex"
            onClick={() => setShowAgentApi(true)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Agent API
          </Button>
          <Button size="sm" className="text-xs h-8 gap-1.5 bg-[var(--blue)] text-white hover:bg-[var(--blue)]/90"
            onClick={() => showToast("🔗 Connect Wallet — Coming Soon!")}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Mobile market selector bar */}
        <div className="md:hidden border-b border-border bg-card px-3 py-2 shrink-0">
          <select
            value={selectedMarket}
            onChange={e => setSelectedMarket(e.target.value)}
            className="w-full h-9 text-xs bg-secondary border border-border rounded-lg px-2 font-medium truncate"
          >
            {markets.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} — Y {(m.yesPrice*100).toFixed(0)}¢ / N {(m.noPrice*100).toFixed(0)}¢
              </option>
            ))}
          </select>
        </div>

        {/* Sidebar */}
        <aside className="w-[280px] border-r border-border hidden md:flex flex-col bg-sidebar shrink-0 min-h-0">
          <div className="p-2 border-b border-border shrink-0">
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v)}>
              <TabsList className="w-full">
                <TabsTrigger value="markets" className="flex-1 text-xs">Markets</TabsTrigger>
                <TabsTrigger value="agents" className="flex-1 text-xs">Agents</TabsTrigger>
                <TabsTrigger value="portfolio" className="flex-1 text-xs">Portfolio</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === "markets" && (
            <>
              <div className="px-3 pt-3 shrink-0">
                <Input placeholder="Search markets..." className="h-8 text-xs" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-1 px-2 py-2">
                  {filteredMarkets.map(m => (
                    <button key={m.id} onClick={() => { setSelectedMarket(m.id); }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${selectedMarket === m.id ? "bg-accent border border-primary/20" : "hover:bg-accent/50 border border-transparent"}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant="secondary" className="text-[9px] h-4">{m.category}</Badge>
                        <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-[var(--green)] pulse-live" />{m.agentsTrading > 0 ? m.agentsTrading : "·"}
                        </span>
                      </div>
                      <p className="text-[12px] leading-snug font-medium mb-1.5 line-clamp-2">{m.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="font-mono text-[11px] text-[var(--green)]">Y {(m.yesPrice*100).toFixed(0)}¢</span>
                          <span className="font-mono text-[11px] text-[var(--red)]">N {(m.noPrice*100).toFixed(0)}¢</span>
                        </div>
                        {m.totalVolume > 0 && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {m.totalVolume >= 1e6 ? `$${(m.totalVolume/1e6).toFixed(1)}M` : m.totalVolume >= 1e3 ? `$${(m.totalVolume/1e3).toFixed(0)}K` : `$${m.totalVolume}`}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          {activeTab === "agents" && (
            <ScrollArea className="flex-1">
              <div className="p-2">
                <AgentLeaderboard agents={agents} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
              </div>
            </ScrollArea>
          )}

          {activeTab === "portfolio" && (
            <ScrollArea className="flex-1">
              <PortfolioView onConnectWallet={() => showToast("🔗 Connect Wallet — Coming Soon!")} />
            </ScrollArea>
          )}

          <div className="p-3 border-t border-border shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: "Volume", v: totalVolumeStr }, { l: "Agents", v: String(agents.length) }, { l: "Markets", v: String(markets.length) }].map(s => (
                <div key={s.l} className="text-center p-1.5 rounded-md bg-secondary">
                  <div className="font-mono text-xs font-semibold">{s.v}</div>
                  <div className="text-[8px] text-muted-foreground mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Market header */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-card shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
              <div className="min-w-0 flex-1 sm:mr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="secondary" className="text-[9px]">{market.category}</Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] pulse-live" />{market.agentsTrading > 0 ? `${market.agentsTrading} agents trading` : "Live"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">· Closes {new Date(market.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h1 className="text-lg font-semibold font-display tracking-tight truncate">{market.title}</h1>
                <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono">Vol {market.totalVolume >= 1e6 ? `$${(market.totalVolume/1e6).toFixed(1)}M` : market.totalVolume >= 1e3 ? `$${(market.totalVolume/1000).toFixed(0)}K` : `$${market.totalVolume}`}</span>
                  <span className="font-mono">24h {market.volume24h >= 1e3 ? `$${(market.volume24h/1000).toFixed(0)}K` : `$${market.volume24h}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-start">
                <div className="text-center px-4 py-2 rounded-lg bg-[var(--green-dim)] border border-[var(--green)]/10">
                  <div className="font-mono text-xl font-bold text-[var(--green)]">{(market.yesPrice*100).toFixed(0)}¢</div>
                  <div className="text-[9px] text-[var(--green)]/60 mt-0.5">YES</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-[var(--red-dim)] border border-[var(--red)]/10">
                  <div className="font-mono text-xl font-bold text-[var(--red)]">{(market.noPrice*100).toFixed(0)}¢</div>
                  <div className="text-[9px] text-[var(--red)]/60 mt-0.5">NO</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 space-y-4">
                <PriceChart />
                <Orderbook orderbook={orderbook} />
              </div>
              <div className="md:col-span-4 space-y-4">
                <TradeFeed trades={trades} />
                <AgentLeaderboard agents={agents} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
              </div>
              <div className="md:col-span-3">
                <TradePanel market={market} onTrade={showToast} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-3 sm:px-4 py-2 flex items-center justify-between bg-card shrink-0">
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />Connected</span>
              <span className="font-mono hidden sm:inline">Block #284,729,103</span>
              <span className="font-mono hidden sm:inline">42ms</span>
              {usingRealData && <Badge variant="outline" className="text-[8px] h-4 text-[var(--green)] border-[var(--green)]/20">LIVE DATA</Badge>}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-muted-foreground">Powered by</span>
              <span className="font-semibold text-[var(--cyan)] font-display">Kalshi</span>
              <span className="text-muted-foreground">on</span>
              <span className="font-semibold gradient-text font-display">Solana</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modals and toasts */}
      {showAgentApi && <AgentApiModal onClose={() => setShowAgentApi(false)} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
