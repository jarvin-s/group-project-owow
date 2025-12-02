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
  generateFlowerFromLevel,
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
      const { data: progressData } = await supabase
        .from("user_progress")
        .select(
          `
          user_id,
          goal_completions,
          daily_calories,
          daily_calories_goal,
          users!inner(first_name)
        `
        )
        .order("goal_completions", { ascending: false })
        .limit(4);

      if (!progressData) return;

      interface ProgressRow {
        user_id: string;
        goal_completions: number;
        daily_calories: number;
        daily_calories_goal: number;
        users:
          | {
              first_name: string;
            }
          | null
          | {
              first_name: string;
            }[];
      }

      const users: UserFlower[] = progressData.map((item: ProgressRow) => {
        const usersData = Array.isArray(item.users)
          ? item.users[0]
          : item.users;
        return {
          user_id: item.user_id,
          first_name: usersData?.first_name || "",
          goal_completions: item.goal_completions || 0,
          daily_calories: item.daily_calories || 0,
          daily_calories_goal: item.daily_calories_goal || 0,
          flower: generateFlowerFromLevel(item.goal_completions || 1),
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
              key={`name-${user.user_id}`}
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
                key={user.user_id}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl text-gray-400">#{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-bold uppercase">
                      {user.first_name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Level {user.goal_completions || 1}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl block">
                    {user.daily_calories}
                    <span className="text-xs text-gray-500 ml-1">kcal</span>
                  </span>
                  <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((user.daily_calories || 0) /
                            (user.daily_calories_goal || 1)) *
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
