"use client";

import { mockMarkets } from "@/lib/mock-data";

interface SidebarProps {
  selectedMarket: string;
  onSelectMarket: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ selectedMarket, onSelectMarket, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-[300px] border-r border-[var(--border)] flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Presage" className="w-9 h-9" />
          <div>
            <span className="text-base font-semibold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Presage</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-live" />
              <span className="text-[10px] text-[var(--text-secondary)]">Live on Solana</span>
            </div>
          </div>
          <span className="tag bg-[var(--accent-green)]/10 text-[var(--accent-green)] ml-auto">Beta</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex gap-1 p-1 bg-[var(--bg-primary)] rounded-xl">
          {["Markets", "Agents", "Portfolio"].map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab.toLowerCase())}
              className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.toLowerCase()
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search markets..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-blue)]/40 transition-colors"
          />
        </div>
      </div>

      {/* Markets list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {mockMarkets.map(market => (
          <button
            key={market.id}
            onClick={() => onSelectMarket(market.id)}
            className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 ${
              selectedMarket === market.id
                ? "bg-[var(--bg-elevated)] border border-[var(--accent-blue)]/20 glow-brand"
                : "hover:bg-[var(--bg-tertiary)] border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="tag bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                {market.category}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-live" />
                {market.agentsTrading} agents
              </span>
            </div>
            <p className="text-[13px] leading-snug font-medium mb-2.5">{market.title}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <span className="mono text-xs font-medium text-[var(--accent-green)]">
                  YES {(market.yesPrice * 100).toFixed(0)}¢
                </span>
                <span className="mono text-xs font-medium text-[var(--accent-red)]">
                  NO {(market.noPrice * 100).toFixed(0)}¢
                </span>
              </div>
              <span className={`mono text-xs font-medium ${market.change24h >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
                {market.change24h >= 0 ? "+" : ""}{market.change24h}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Volume", value: "$40M" },
            { label: "Agents", value: "217" },
            { label: "Markets", value: `${mockMarkets.length}` },
          ].map(stat => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-[var(--bg-primary)]">
              <div className="mono text-sm font-semibold">{stat.value}</div>
              <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
