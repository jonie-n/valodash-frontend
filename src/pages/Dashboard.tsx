import React, { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import FilterBar from "../components/FilterBar";
import SummaryBar from "../components/SummaryBar";
import { Match } from "../types/Match";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [showWinsOnly, setShowWinsOnly] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        toast.error("User not authenticated.");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    fetch(`${API}/matches/${uid}`)
      .then((res) => {
        if (!res.ok) throw new Error("Data not found");
        return res.json();
      })
      .then((data) => setMatches(data.matches || []))
      .catch(() => toast.error("Failed to load match data"));
  }, [uid]);

  const allAgents = [...new Set(matches.map((m) => m.agent))];
  const allMaps = [...new Set(matches.map((m) => m.map))];

  const filtered = matches.filter((m) => {
    return (
      (selectedAgent === "" || m.agent === selectedAgent) &&
      (selectedMap === "" || m.map === selectedMap) &&
      (!showWinsOnly || m.win)
    );
  });

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        await signOut(auth);
        toast.success("Logged out successfully");
      } catch {
        toast.error("Failed to log out");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="relative mb-6">
        <h1 className="app-title text-center">Valorant Match Tracker</h1>
        <button
          onClick={handleLogout}
          className="logout-button absolute right-0 top-1"
        >
          Log out
        </button>
      </div>

      <FilterBar
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        showWinsOnly={showWinsOnly}
        setShowWinsOnly={setShowWinsOnly}
        allAgents={allAgents}
        allMaps={allMaps}
      />

      <SummaryBar matches={filtered} />

      {filtered.map((match) => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
}
