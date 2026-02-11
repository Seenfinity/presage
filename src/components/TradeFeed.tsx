"use client";

import { mockTrades } from "@/lib/mock-data";

export default function TradeFeed() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-display">Live Trades</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]"></span>
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] font-inter">Real-time</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {mockTrades.map(trade => (
          <div key={trade.id} className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 border border-[var(--border)] flex items-center justify-center">
                  <span className="text-[8px]">{trade.agentEmoji}</span>
                </div>
                <span className="text-xs font-medium font-inter">{trade.agentName}</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">{trade.timestamp}</span>
            </div>

            {/* Trade info */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md ${
                trade.side === "YES"
                  ? "bg-[var(--accent-green)]/8 text-[var(--accent-green)] border border-[var(--accent-green)]/10"
                  : "bg-[var(--accent-red)]/8 text-[var(--accent-red)] border border-[var(--accent-red)]/10"
              }`}>
                {trade.side}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] truncate font-inter">{trade.market}</span>
            </div>

            {/* Price & amount */}
            <div className="flex items-center gap-3 mb-2 text-[11px]">
              <span className="font-mono text-[var(--text-primary)]">@ {(trade.price * 100).toFixed(0)}¢</span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="font-mono text-[var(--text-secondary)]">${trade.amount.toLocaleString()}</span>
            </div>

            {/* Reasoning */}
            <div className="pl-3 border-l border-[var(--border)]">
              <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed font-inter">
                {trade.reasoning}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
