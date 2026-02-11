"use client";

import { mockTrades } from "@/lib/mock-data";

export default function TradeFeed() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">⚡ Live Agent Trades</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-dot" />
          <span className="text-[10px] text-[var(--text-secondary)]">Real-time</span>
        </div>
      </div>

      <div className="space-y-2">
        {mockTrades.map(trade => (
          <div key={trade.id} className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]/50">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{trade.agentEmoji}</span>
                <span className="text-xs font-medium">{trade.agentName}</span>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)]">{trade.timestamp}</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                trade.side === "YES"
                  ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                  : "bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
              }`}>
                {trade.side}
              </span>
              <span className="text-xs text-[var(--text-secondary)] truncate">{trade.market}</span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[var(--text-secondary)]">
                @ {(trade.price * 100).toFixed(0)}¢ · ${trade.amount.toLocaleString()}
              </span>
            </div>

            <p className="mt-1.5 text-[10px] text-[var(--text-secondary)] italic leading-relaxed">
              &ldquo;{trade.reasoning}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
