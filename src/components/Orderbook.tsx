"use client";

import { mockOrderbook } from "@/lib/mock-data";

export default function Orderbook() {
  const maxSize = Math.max(
    ...mockOrderbook.bids.map(b => b.size),
    ...mockOrderbook.asks.map(a => a.size)
  );

  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium mb-3">Orderbook</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Bids (YES) */}
        <div>
          <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1 px-1">
            <span>Price</span>
            <span>Size</span>
          </div>
          {mockOrderbook.bids.map((bid, i) => (
            <div key={i} className="relative flex justify-between items-center text-xs py-0.5 px-1">
              <div
                className="absolute inset-0 bg-[var(--accent-green)]/8 rounded-sm"
                style={{ width: `${(bid.size / maxSize) * 100}%` }}
              />
              <span className="relative text-[var(--accent-green)]">{(bid.price * 100).toFixed(0)}¢</span>
              <span className="relative text-[var(--text-secondary)]">{(bid.size / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>

        {/* Asks (NO) */}
        <div>
          <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1 px-1">
            <span>Price</span>
            <span>Size</span>
          </div>
          {mockOrderbook.asks.map((ask, i) => (
            <div key={i} className="relative flex justify-between items-center text-xs py-0.5 px-1">
              <div
                className="absolute inset-0 right-0 bg-[var(--accent-red)]/8 rounded-sm"
                style={{ width: `${(ask.size / maxSize) * 100}%`, marginLeft: "auto" }}
              />
              <span className="relative text-[var(--accent-red)]">{(ask.price * 100).toFixed(0)}¢</span>
              <span className="relative text-[var(--text-secondary)]">{(ask.size / 1000).toFixed(1)}K</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[var(--border)] flex justify-between text-[10px] text-[var(--text-secondary)]">
        <span>Spread: 2¢</span>
        <span>Mid: 72¢</span>
      </div>
    </div>
  );
}
