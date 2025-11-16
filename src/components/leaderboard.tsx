"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface LeaderboardEntry {
  id: number;
  name: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase.from("leaderboard").select("id, name");
      if (data) setEntries(data);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 ${pixelify.className}`}
    >
      <div className="w-[800px] h-[600px] bg-black border-4 border-white p-8">
        <h1 className="text-white text-6xl font-bold text-center mb-8">
          LEADERBOARD
        </h1>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="text-white text-4xl">
              {entry.id}. {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
