"use client";

import { mockOrderbook } from "@/lib/mock-data";

export default function Orderbook() {
  const maxSize = Math.max(
    ...mockOrderbook.bids.map(b => b.size),
    ...mockOrderbook.asks.map(a => a.size)
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk' }}>Orderbook</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] pulse-live" />
          <span className="text-[10px] text-[var(--text-secondary)]">Live</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="flex justify-between text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider px-2">
          <span>Bid</span>
          <span>Size</span>
        </div>
        <div className="flex justify-between text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider px-2">
          <span>Ask</span>
          <span>Size</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Bids (YES) */}
        <div className="space-y-0.5">
          {mockOrderbook.bids.map((bid, i) => (
            <div key={i} className="relative flex justify-between items-center text-xs py-1 px-2 rounded-md overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[var(--accent-green)]/6 rounded-md transition-all"
                style={{ width: `${(bid.size / maxSize) * 100}%` }}
              />
              <span className="relative mono text-[var(--accent-green)] font-medium text-[12px]">{(bid.price * 100).toFixed(0)}¢</span>
              <span className="relative mono text-[var(--text-secondary)] text-[11px]">{(bid.size / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>

        {/* Asks (NO) */}
        <div className="space-y-0.5">
          {mockOrderbook.asks.map((ask, i) => (
            <div key={i} className="relative flex justify-between items-center text-xs py-1 px-2 rounded-md overflow-hidden">
              <div
                className="absolute inset-y-0 right-0 bg-[var(--accent-red)]/6 rounded-md transition-all"
                style={{ width: `${(ask.size / maxSize) * 100}%` }}
              />
              <span className="relative mono text-[var(--accent-red)] font-medium text-[12px]">{(ask.price * 100).toFixed(0)}¢</span>
              <span className="relative mono text-[var(--text-secondary)] text-[11px]">{(ask.size / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spread indicator */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[var(--text-tertiary)]">Spread</span>
          <span className="mono text-[var(--text-primary)] font-medium bg-[var(--bg-primary)] px-2 py-0.5 rounded">2¢</span>
        </div>
        <div className="w-px h-3 bg-[var(--border)]" />
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[var(--text-tertiary)]">Mid</span>
          <span className="mono text-[var(--text-primary)] font-medium bg-[var(--bg-primary)] px-2 py-0.5 rounded">72¢</span>
        </div>
      </div>
    </div>
  );
}
