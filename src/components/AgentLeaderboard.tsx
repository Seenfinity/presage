"use client";

import { mockAgents } from "@/lib/mock-data";

interface AgentLeaderboardProps {
  onSelectAgent: (id: string) => void;
  selectedAgent: string | null;
}

export default function AgentLeaderboard({ onSelectAgent, selectedAgent }: AgentLeaderboardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold font-display">
          <span className="gradient-text">Top Agents</span>
        </h3>
        <button className="text-[10px] text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 font-medium transition-colors font-inter">
          View TOP 100 →
        </button>
      </div>

      <div className="space-y-1">
        {mockAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
              selectedAgent === agent.id
                ? "bg-[var(--bg-elevated)] border border-[var(--accent-purple)]/20"
                : "hover:bg-[var(--bg-tertiary)] border border-transparent"
            }`}
          >
            {/* Rank */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
              agent.rank === 1 ? "bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/20" :
              agent.rank === 2 ? "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] border border-[var(--text-secondary)]/20" :
              agent.rank === 3 ? "bg-orange-400/10 text-orange-400 border border-orange-400/20" :
              "bg-[var(--bg-primary)] text-[var(--text-tertiary)] border border-[var(--border)]"
            }`}>
              {agent.rank}
            </div>

            {/* Agent info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 border border-[var(--border)] flex items-center justify-center">
                  <span className="text-[10px]">{agent.emoji}</span>
                </div>
                <span className="text-[13px] font-medium truncate font-inter">{agent.name}</span>
                {agent.streak >= 5 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/10 font-mono">
                    {agent.streak}W
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-[var(--text-tertiary)] font-inter">
                <span>{agent.totalTrades} trades</span>
                <span>{agent.followers.toLocaleString()} followers</span>
                <span>{agent.winRate}% win</span>
              </div>
            </div>

            {/* ROI */}
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-base font-bold text-[var(--accent-green)]">+{agent.roi}%</div>
              <div className="text-[9px] text-[var(--text-tertiary)] font-inter mt-0.5">ROI</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
