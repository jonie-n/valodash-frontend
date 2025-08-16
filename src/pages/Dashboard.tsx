import React, { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL as string | undefined;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else toast.error("User not authenticated.");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    if (!API) {
      toast.error("API base URL missing. Check VITE_API_URL.");
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/matches/${uid}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setMatches(data.matches || []);
      } catch (e) {
        // quick retry (smoother UX on Render cold starts)
        try {
          await new Promise((r) => setTimeout(r, 1000));
          const res2 = await fetch(`${API}/matches/${uid}`);
          if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
          const data2 = await res2.json();
          if (!cancelled) setMatches(data2.matches || []);
        } catch {
          if (!cancelled) toast.error("Failed to load match data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [uid, API]);

  const allAgents = useMemo(
    () => [...new Set(matches.map((m) => m.agent))],
    [matches]
  );
  const allMaps = useMemo(
    () => [...new Set(matches.map((m) => m.map))],
    [matches]
  );

  const filtered = useMemo(
    () =>
      matches.filter(
        (m) =>
          (selectedAgent === "" || m.agent === selectedAgent) &&
          (selectedMap === "" || m.map === selectedMap) &&
          (!showWinsOnly || m.win)
      ),
    [matches, selectedAgent, selectedMap, showWinsOnly]
  );

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
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

      {loading && <p className="mt-4 text-center">Loading matches…</p>}

      {!loading && filtered.map((match) => (
        <MatchCard key={match.matchId} match={match} />
      ))}

      {!loading && filtered.length === 0 && (
        <p className="mt-6 text-center opacity-80">No matches to show.</p>
      )}
    </div>
  );
}
