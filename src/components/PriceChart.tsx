"use client";

import { priceHistory } from "@/lib/mock-data";

export default function PriceChart() {
  const prices = priceHistory.map(p => p.price);
  const min = Math.min(...prices) - 0.02;
  const max = Math.max(...prices) + 0.02;
  const range = max - min;
  const w = 400;
  const h = 200;

  const points = priceHistory.map((p, i) => {
    const x = (i / (priceHistory.length - 1)) * w;
    const y = h - ((p.price - min) / range) * h;
    return { x, y };
  });

  // Smooth curve using cubic bezier
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 3;
    const cpx2 = point.x - (point.x - prev.x) / 3;
    return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`;
  }, "");

  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;

  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const isUp = lastPrice >= firstPrice;
  const priceLevels = [0.25, 0.5, 0.75].map(pct => ({
    y: h * pct,
    label: (max - (max - min) * pct).toFixed(2),
  }));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] text-[var(--text-secondary)] mb-1">YES Price</p>
          <div className="flex items-baseline gap-2.5">
            <span className="mono text-3xl font-bold tracking-tight">{(lastPrice * 100).toFixed(1)}¢</span>
            <span className={`mono text-sm font-semibold ${isUp ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
              {isUp ? "+" : ""}{((lastPrice - firstPrice) * 100).toFixed(1)}¢
              <span className="text-xs ml-1">({isUp ? "+" : ""}{(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)}%)</span>
            </span>
          </div>
        </div>
        <div className="flex gap-0.5 p-0.5 bg-[var(--bg-primary)] rounded-lg">
          {["1H", "4H", "24H", "7D", "ALL"].map(tf => (
            <button
              key={tf}
              className={`text-[10px] px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                tf === "24H"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? "var(--accent-green)" : "var(--accent-red)"} stopOpacity="0.15" />
              <stop offset="50%" stopColor={isUp ? "var(--accent-green)" : "var(--accent-red)"} stopOpacity="0.05" />
              <stop offset="100%" stopColor={isUp ? "var(--accent-green)" : "var(--accent-red)"} stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {priceLevels.map((level, i) => (
            <g key={i}>
              <line x1="0" y1={level.y} x2={w} y2={level.y} stroke="var(--border)" strokeWidth="0.5" />
              <text x={w - 2} y={level.y - 4} textAnchor="end" fill="var(--text-tertiary)" fontSize="8" fontFamily="JetBrains Mono">
                {(Number(level.label) * 100).toFixed(0)}¢
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke={isUp ? "var(--accent-green)" : "var(--accent-red)"} strokeWidth="1.5" filter="url(#glow)" />

          {/* Current price indicator */}
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={isUp ? "var(--accent-green)" : "var(--accent-red)"}
            className="pulse-live"
          />
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="6"
            fill="none"
            stroke={isUp ? "var(--accent-green)" : "var(--accent-red)"}
            strokeWidth="0.5"
            opacity="0.4"
            className="pulse-live"
          />
        </svg>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-2 mono">
        <span>48h ago</span>
        <span>36h</span>
        <span>24h</span>
        <span>12h</span>
        <span>Now</span>
      </div>
    </div>
  );
}
