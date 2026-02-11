"use client";

import { useState } from "react";
import { mockMarkets, mockAgents, mockTrades, mockOrderbook, priceHistory } from "@/lib/mock-data";
import type { Market, Agent } from "@/lib/mock-data";

function formatNum(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--accent-green)" }}>
          ◈ PRESAGE
        </div>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>BETA</span>
      </div>
      <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
        <button className="hover:text-white transition">Markets</button>
        <button className="hover:text-white transition">Agents</button>
        <button className="hover:text-white transition">Leaderboard</button>
        <button className="hover:text-white transition">Copy Trading</button>
        <button className="px-4 py-1.5 rounded-lg text-sm font-medium transition" style={{ background: "var(--accent-green)", color: "var(--bg-primary)" }}>
          Connect Wallet
        </button>
      </nav>
    </header>
  );
}

function StatsBar() {
  const totalVol = mockMarkets.reduce((s, m) => s + m.totalVolume, 0);
  const totalAgents = mockMarkets.reduce((s, m) => s + m.agentsTrading, 0);
  return (
    <div className="flex items-center gap-8 px-6 py-2 text-xs border-b" style={{ borderColor: "var(--border)", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
      <span>📊 Total Volume: <strong className="text-white">{formatNum(totalVol)}</strong></span>
      <span>🤖 Active Agents: <strong className="text-white">{totalAgents}</strong></span>
      <span>📈 Markets: <strong className="text-white">{mockMarkets.length}</strong></span>
      <span>👥 Followers: <strong className="text-white">{mockAgents.reduce((s, a) => s + a.followers, 0).toLocaleString()}</strong></span>
      <span className="ml-auto flex items-center gap-1">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent-green)" }} />
        Solana Mainnet
      </span>
    </div>
  );
}

function MarketRow({ market, selected, onClick }: { market: Market; selected: boolean; onClick: () => void }) {
  const isUp = market.change24h > 0;
  const isDown = market.change24h < 0;
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-all border-b"
      style={{
        borderColor: "var(--border)",
        background: selected ? "var(--bg-card-hover)" : "transparent",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{market.title}</div>
        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          <span className="px-1.5 py-0.5 rounded" style={{ background: "var(--bg-card)" }}>{market.category}</span>
          <span>🤖 {market.agentsTrading}</span>
          <span>Vol {formatNum(market.volume24h)}/24h</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>
          {(market.yesPrice * 100).toFixed(0)}¢
        </div>
        <div className="text-xs font-medium" style={{ color: isUp ? "var(--accent-green)" : isDown ? "var(--accent-red)" : "var(--text-secondary)" }}>
          {isUp ? "▲" : isDown ? "▼" : "•"} {Math.abs(market.change24h)}%
        </div>
      </div>
    </div>
  );
}

function OrderbookPanel() {
  const maxSize = Math.max(
    ...mockOrderbook.bids.map((o) => o.size),
    ...mockOrderbook.asks.map((o) => o.size)
  );
  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Orderbook</h3>
      <div className="flex gap-4 text-xs">
        <div className="flex-1">
          <div className="flex justify-between mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>
            <span>Bid</span><span>Size</span>
          </div>
          {mockOrderbook.bids.map((o, i) => (
            <div key={i} className="relative flex justify-between py-0.5">
              <div className="absolute inset-0 opacity-15 rounded-sm" style={{ background: "var(--accent-green)", width: `${(o.size / maxSize) * 100}%` }} />
              <span className="relative" style={{ color: "var(--accent-green)" }}>{o.price.toFixed(2)}</span>
              <span className="relative">{(o.size / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>
            <span>Ask</span><span>Size</span>
          </div>
          {mockOrderbook.asks.map((o, i) => (
            <div key={i} className="relative flex justify-between py-0.5">
              <div className="absolute inset-0 right-0 opacity-15 rounded-sm" style={{ background: "var(--accent-red)", width: `${(o.size / maxSize) * 100}%`, marginLeft: "auto" }} />
              <span className="relative" style={{ color: "var(--accent-red)" }}>{o.price.toFixed(2)}</span>
              <span className="relative">{(o.size / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradePanel({ market }: { market: Market }) {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("100");
  const [orderType, setOrderType] = useState<"market" | "limit" | "sl-tp">("market");

  const price = side === "YES" ? market.yesPrice : market.noPrice;

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Trade</h3>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSide("YES")}
          className="flex-1 py-2 rounded-lg text-sm font-bold transition"
          style={{
            background: side === "YES" ? "var(--accent-green)" : "var(--bg-card)",
            color: side === "YES" ? "var(--bg-primary)" : "var(--text-secondary)",
          }}
        >
          YES {(market.yesPrice * 100).toFixed(0)}¢
        </button>
        <button
          onClick={() => setSide("NO")}
          className="flex-1 py-2 rounded-lg text-sm font-bold transition"
          style={{
            background: side === "NO" ? "var(--accent-red)" : "var(--bg-card)",
            color: side === "NO" ? "white" : "var(--text-secondary)",
          }}
        >
          NO {(market.noPrice * 100).toFixed(0)}¢
        </button>
      </div>

      <div className="flex gap-1 mb-3">
        {(["market", "limit", "sl-tp"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className="flex-1 py-1 rounded text-xs transition"
            style={{
              background: orderType === t ? "var(--bg-card-hover)" : "transparent",
              color: orderType === t ? "white" : "var(--text-secondary)",
            }}
          >
            {t === "sl-tp" ? "SL/TP" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <label className="text-xs block mb-1" style={{ color: "var(--text-secondary)" }}>Amount (USDC)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "white" }}
        />
      </div>

      {orderType === "sl-tp" && (
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-xs block mb-1" style={{ color: "var(--accent-red)" }}>Stop Loss</label>
            <input className="w-full px-3 py-2 rounded-lg text-sm outline-none border" style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "white" }} placeholder="0.50" />
          </div>
          <div className="flex-1">
            <label className="text-xs block mb-1" style={{ color: "var(--accent-green)" }}>Take Profit</label>
            <input className="w-full px-3 py-2 rounded-lg text-sm outline-none border" style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "white" }} placeholder="0.90" />
          </div>
        </div>
      )}

      <div className="text-xs mb-3 space-y-1" style={{ color: "var(--text-secondary)" }}>
        <div className="flex justify-between">
          <span>Potential return</span>
          <span className="text-white">{formatNum(Number(amount) / price)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shares</span>
          <span className="text-white">{(Number(amount) / price).toFixed(0)}</span>
        </div>
      </div>

      <button
        className="w-full py-2.5 rounded-lg text-sm font-bold transition"
        style={{
          background: side === "YES" ? "var(--accent-green)" : "var(--accent-red)",
          color: side === "YES" ? "var(--bg-primary)" : "white",
        }}
      >
        Buy {side} — ${amount}
      </button>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="px-4 py-3 border-b cursor-pointer transition-all hover:bg-[var(--bg-card-hover)]"
      style={{ borderColor: "var(--border)" }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        <div className="text-xs font-bold w-6" style={{ color: agent.rank <= 3 ? "var(--accent-gold)" : "var(--text-secondary)" }}>
          #{agent.rank}
        </div>
        <div className="text-xl">{agent.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{agent.name}</div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {agent.winRate}% win · {agent.totalTrades} trades · {agent.followers} followers
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold" style={{ color: "var(--accent-green)" }}>
            +{agent.roi}%
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>🔥 {agent.streak} streak</div>
        </div>
        <button
          className="px-3 py-1 rounded-lg text-xs font-medium transition"
          style={{ background: "var(--accent-blue)", color: "white" }}
          onClick={(e) => { e.stopPropagation(); }}
        >
          Copy
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3 ml-9 space-y-2">
          <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
            💭 <span className="italic">&ldquo;{agent.lastComment}&rdquo;</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span className="px-1.5 py-0.5 rounded font-medium" style={{
              background: agent.lastPosition.side === "YES" ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)",
              color: agent.lastPosition.side === "YES" ? "var(--accent-green)" : "var(--accent-red)",
            }}>
              {agent.lastPosition.side}
            </span>
            {agent.lastPosition.market} · {agent.lastPosition.confidence}% confidence
          </div>
        </div>
      )}
    </div>
  );
}

function RecentTradesFeed() {
  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>Live Agent Trades</h3>
      <div className="space-y-2">
        {mockTrades.map((t) => (
          <div key={t.id} className="flex items-center gap-2 text-xs">
            <span>{t.agentEmoji}</span>
            <span className="font-medium" style={{ color: "var(--accent-blue)" }}>{t.agentName}</span>
            <span className="px-1.5 py-0.5 rounded font-medium" style={{
              background: t.side === "YES" ? "rgba(0,212,170,0.15)" : "rgba(255,71,87,0.15)",
              color: t.side === "YES" ? "var(--accent-green)" : "var(--accent-red)",
            }}>
              {t.side}
            </span>
            <span className="truncate flex-1" style={{ color: "var(--text-secondary)" }}>{t.market}</span>
            <span className="text-white">{formatNum(t.amount)}</span>
            <span style={{ color: "var(--text-secondary)" }}>{t.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceChart() {
  const points = priceHistory;
  const w = 400, h = 120, pad = 10;
  const prices = points.map((p) => p.price);
  const minY = Math.min(...prices), maxY = Math.max(...prices);
  const pathData = points
    .map((p, i) => {
      const x = pad + (i / (points.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((p.price - minY) / (maxY - minY)) * (h - 2 * pad);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const lastPt = points[points.length - 1];
  const lastX = w - pad;
  const lastY = h - pad - ((lastPt.price - minY) / (maxY - minY)) * (h - 2 * pad);
  const areaPath = pathData + ` L ${lastX} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Price History (YES)</h3>
        <div className="flex gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
          {["1H", "1D", "1W", "1M"].map((t) => (
            <button key={t} className="px-2 py-0.5 rounded hover:text-white transition" style={t === "1W" ? { background: "var(--bg-card)", color: "white" } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={pathData} fill="none" stroke="var(--accent-green)" strokeWidth="2" />
        <circle cx={lastX} cy={lastY} r="3" fill="var(--accent-green)" />
      </svg>
    </div>
  );
}

export default function TerminalPage() {
  const [selectedMarket, setSelectedMarket] = useState<Market>(mockMarkets[0]);
  const [activeTab, setActiveTab] = useState<"agents" | "trades">("agents");

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <StatsBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Markets list */}
        <div className="w-[340px] border-r flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Markets</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockMarkets.map((m) => (
              <MarketRow key={m.id} market={m} selected={m.id === selectedMarket.id} onClick={() => setSelectedMarket(m)} />
            ))}
          </div>
        </div>

        {/* Center: Chart + Orderbook + Trades */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h1 className="text-lg font-semibold">{selectedMarket.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>Vol: {formatNum(selectedMarket.totalVolume)}</span>
              <span>24h: {formatNum(selectedMarket.volume24h)}</span>
              <span>🤖 {selectedMarket.agentsTrading} agents</span>
              <span>Closes: {selectedMarket.closeDate}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <PriceChart />
            <div className="border-t" style={{ borderColor: "var(--border)" }}>
              <OrderbookPanel />
            </div>
            <div className="border-t" style={{ borderColor: "var(--border)" }}>
              <RecentTradesFeed />
            </div>
          </div>
        </div>

        {/* Right: Trade + Agents */}
        <div className="w-[340px] border-l flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="border-b" style={{ borderColor: "var(--border)" }}>
            <TradePanel market={selectedMarket} />
          </div>
          
          <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setActiveTab("agents")}
              className="flex-1 py-2 text-xs font-medium transition"
              style={{ color: activeTab === "agents" ? "white" : "var(--text-secondary)", borderBottom: activeTab === "agents" ? "2px solid var(--accent-green)" : "2px solid transparent" }}
            >
              🏆 Top Agents
            </button>
            <button
              onClick={() => setActiveTab("trades")}
              className="flex-1 py-2 text-xs font-medium transition"
              style={{ color: activeTab === "trades" ? "white" : "var(--text-secondary)", borderBottom: activeTab === "trades" ? "2px solid var(--accent-green)" : "2px solid transparent" }}
            >
              📋 Activity
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "agents"
              ? mockAgents.map((a) => <AgentCard key={a.id} agent={a} />)
              : <RecentTradesFeed />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
