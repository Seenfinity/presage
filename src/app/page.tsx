"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MarketHeader from "@/components/MarketHeader";
import PriceChart from "@/components/PriceChart";
import Orderbook from "@/components/Orderbook";
import TradePanel from "@/components/TradePanel";
import AgentLeaderboard from "@/components/AgentLeaderboard";
import TradeFeed from "@/components/TradeFeed";

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState("btc-100k-mar");
  const [activeTab, setActiveTab] = useState("markets");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="flex h-screen overflow-hidden noise">
      {/* Sidebar */}
      <Sidebar
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
        {/* Market Header */}
        <MarketHeader marketId={selectedMarket} />

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-12 gap-5">
            {/* Left column: Chart + Orderbook */}
            <div className="col-span-5 space-y-5">
              <PriceChart />
              <Orderbook />
            </div>

            {/* Center column: Trade Feed + Leaderboard */}
            <div className="col-span-4 space-y-5">
              <TradeFeed />
              <AgentLeaderboard
                onSelectAgent={setSelectedAgent}
                selectedAgent={selectedAgent}
              />
            </div>

            {/* Right column: Trade Panel */}
            <div className="col-span-3">
              <TradePanel />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] px-5 py-2.5 flex items-center justify-between bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-5 text-[10px] text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
              <span className="text-[var(--text-secondary)]">Connected</span>
            </span>
            <span className="mono">Block #284,729,103</span>
            <span className="mono">42ms</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[var(--text-tertiary)]">Powered by</span>
            <span className="font-semibold text-[var(--accent-cyan)]" style={{ fontFamily: 'Space Grotesk' }}>DFlow</span>
            <span className="text-[var(--text-tertiary)]">on</span>
            <span className="font-semibold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>Solana</span>
          </div>
        </div>
      </main>
    </div>
  );
}
