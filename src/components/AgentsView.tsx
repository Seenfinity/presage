"use client";

import { mockAgents } from "@/lib/mock-data";

export default function AgentsView() {
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold font-display">AI Agent Leaderboard</h2>
        <p className="text-[13px] text-[var(--text-secondary)] font-inter mt-1">
          Track the best-performing prediction agents. Follow their reasoning, copy their trades.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: "217", change: "+12 this week" },
          { label: "Avg Win Rate", value: "64.8%", change: "+2.1% vs last month" },
          { label: "Total Predictions", value: "18.4K", change: "Last 30 days" },
          { label: "Copy Traders", value: "3,847", change: "+340 this week" },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter mb-1">{stat.label}</p>
            <p className="font-mono text-2xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-[var(--accent-green)] font-inter mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Agent table */}
      <div className="glass-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--border)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-inter">
          <span className="col-span-1">Rank</span>
          <span className="col-span-3">Agent</span>
          <span className="col-span-1 text-right">ROI</span>
          <span className="col-span-1 text-right">Win Rate</span>
          <span className="col-span-1 text-right">Trades</span>
          <span className="col-span-1 text-right">Followers</span>
          <span className="col-span-2">Last Position</span>
          <span className="col-span-2 text-right">Action</span>
        </div>

        {/* Rows */}
        {mockAgents.map(agent => (
          <div key={agent.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors items-center">
            {/* Rank */}
            <div className="col-span-1">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                agent.rank === 1 ? "bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]" :
                agent.rank === 2 ? "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]" :
                agent.rank === 3 ? "bg-orange-400/10 text-orange-400" :
                "bg-[var(--bg-primary)] text-[var(--text-tertiary)]"
              }`}>
                {agent.rank}
              </div>
            </div>

            {/* Agent */}
            <div className="col-span-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{agent.emoji}</span>
              </div>
              <div>
                <p className="text-[13px] font-medium font-inter">{agent.name}</p>
                {agent.streak >= 5 && (
                  <span className="text-[9px] font-mono text-[var(--accent-yellow)]">{agent.streak} win streak</span>
                )}
              </div>
            </div>

            {/* ROI */}
            <div className="col-span-1 text-right">
              <span className="font-mono text-sm font-bold text-[var(--accent-green)]">+{agent.roi}%</span>
            </div>

            {/* Win Rate */}
            <div className="col-span-1 text-right">
              <span className="font-mono text-sm text-[var(--text-primary)]">{agent.winRate}%</span>
            </div>

            {/* Trades */}
            <div className="col-span-1 text-right">
              <span className="font-mono text-sm text-[var(--text-secondary)]">{agent.totalTrades}</span>
            </div>

            {/* Followers */}
            <div className="col-span-1 text-right">
              <span className="font-mono text-sm text-[var(--text-secondary)]">{agent.followers.toLocaleString()}</span>
            </div>

            {/* Last position */}
            <div className="col-span-2">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                agent.lastPosition.side === "YES"
                  ? "bg-[var(--accent-green)]/8 text-[var(--accent-green)]"
                  : "bg-[var(--accent-red)]/8 text-[var(--accent-red)]"
              }`}>
                {agent.lastPosition.side} {agent.lastPosition.confidence}%
              </span>
            </div>

            {/* Action */}
            <div className="col-span-2 text-right flex gap-2 justify-end">
              <button className="text-[10px] px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all font-inter">
                View
              </button>
              <button className="text-[10px] px-3 py-1.5 rounded-lg bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/20 transition-all font-inter">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
