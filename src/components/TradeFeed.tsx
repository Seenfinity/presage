"use client";

import { mockTrades } from "@/lib/mock-data";

export default function TradeFeed() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Live Trades</h3>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-live" />
          <span className="text-[10px] text-[var(--text-secondary)]">Real-time</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {mockTrades.map(trade => (
          <div key={trade.id} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-200 group">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{trade.agentEmoji}</span>
                <span className="text-xs font-medium">{trade.agentName}</span>
              </div>
              <span className="mono text-[10px] text-[var(--text-tertiary)]">{trade.timestamp}</span>
            </div>

            {/* Trade info */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`tag font-semibold ${
                trade.side === "YES"
                  ? "bg-[var(--accent-green-dim)] text-[var(--accent-green)] border border-[var(--accent-green)]/10"
                  : "bg-[var(--accent-red-dim)] text-[var(--accent-red)] border border-[var(--accent-red)]/10"
              }`}>
                {trade.side}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] truncate">{trade.market}</span>
            </div>

            {/* Price & amount */}
            <div className="flex items-center gap-3 mb-2 text-[11px]">
              <span className="mono text-[var(--text-primary)]">@ {(trade.price * 100).toFixed(0)}¢</span>
              <span className="text-[var(--text-tertiary)]">•</span>
              <span className="mono text-[var(--text-secondary)]">${trade.amount.toLocaleString()}</span>
            </div>

            {/* Reasoning */}
            <div className="pl-3 border-l-2 border-[var(--border)]">
              <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
                {trade.reasoning}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
