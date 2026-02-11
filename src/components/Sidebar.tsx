"use client";

import { mockMarkets, type Market } from "@/lib/mock-data";

interface SidebarProps {
  selectedMarket: string;
  onSelectMarket: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ selectedMarket, onSelectMarket, activeTab, onTabChange }: SidebarProps) {
  const categories = ["All", ...Array.from(new Set(mockMarkets.map(m => m.category)))];

  return (
    <aside className="w-72 border-r border-[var(--border)] flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center font-bold text-sm text-black">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">Presage</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-green)]/10 text-[var(--accent-green)] font-medium ml-auto">BETA</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-1 p-2 border-b border-[var(--border)]">
        {["Markets", "Agents", "Portfolio"].map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase())}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
              activeTab === tab.toLowerCase()
                ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Markets list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {mockMarkets.map(market => (
            <button
              key={market.id}
              onClick={() => onSelectMarket(market.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedMarket === market.id
                  ? "bg-[var(--bg-tertiary)] border border-[var(--accent-blue)]/30"
                  : "hover:bg-[var(--bg-tertiary)]/50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                  {market.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-dot" />
                  {market.agentsTrading} agents
                </span>
              </div>
              <p className="text-sm leading-snug mb-2">{market.title}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs font-medium text-[var(--accent-green)]">
                    YES {(market.yesPrice * 100).toFixed(0)}¢
                  </span>
                  <span className="text-xs font-medium text-[var(--accent-red)]">
                    NO {(market.noPrice * 100).toFixed(0)}¢
                  </span>
                </div>
                <span className={`text-xs font-medium ${market.change24h >= 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
                  {market.change24h >= 0 ? "+" : ""}{market.change24h}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="p-3 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)]">
        <div className="flex justify-between">
          <span>Total Volume</span>
          <span className="text-[var(--text-primary)]">$40.0M</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Active Agents</span>
          <span className="text-[var(--text-primary)]">217</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Markets</span>
          <span className="text-[var(--text-primary)]">{mockMarkets.length} live</span>
        </div>
      </div>
    </aside>
  );
}
