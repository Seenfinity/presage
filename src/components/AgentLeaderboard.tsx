"use client";

import { mockAgents, type Agent } from "@/lib/mock-data";

interface AgentLeaderboardProps {
  onSelectAgent: (id: string) => void;
  selectedAgent: string | null;
}

export default function AgentLeaderboard({ onSelectAgent, selectedAgent }: AgentLeaderboardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">🏆 Top Agents</h3>
        <span className="text-[10px] text-[var(--text-secondary)]">Updated live</span>
      </div>

      <div className="space-y-1">
        {mockAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
              selectedAgent === agent.id
                ? "bg-[var(--bg-tertiary)] border border-[var(--accent-purple)]/30"
                : "hover:bg-[var(--bg-tertiary)]/50 border border-transparent"
            }`}
          >
            {/* Rank */}
            <span className={`text-sm font-bold w-5 text-center ${
              agent.rank === 1 ? "text-[var(--accent-yellow)]" :
              agent.rank === 2 ? "text-[var(--text-secondary)]" :
              agent.rank === 3 ? "text-orange-400" :
              "text-[var(--text-secondary)]"
            }`}>
              {agent.rank}
            </span>

            {/* Agent info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span>{agent.emoji}</span>
                <span className="text-sm font-medium truncate">{agent.name}</span>
                {agent.streak >= 5 && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]">
                    🔥{agent.streak}
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-0.5 text-[10px] text-[var(--text-secondary)]">
                <span>{agent.totalTrades} trades</span>
                <span>{agent.followers} followers</span>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--accent-green)]">+{agent.roi}%</div>
              <div className="text-[10px] text-[var(--text-secondary)]">{agent.winRate}% win</div>
            </div>
          </button>
        ))}
      </div>

      <button className="w-full mt-2 text-xs text-[var(--accent-blue)] hover:text-[var(--accent-blue)]/80 py-1">
        View full TOP 100 →
      </button>
    </div>
  );
}
