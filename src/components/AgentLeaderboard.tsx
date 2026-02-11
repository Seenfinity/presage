"use client";

import { mockAgents } from "@/lib/mock-data";

interface AgentLeaderboardProps {
  onSelectAgent: (id: string) => void;
  selectedAgent: string | null;
}

const rankBadge = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export default function AgentLeaderboard({ onSelectAgent, selectedAgent }: AgentLeaderboardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
          <span className="gradient-text">Top Agents</span>
        </h3>
        <button className="text-[10px] text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 font-medium transition-colors">
          View TOP 100 →
        </button>
      </div>

      <div className="space-y-1">
        {mockAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
              selectedAgent === agent.id
                ? "bg-[var(--bg-elevated)] border border-[var(--accent-purple)]/20"
                : "hover:bg-[var(--bg-tertiary)] border border-transparent"
            }`}
          >
            {/* Rank */}
            <span className="text-base w-7 text-center flex-shrink-0">
              {rankBadge(agent.rank)}
            </span>

            {/* Agent info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agent.emoji}</span>
                <span className="text-[13px] font-medium truncate">{agent.name}</span>
                {agent.streak >= 5 && (
                  <span className="tag bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]">
                    🔥 {agent.streak}
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-1 text-[10px] text-[var(--text-tertiary)]">
                <span>{agent.totalTrades} trades</span>
                <span>{agent.followers.toLocaleString()} followers</span>
                <span>{agent.winRate}% win</span>
              </div>
            </div>

            {/* ROI */}
            <div className="text-right flex-shrink-0">
              <div className="mono text-base font-bold text-[var(--accent-green)]">+{agent.roi}%</div>
              <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">ROI</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
