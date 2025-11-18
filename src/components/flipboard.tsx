"use client";

import { useRef, useEffect, useState } from "react";
import { Pixelify_Sans } from "next/font/google";
import {
  level_1,
  level_2,
  level_3,
  level_4,
  level_5,
  level_6,
  Flower,
} from "./flowers";
import { supabase } from "@/lib/supabaseClient";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DOT_SIZE = 8;
const DOT_SPACING = 10;
const COLS = Math.floor(1280 / DOT_SPACING);
const ROWS = Math.floor(720 / DOT_SPACING);

const FLOWER_LEFT_OFFSET = 100;
const FLOWER_TOP_OFFSET = Math.floor(60);
const FLOWER_COL_OFFSET = Math.floor(FLOWER_LEFT_OFFSET / DOT_SPACING);
const FLOWER_ROW_OFFSET = Math.floor(FLOWER_TOP_OFFSET / DOT_SPACING);

const COMPLETIONS_KEY = "goalCompletions";

const getCurrentLevel = (): Flower => {
  if (typeof window === "undefined") return level_1;

  const completions = parseInt(
    localStorage.getItem(COMPLETIONS_KEY) || "0",
    10
  );

  if (completions === 0) return level_1;
  if (completions === 1) return level_2;
  if (completions === 2) return level_3;
  if (completions === 3) return level_4;
  if (completions === 4) return level_5;
  return level_6;
};

interface LeaderboardEntry {
  id: number;
  name: string;
}

export default function Flipboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Flower>(() =>
    getCurrentLevel()
  );

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase.from("leaderboard").select("id, name");
      if (data) setEntries(data);
    }
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const handleLevelUpdate = () => {
      setCurrentLevel(getCurrentLevel());
      setFrame(0);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COMPLETIONS_KEY) {
        handleLevelUpdate();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        handleLevelUpdate();
      }
    };

    window.addEventListener("levelUpdated", handleLevelUpdate);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("levelUpdated", handleLevelUpdate);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x = col * DOT_SPACING + DOT_SPACING / 2;
          const y = row * DOT_SPACING + DOT_SPACING / 2;

          const flowerRow = row - FLOWER_ROW_OFFSET;
          const flowerCol = col - FLOWER_COL_OFFSET;

          let isWhite = false;
          if (
            flowerRow >= 0 &&
            flowerRow < 12 &&
            flowerCol >= 0 &&
            flowerCol < 12
          ) {
            isWhite = currentLevel[frame][flowerRow][flowerCol] === 1;
          }

          ctx.fillStyle = isWhite ? "#fff" : "#222";
          ctx.beginPath();
          ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = "#fff";
      ctx.font = "bold 60px 'Pixelify Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const leaderboardStartX = 800;
      const titleY = 50;
      ctx.fillText("LEADERBOARD", leaderboardStartX, titleY);

      ctx.font = "40px 'Pixelify Sans', sans-serif";
      const startY = titleY + 100;
      const lineHeight = 60;

      entries.forEach((entry, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(`${entry.id}. ${entry.name}`, leaderboardStartX, y);
      });
    };

    draw();
  }, [frame, currentLevel, entries]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % currentLevel.length);
    }, 500);
    return () => clearInterval(interval);
  }, [currentLevel]);

  return (
    <div
      className={`flex items-center justify-center p-4 ${pixelify.className}`}
    >
      <div className="w-[1280px] h-[720px] bg-black border-4 border-white">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
