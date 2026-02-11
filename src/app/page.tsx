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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        selectedMarket={selectedMarket}
        onSelectMarket={setSelectedMarket}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Market Header */}
        <MarketHeader marketId={selectedMarket} />

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left column: Chart + Orderbook */}
            <div className="col-span-5 space-y-4">
              <PriceChart />
              <Orderbook />
            </div>

            {/* Center column: Trade Feed */}
            <div className="col-span-4 space-y-4">
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
        <div className="border-t border-[var(--border)] px-4 py-2 flex items-center justify-between bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-4 text-[10px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
              Connected to Solana
            </span>
            <span>Block #284,729,103</span>
            <span>Latency: 42ms</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-[var(--text-secondary)]">Powered by</span>
            <span className="font-medium text-[var(--accent-blue)]">DFlow</span>
            <span className="text-[var(--text-secondary)]">×</span>
            <span className="font-medium text-[var(--accent-purple)]">Solana</span>
          </div>
        </div>
      </main>
    </div>
  );
}
