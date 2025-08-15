import React from "react";
import { Match } from "../types/Match";
import "./MatchCard.css";

const agentIcons = import.meta.glob("../assets/agents/*.png", {
  eager: true,
  as: "url",
}) as Record<string, string>;

function agentToKey(agent: string) {
  return agent.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getAgentIcon(agent: string): string | undefined {
  const key = agentToKey(agent);
  const match = Object.entries(agentIcons).find(([path]) =>
    path.endsWith(`/assets/agents/${key}.png`)
  );
  return match?.[1];
}

type Props = { match: Match };

export default function MatchCard({ match }: Props) {
  const safeDeaths = match.deaths === 0 ? 1 : match.deaths;
  const kda = ((match.kills + match.assists) / safeDeaths).toFixed(2);
  const iconUrl = getAgentIcon(match.agent);

  const formattedDate = new Date(match.date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="match-card">
      <div className="match-card__left">
        <div className="match-card__header">
          <h3 className="match-card__agent">{match.agent}</h3>
          <span
            className={`match-card__badge ${
              match.win ? "match-card__badge--win" : "match-card__badge--loss"
            }`}
          >
            {match.win ? "Win" : "Loss"}
          </span>
        </div>

        <p className="match-card__text">
          Map: <b>{match.map}</b> | {match.kills}/{match.deaths}/{match.assists} K/D/A ({kda})
          {typeof match.headshotPercentage === "number" &&
            ` | ${match.headshotPercentage.toFixed(1)}% HS`}
        </p>

        <p className="match-card__date">{formattedDate}</p>
      </div>

      <div className="match-card__right">
        {iconUrl && (
          <img
            src={iconUrl}
            alt={match.agent}
            className="match-card__agent-icon"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
