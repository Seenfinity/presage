"use client";

import { useState } from "react";

export default function TradePanel() {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("100");
  const [orderType, setOrderType] = useState<"market" | "limit" | "sl" | "tp">("market");

  const price = side === "YES" ? 0.72 : 0.28;
  const shares = Math.floor(Number(amount) / price);

  return (
    <div className="glass-card p-5 sticky top-4">
      <h3 className="text-sm font-semibold mb-4 font-display">Trade</h3>

      {/* Side selection — clean pill style */}
      <div className="p-1 bg-[var(--bg-primary)] rounded-xl mb-4">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setSide("YES")}
            className={`py-3 rounded-lg text-sm font-semibold font-display transition-all duration-200 ${
              side === "YES"
                ? "bg-[var(--accent-green)] text-black"
                : "text-[var(--text-tertiary)] hover:text-[var(--accent-green)]"
            }`}
          >
            Yes · 72¢
          </button>
          <button
            onClick={() => setSide("NO")}
            className={`py-3 rounded-lg text-sm font-semibold font-display transition-all duration-200 ${
              side === "NO"
                ? "bg-[var(--accent-red)] text-white"
                : "text-[var(--text-tertiary)] hover:text-[var(--accent-red)]"
            }`}
          >
            No · 28¢
          </button>
        </div>
      </div>

      {/* Order type */}
      <div className="flex gap-0.5 mb-4 p-0.5 bg-[var(--bg-primary)] rounded-xl">
        {[
          { key: "market", label: "Market" },
          { key: "limit", label: "Limit" },
          { key: "sl", label: "Stop Loss" },
          { key: "tp", label: "Take Profit" },
        ].map(type => (
          <button
            key={type.key}
            onClick={() => setOrderType(type.key as typeof orderType)}
            className={`flex-1 text-[10px] py-2 rounded-lg font-medium transition-all duration-200 font-inter ${
              orderType === type.key
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="text-[10px] text-[var(--text-secondary)] mb-2 block uppercase tracking-wider font-inter">Amount (USDC)</label>
        <input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/40 transition-colors"
        />
        <div className="flex gap-1.5 mt-2">
          {["25", "50", "100", "500", "1000"].map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`flex-1 font-mono text-[10px] py-1.5 rounded-lg transition-all duration-200 ${
                amount === v
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)]"
                  : "bg-[var(--bg-primary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional price input */}
      {orderType !== "market" && (
        <div className="mb-4">
          <label className="text-[10px] text-[var(--text-secondary)] mb-2 block uppercase tracking-wider font-inter">
            {orderType === "limit" ? "Limit Price" : orderType === "sl" ? "Trigger Price" : "Target Price"}
          </label>
          <input
            type="text"
            placeholder="0¢"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/40 transition-colors"
          />
        </div>
      )}

      {/* Summary */}
      <div className="p-3 rounded-xl bg-[var(--bg-primary)] mb-4 space-y-2">
        {[
          { label: "Avg price", value: `${(price * 100).toFixed(0)}¢` },
          { label: "Shares", value: shares.toLocaleString() },
          { label: "Max payout", value: `$${shares.toLocaleString()}`, highlight: true },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-[11px] font-inter">
            <span className="text-[var(--text-tertiary)]">{row.label}</span>
            <span className={`font-mono font-medium ${row.highlight ? "text-[var(--accent-green)]" : "text-[var(--text-primary)]"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        className={`w-full py-3 rounded-xl text-sm font-bold font-display transition-all duration-200 ${
          side === "YES"
            ? "bg-[var(--accent-green)] hover:brightness-110 text-black"
            : "bg-[var(--accent-red)] hover:brightness-110 text-white"
        }`}
      >
        {orderType === "market" ? `Buy ${side}` : 
         orderType === "limit" ? `Place Limit ${side}` :
         orderType === "sl" ? `Set Stop Loss` : `Set Take Profit`}
      </button>

      {/* Copy Trading CTA */}
      <div className="mt-5 p-4 rounded-xl border border-[var(--accent-purple)]/15 bg-gradient-to-b from-[var(--accent-purple)]/5 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold font-display">Copy Trading</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3 font-inter">
          Auto-copy positions from top-performing AI agents. Let the best algorithms trade for you.
        </p>
        <button className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] border border-[var(--accent-purple)]/20 hover:bg-[var(--accent-purple)]/30 transition-all duration-200 font-display">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
