"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import {
  BOARD_W,
  BOARD_H,
  USER_POSITIONS,
  buildGrid,
  extractFirstName,
  UserFlower,
} from "@/lib/flipboardUtils";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function FlipBoard() {
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0))
  );
  const [usersData, setUsersData] = useState<UserFlower[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: leaderboardData } = await supabase
        .from("leaderboard")
        .select("id, name, level, kcal_current, kcal_goal, flower_data")
        .order("id", { ascending: true })
        .limit(4);

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
        {usersData.map((user, index) => {
          const firstName = extractFirstName(user);
          const cx = USER_POSITIONS[index];
          if (!cx || !firstName) return null;

          const cellSize = 10;
          const gap = 2;
          const gridLeft = 16;
          const textWidth =
            (String(index + 1).length + 2 + firstName.length) * 6; // account for "n. "
          const leftOffset = gridLeft + cx * (cellSize + gap) - textWidth / 2;
          const topOffset = BOARD_H * (cellSize + gap) + 6;

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
      </div>

      <div className="text-white w-80">
        <h1 className="text-5xl font-bold mb-8 tracking-widest border-b-4 border-white pb-4">
          LEADERBOARD
        </h1>

        <div className="flex flex-col gap-6">
          {usersData.length === 0 ? (
            <p className="text-gray-500 animate-pulse">Scanning Garden...</p>
          ) : (
            usersData.map((user, index) => (
              <div
                key={user.id || user.user_id || index}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl text-gray-400">#{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-bold uppercase">
                      {user.name || user.first_name || "Unknown"}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Level {user.level || user.goal_completions || 1}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl block">
                    {user.kcal_current || user.daily_calories || 0}
                    <span className="text-xs text-gray-500 ml-1">kcal</span>
                  </span>
                  <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((user.kcal_current || user.daily_calories || 0) /
                            (user.kcal_goal || user.daily_calories_goal || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
