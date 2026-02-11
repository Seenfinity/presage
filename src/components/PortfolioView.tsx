"use client";

export default function PortfolioView() {
  const positions = [
    { market: "Bitcoin above $100K by March 2026?", side: "YES", shares: 138, avgPrice: 0.72, currentPrice: 0.74, pnl: 2.76 },
    { market: "Fed cuts rates in Q1 2026?", side: "NO", shares: 178, avgPrice: 0.56, currentPrice: 0.55, pnl: -1.78 },
    { market: "Solana flips Ethereum market cap in 2026?", side: "YES", shares: 500, avgPrice: 0.17, currentPrice: 0.18, pnl: 5.88 },
  ];

  const totalValue = 847.32;
  const totalPnl = 6.86;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold font-display">Portfolio</h2>
        <p className="text-[13px] text-[var(--text-secondary)] font-inter mt-1">
          Your positions, P&L, and copy trading subscriptions.
        </p>
      </div>

      {/* Portfolio stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter mb-1">Portfolio Value</p>
          <p className="font-mono text-3xl font-bold">${totalValue.toFixed(2)}</p>
          <p className="text-[11px] text-[var(--accent-green)] font-mono mt-1">+${totalPnl.toFixed(2)} (+0.82%)</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter mb-1">Active Positions</p>
          <p className="font-mono text-3xl font-bold">{positions.length}</p>
          <p className="text-[11px] text-[var(--text-secondary)] font-inter mt-1">Across {positions.length} markets</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter mb-1">Copy Trading</p>
          <p className="font-mono text-3xl font-bold text-[var(--text-tertiary)]">—</p>
          <p className="text-[11px] text-[var(--accent-purple)] font-inter mt-1">Coming Soon</p>
        </div>
      </div>

      {/* Positions table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold font-display">Open Positions</h3>
        </div>

        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-[var(--border)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter">
          <span className="col-span-4">Market</span>
          <span className="col-span-1 text-center">Side</span>
          <span className="col-span-1 text-right">Shares</span>
          <span className="col-span-2 text-right">Avg Price</span>
          <span className="col-span-2 text-right">Current</span>
          <span className="col-span-2 text-right">P&L</span>
        </div>

        {positions.map((pos, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors items-center">
            <span className="col-span-4 text-[13px] font-inter truncate">{pos.market}</span>
            <div className="col-span-1 text-center">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                pos.side === "YES"
                  ? "bg-[var(--accent-green)]/8 text-[var(--accent-green)]"
                  : "bg-[var(--accent-red)]/8 text-[var(--accent-red)]"
              }`}>
                {pos.side}
              </span>
            </div>
            <span className="col-span-1 text-right font-mono text-sm">{pos.shares}</span>
            <span className="col-span-2 text-right font-mono text-sm text-[var(--text-secondary)]">{(pos.avgPrice * 100).toFixed(0)}¢</span>
            <span className="col-span-2 text-right font-mono text-sm">{(pos.currentPrice * 100).toFixed(0)}¢</span>
            <span className={`col-span-2 text-right font-mono text-sm font-medium ${pos.pnl >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
              {pos.pnl >= 0 ? "+" : ""}{pos.pnl.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
