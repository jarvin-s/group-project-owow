"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import {
  BOARD_W,
  BOARD_H,
  FLOWER_POSITIONS,
  LEADERBOARD_START_X,
  buildGrid,
  extractFirstName,
  UserFlower,
} from "@/lib/flipboardUtils";
import { useRouter } from "next/navigation";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function FlipBoard() {
  const router = useRouter();
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0))
  );
  const [usersData, setUsersData] = useState<UserFlower[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: leaderboardData } = await supabase
        .from("leaderboard")
        .select("id, name, level, kcal_current, kcal_goal, flower_data")
        .order("level", { ascending: false })
        .limit(5);

      if (!leaderboardData) return;

      const users: UserFlower[] = leaderboardData.map((item) => {
        return {
          id: item.id,
          name: item.name || "",
          level: item.level || 1,
          kcal_current: item.kcal_current || 0,
          kcal_goal: item.kcal_goal || 0,
          flower_data: item.flower_data || null,
        };
      });

      setUsersData(users);
      const newGrid = buildGrid(users);
      setGrid(newGrid);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen bg-black flex items-center justify-center p-8 gap-12 ${pixelify.className}`}
    >
      <div className="flex flex-col gap-2 items-start">
        <button
          onClick={() => router.push("/")}
          className="text-white text-xl font-bold cursor-pointer"
        >
          ← Back to home
        </button>
        <div className="relative border-4 border-white p-4 rounded-xl bg-black shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BOARD_W}, 10px)`,
              gap: "2px",
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-[10px] h-[10px] flip-dot-wrapper"
                >
                  <div className={`flip-dot ${cell ? "is-flipped" : ""}`}>
                    <div className="flip-dot-face flip-dot-front" />
                    <div className="flip-dot-face flip-dot-back" />
                  </div>
                </div>
              ))
            )}
          </div>
          {usersData.slice(0, 4).map((user, index) => {
            const firstName = extractFirstName(user);
            const cx = FLOWER_POSITIONS[index];
            if (!cx || !firstName) return null;
            const cellSize = 10;
            const gap = 2;
            const gridLeft = 16;
            const textWidth =
              (String(index + 1).length + 2 + firstName.length) * 6;
            const leftOffset = gridLeft + cx * (cellSize + gap) - textWidth / 2;
            const topOffset = BOARD_H * (cellSize + gap) - 96;
            return (
              <div
                key={`name-${user.id || user.user_id || index}`}
                className="absolute text-white text-xl font-bold whitespace-nowrap"
                style={{
                  left: `${leftOffset}px`,
                  top: `${topOffset}px`,
                  transform: "translateX(0)",
                }}
              >
                {index + 1}. {firstName}
              </div>
            );
          })}
          <div
            className="absolute flex flex-col text-white"
            style={{
              left: `${16 + LEADERBOARD_START_X * 12}px`,
              top: "60px",
            }}
          >
            <h2 className="text-6xl font-bold mb-4">LEADERBOARD</h2>
            <div className="flex flex-col gap-2">
              {usersData.slice(0, 5).map((user, index) => {
                const name = extractFirstName(user) || "???";
                const level = user.level || user.goal_completions || 1;
                return (
                  <div
                    key={`lb-${user.id || user.user_id || index}`}
                    className="flex items-center justify-between gap-8 text-lg"
                  >
                    <span>
                      {index + 1}. {name.substring(0, 10)}
                    </span>
                    <span className="text-gray-400">Lv {level}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
