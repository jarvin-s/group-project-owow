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

const getCurrentLevel = (completions: number): Flower => {
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

interface UserFlower {
  user_id: string;
  first_name: string;
  goal_completions: number;
  daily_calories: number;
  daily_calories_goal: number;
  flower: Flower;
}

/**
 * Calculate which frame to show based on daily calories progress
 * Each frame represents 16.6667% (1/6) of the daily goal
 */
const getFrameFromCalories = (
  dailyCalories: number,
  dailyGoal: number,
  totalFrames: number
): number => {
  if (dailyGoal === 0) return 0;
  const progress = dailyCalories / dailyGoal;
  const frameProgress = progress / (1 / 6);
  const frameIndex = Math.floor(frameProgress);
  return Math.min(Math.max(frameIndex, 0), totalFrames - 1);
};

export default function Flipboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userFlowers, setUserFlowers] = useState<UserFlower[]>([]);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase.from("leaderboard").select("id, name");
      if (data) setEntries(data);
    }
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    async function fetchUserFlowers() {
      const { data, error } = await supabase
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

      if (error) {
        console.error("Error fetching user flowers:", error);
        return;
      }

      if (data) {
        const flowers: UserFlower[] = data
          .map((item: unknown) => {
            const progressItem = item as {
              user_id: string;
              goal_completions: number;
              daily_calories: number;
              daily_calories_goal: number;
              users: { first_name: string } | { first_name: string }[] | null;
            };

            const usersData = Array.isArray(progressItem.users)
              ? progressItem.users[0]
              : progressItem.users;
            const first_name = usersData?.first_name || "";

            if (!first_name) return null;

            const flower = getCurrentLevel(progressItem.goal_completions || 0);

            return {
              user_id: progressItem.user_id,
              first_name: first_name,
              goal_completions: progressItem.goal_completions || 0,
              daily_calories: progressItem.daily_calories || 0,
              daily_calories_goal: progressItem.daily_calories_goal || 2000,
              flower: flower,
            };
          })
          .filter(
            (item: UserFlower | null): item is UserFlower => item !== null
          );

        setUserFlowers(flowers);
      }
    }
    fetchUserFlowers();
  }, []);

  useEffect(() => {
    const handleLevelUpdate = async () => {
      const { data, error } = await supabase
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

      if (!error && data) {
        const flowers: UserFlower[] = data
          .map((item: unknown) => {
            const progressItem = item as {
              user_id: string;
              goal_completions: number;
              daily_calories: number;
              daily_calories_goal: number;
              users: { first_name: string } | { first_name: string }[] | null;
            };

            const usersData = Array.isArray(progressItem.users)
              ? progressItem.users[0]
              : progressItem.users;
            const first_name = usersData?.first_name || "";

            if (!first_name) return null;

            const flower = getCurrentLevel(progressItem.goal_completions || 0);

            return {
              user_id: progressItem.user_id,
              first_name: first_name,
              goal_completions: progressItem.goal_completions || 0,
              daily_calories: progressItem.daily_calories || 0,
              daily_calories_goal: progressItem.daily_calories_goal || 2000,
              flower: flower,
            };
          })
          .filter(
            (item: UserFlower | null): item is UserFlower => item !== null
          );

        setUserFlowers(flowers);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        handleLevelUpdate();
      }
    };

    window.addEventListener("levelUpdated", handleLevelUpdate);
    document.addEventListener("visibilitychange", handleVisibility);

    const channel = supabase
      .channel("user_progress_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_progress",
        },
        () => {
          handleLevelUpdate();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("levelUpdated", handleLevelUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
      supabase.removeChannel(channel);
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

      ctx.fillStyle = "#222";
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x = col * DOT_SPACING + DOT_SPACING / 2;
          const y = row * DOT_SPACING + DOT_SPACING / 2;
          ctx.beginPath();
          ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const flowersPerRow = 2;
      const flowerSpacingX = 300;
      const flowerSpacingY = 200;
      const flowerStartX = 150;
      const flowerStartY = 100;

      userFlowers.slice(0, 4).forEach((userFlower, index) => {
        const row = Math.floor(index / flowersPerRow);
        const col = index % flowersPerRow;
        const flowerX = flowerStartX + col * flowerSpacingX;
        const flowerY = flowerStartY + row * flowerSpacingY;
        const flowerColOffset = Math.floor(flowerX / DOT_SPACING);
        const flowerRowOffset = Math.floor(flowerY / DOT_SPACING);

        ctx.fillStyle = "#fff";
        const currentFrame = getFrameFromCalories(
          userFlower.daily_calories,
          userFlower.daily_calories_goal,
          userFlower.flower.length
        );
        for (let flowerRow = 0; flowerRow < 12; flowerRow++) {
          for (let flowerCol = 0; flowerCol < 12; flowerCol++) {
            if (userFlower.flower[currentFrame][flowerRow][flowerCol] === 1) {
              const canvasRow = flowerRowOffset + flowerRow;
              const canvasCol = flowerColOffset + flowerCol;
              if (
                canvasRow >= 0 &&
                canvasRow < ROWS &&
                canvasCol >= 0 &&
                canvasCol < COLS
              ) {
                const x = canvasCol * DOT_SPACING + DOT_SPACING / 2;
                const y = canvasRow * DOT_SPACING + DOT_SPACING / 2;
                ctx.beginPath();
                ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        const flowerBottomY = flowerY + 12 * DOT_SPACING + 30;
        const flowerCenterX = flowerX + (10 * DOT_SPACING) / 2;

        ctx.font = "bold 30px 'Pixelify Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";
        ctx.fillText(userFlower.first_name, flowerCenterX, flowerBottomY);
      });

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
  }, [userFlowers, entries]);

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
