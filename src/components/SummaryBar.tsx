import React from "react";
import { Match } from "../types/Match";

interface SummaryBarProps {
  matches: Match[];
}

export default function SummaryBar({ matches }: SummaryBarProps) {
  const total = matches.length;
  const wins = matches.filter((m) => m.win).length;

  const totalKDA = matches.reduce((sum, m) => {
    const deaths = m.deaths === 0 ? 1 : m.deaths;
    const kda = (m.kills + m.assists) / deaths;
    return sum + kda;
  }, 0);

  const avgKDA = total > 0 ? (totalKDA / total).toFixed(2) : "—";

  const agentFreq: Record<string, number> = {};
  matches.forEach((m) => {
    agentFreq[m.agent] = (agentFreq[m.agent] || 0) + 1;
  });
  const mostPlayed =
    Object.entries(agentFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <p
        style={{ fontSize: "18px", color: "#333", fontWeight: 300 }}
      >
        Showing <b>{total}</b> matches | <b>{wins}</b> wins (
        {(wins / total * 100 || 0).toFixed(1)}%) | Avg KDA: <b>{avgKDA}</b> | Most Played: <b>{mostPlayed}</b>
      </p>
    </div>
  );
}
