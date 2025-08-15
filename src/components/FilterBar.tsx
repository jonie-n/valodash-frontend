import React from "react";

interface FilterBarProps {
  selectedAgent: string;
  setSelectedAgent: (agent: string) => void;
  selectedMap: string;
  setSelectedMap: (map: string) => void;
  showWinsOnly: boolean;
  setShowWinsOnly: (val: boolean) => void;
  allAgents: string[];
  allMaps: string[];
}

export default function FilterBar({
  selectedAgent,
  setSelectedAgent,
  selectedMap,
  setSelectedMap,
  showWinsOnly,
  setShowWinsOnly,
  allAgents,
  allMaps,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        className="border px-2 py-1 rounded"
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
      >
        <option value="">All Agents</option>
        {allAgents.map((agent) => (
          <option key={agent} value={agent}>
            {agent}
          </option>
        ))}
      </select>

      <select
        className="border px-2 py-1 rounded"
        value={selectedMap}
        onChange={(e) => setSelectedMap(e.target.value)}
      >
        <option value="">All Maps</option>
        {allMaps.map((map) => (
          <option key={map} value={map}>
            {map}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showWinsOnly}
          onChange={(e) => setShowWinsOnly(e.target.checked)}
        />
        Wins Only
      </label>
    </div>
  );
}
