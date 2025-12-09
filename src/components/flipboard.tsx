"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import {
  BOARD_H,
  FLOWER_POSITIONS,
  LEADERBOARD_START_X,
  CELL_SIZE,
  GAP,
  buildGrid,
  extractFirstName,
  renderGridToCanvas,
  getCanvasDimensions,
  UserFlower,
} from "@/lib/flipboardUtils";
import { useRouter } from "next/navigation";
import BottomNavbar from "./bottom-navbar";
import { useAuth } from "@/lib/auth";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function FlipBoard() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [usersData, setUsersData] = useState<UserFlower[]>([]);
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
  });

  const renderCanvas = useCallback((grid: number[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderGridToCanvas(ctx, grid);
  }, []);

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
      renderCanvas(newGrid);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [renderCanvas]);

  return (
    <div
      className={`min-h-screen bg-black flex items-center justify-center p-8 gap-12 ${pixelify.className}`}
    >
      <div className="flex flex-col gap-2 items-start">
        {user && (
          <button
            onClick={() => router.push("/")}
            className="text-white text-xl font-bold cursor-pointer"
          >
            ← Back to home
          </button>
        )}
        {!user && (
          <button
            onClick={() => router.push("/sign-in")}
            className="text-white text-xl font-bold cursor-pointer"
          >
            ← Back to Sign In
          </button>
        )}
        <div className="relative border-4 border-white p-4 rounded-xl bg-black shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="block"
          />
          {usersData.slice(0, 4).map((user, index) => {
            const firstName = extractFirstName(user);
            const cx = FLOWER_POSITIONS[index];
            if (!cx || !firstName) return null;
            const gridLeft = 16;
            const textWidth =
              (String(index + 1).length + 2 + firstName.length) * 6;
            const leftOffset =
              gridLeft + cx * (CELL_SIZE + GAP) - textWidth / 2;
            const topOffset = BOARD_H * (CELL_SIZE + GAP) - 96;
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
      {user && <BottomNavbar />}
    </div>
  );
}
