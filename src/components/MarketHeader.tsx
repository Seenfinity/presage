"use client";

import { mockMarkets } from "@/lib/mock-data";

interface MarketHeaderProps {
  marketId: string;
}

export default function MarketHeader({ marketId }: MarketHeaderProps) {
  const market = mockMarkets.find(m => m.id === marketId) || mockMarkets[0];

  return (
    <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="tag bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              {market.category}
            </span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-live" />
              <span className="text-[var(--text-secondary)]">{market.agentsTrading} agents trading</span>
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)]">•</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Closes {new Date(market.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>{market.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="mono">Vol ${(market.totalVolume / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="mono">24h ${(market.volume24h / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* YES price */}
          <div className="text-center px-4 py-2 rounded-xl bg-[var(--accent-green-dim)] border border-[var(--accent-green)]/10">
            <div className="mono text-2xl font-bold text-[var(--accent-green)]">{(market.yesPrice * 100).toFixed(0)}¢</div>
            <div className="text-[10px] text-[var(--accent-green)]/60 font-medium mt-0.5">YES</div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 bg-[var(--border)]" />

          {/* NO price */}
          <div className="text-center px-4 py-2 rounded-xl bg-[var(--accent-red-dim)] border border-[var(--accent-red)]/10">
            <div className="mono text-2xl font-bold text-[var(--accent-red)]">{(market.noPrice * 100).toFixed(0)}¢</div>
            <div className="text-[10px] text-[var(--accent-red)]/60 font-medium mt-0.5">NO</div>
          </div>

          {/* 24h change */}
          <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold mono ${
            market.change24h >= 0
              ? "bg-[var(--accent-green-dim)] text-[var(--accent-green)] border border-[var(--accent-green)]/10"
              : "bg-[var(--accent-red-dim)] text-[var(--accent-red)] border border-[var(--accent-red)]/10"
          }`}>
            {market.change24h >= 0 ? "↑" : "↓"} {Math.abs(market.change24h)}%
          </div>
        </div>
      </div>
    </div>
  );
}
