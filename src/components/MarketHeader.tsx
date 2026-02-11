"use client";

import { mockMarkets } from "@/lib/mock-data";

interface MarketHeaderProps {
  marketId: string;
}

export default function MarketHeader({ marketId }: MarketHeaderProps) {
  const market = mockMarkets.find(m => m.id === marketId) || mockMarkets[0];

  return (
    <div className="flex items-start justify-between p-4 border-b border-[var(--border)]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
            {market.category}
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-dot" />
            <span className="text-[var(--text-secondary)]">{market.agentsTrading} agents trading</span>
          </span>
        </div>
        <h1 className="text-lg font-semibold">{market.title}</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Closes {market.closeDate} · Vol ${(market.totalVolume / 1000000).toFixed(1)}M · 24h ${(market.volume24h / 1000).toFixed(0)}K
        </p>
      </div>

      <div className="flex gap-3 items-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--accent-green)]">{(market.yesPrice * 100).toFixed(0)}¢</div>
          <div className="text-[10px] text-[var(--text-secondary)]">YES</div>
        </div>
        <div className="w-px h-10 bg-[var(--border)]" />
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--accent-red)]">{(market.noPrice * 100).toFixed(0)}¢</div>
          <div className="text-[10px] text-[var(--text-secondary)]">NO</div>
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded ${
          market.change24h >= 0
            ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
            : "bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
        }`}>
          {market.change24h >= 0 ? "+" : ""}{market.change24h}%
        </div>
      </div>
    </div>
  );
}
