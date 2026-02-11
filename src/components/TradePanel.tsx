"use client";

import { useState } from "react";

export default function TradePanel() {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("100");
  const [orderType, setOrderType] = useState<"market" | "limit" | "sl" | "tp">("market");

  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium mb-3">Trade</h3>

      {/* Side selection */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setSide("YES")}
          className={`py-2 rounded-lg text-sm font-medium transition-all ${
            side === "YES"
              ? "bg-[var(--accent-green)] text-black"
              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          YES 72¢
        </button>
        <button
          onClick={() => setSide("NO")}
          className={`py-2 rounded-lg text-sm font-medium transition-all ${
            side === "NO"
              ? "bg-[var(--accent-red)] text-white"
              : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          NO 28¢
        </button>
      </div>

      {/* Order type */}
      <div className="flex gap-1 mb-3 p-0.5 bg-[var(--bg-primary)] rounded-lg">
        {[
          { key: "market", label: "Market" },
          { key: "limit", label: "Limit" },
          { key: "sl", label: "Stop Loss" },
          { key: "tp", label: "Take Profit" },
        ].map(type => (
          <button
            key={type.key}
            onClick={() => setOrderType(type.key as typeof orderType)}
            className={`flex-1 text-[10px] py-1.5 rounded-md transition-colors ${
              orderType === type.key
                ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="text-[10px] text-[var(--text-secondary)] mb-1 block">Amount (USDC)</label>
        <input
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
        />
        <div className="flex gap-1 mt-1">
          {["25", "50", "100", "500"].map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className="flex-1 text-[10px] py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Limit price (conditional) */}
      {orderType !== "market" && (
        <div className="mb-3">
          <label className="text-[10px] text-[var(--text-secondary)] mb-1 block">
            {orderType === "limit" ? "Limit Price" : orderType === "sl" ? "Stop Loss Price" : "Take Profit Price"}
          </label>
          <input
            type="text"
            placeholder="0.00¢"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]"
          />
        </div>
      )}

      {/* Summary */}
      <div className="p-2 rounded-lg bg-[var(--bg-primary)] mb-3 text-[10px] space-y-1">
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Avg price</span>
          <span>{side === "YES" ? "72¢" : "28¢"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Shares</span>
          <span>{Math.floor(Number(amount) / (side === "YES" ? 0.72 : 0.28))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-secondary)]">Potential payout</span>
          <span className="text-[var(--accent-green)]">
            ${Math.floor(Number(amount) / (side === "YES" ? 0.72 : 0.28)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
          side === "YES"
            ? "bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 text-black"
            : "bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/90 text-white"
        }`}
      >
        {orderType === "market" ? `Buy ${side}` : 
         orderType === "limit" ? `Place Limit ${side}` :
         orderType === "sl" ? `Set Stop Loss` : `Set Take Profit`}
      </button>

      {/* Copy trading CTA */}
      <div className="mt-3 p-2 rounded-lg border border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/5">
        <p className="text-[10px] text-[var(--accent-purple)] font-medium mb-1">🤖 Copy Trading</p>
        <p className="text-[10px] text-[var(--text-secondary)]">
          Auto-copy trades from top agents. Subscribe to unlock.
        </p>
        <button className="mt-1.5 text-[10px] px-2 py-1 rounded bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple)]/90">
          Subscribe — $29/mo
        </button>
      </div>
    </div>
  );
}
