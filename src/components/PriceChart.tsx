"use client";

import { priceHistory } from "@/lib/mock-data";

export default function PriceChart() {
  const prices = priceHistory.map(p => p.price);
  const min = Math.min(...prices) - 0.02;
  const max = Math.max(...prices) + 0.02;
  const range = max - min;
  const w = 100;
  const h = 100;

  const points = priceHistory.map((p, i) => {
    const x = (i / (priceHistory.length - 1)) * w;
    const y = h - ((p.price - min) / range) * h;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;

  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const isUp = lastPrice >= firstPrice;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm text-[var(--text-secondary)]">YES Price</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{(lastPrice * 100).toFixed(1)}¢</span>
            <span className={`text-sm font-medium ${isUp ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
              {isUp ? "↑" : "↓"} {(Math.abs(lastPrice - firstPrice) * 100).toFixed(1)}¢
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {["1H", "4H", "24H", "7D", "ALL"].map(tf => (
            <button
              key={tf}
              className={`text-[10px] px-2 py-1 rounded ${
                tf === "24H"
                  ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? "var(--accent-green)" : "var(--accent-red)"} stopOpacity="0.2" />
            <stop offset="100%" stopColor={isUp ? "var(--accent-green)" : "var(--accent-red)"} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(pct => (
          <line
            key={pct}
            x1="0" y1={h * pct} x2={w} y2={h * pct}
            stroke="var(--border)" strokeWidth="0.3" strokeDasharray="1,2"
          />
        ))}
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke={isUp ? "var(--accent-green)" : "var(--accent-red)"} strokeWidth="0.8" />
        {/* Current price dot */}
        <circle
          cx={w}
          cy={h - ((lastPrice - min) / range) * h}
          r="1.5"
          fill={isUp ? "var(--accent-green)" : "var(--accent-red)"}
          className="pulse-dot"
        />
      </svg>

      {/* Price labels */}
      <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
        <span>48h ago</span>
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
