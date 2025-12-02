"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import { flowers } from "./flowers"; // Your static flowers file

// Initialize the pixel font
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const BOARD_W = 84;
const BOARD_H = 28;
// Center positions for the 4 flowers on the grid
const USER_POSITIONS = [11, 32, 53, 74];

export default function FlipBoard() {
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0))
  );
  
  // We store the user data here to display in the text list
  const [usersData, setUsersData] = useState<any[]>([]);

  // --- FLOWER LOGIC ---
  const getFlowerShape = (user: any) => {
    const lvl = user.level || 1;
    // 1. Static Levels 1-6
    if (lvl <= 6) {
      // @ts-ignore
      const staticFrames = flowers[`level_${lvl}`];
      if (staticFrames && staticFrames.length > 0) {
        return staticFrames[staticFrames.length - 1];
      }
    } 
    // 2. AI Levels 7+
    if (lvl > 6 && user.flower_data) {
      return user.flower_data;
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch top 4 users
      const { data: users, error } = await supabase
  .from("leaderboard")
  .select("*")
  .order("id")
  .limit(4);

console.log("🔥 Supabase ERROR:", error);
console.log("🔥 Supabase DATA:", users);


      if (!users) return;

      // Update the text list state
      setUsersData(users);

      // --- DRAWING THE GRID ---
      const g = Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0));
      const groundY = BOARD_H - 4;

      users.forEach((user, index) => {
        const cx = USER_POSITIONS[index]; 
        if (!cx) return;

        // A. POT
        for (let x = cx - 3; x <= cx + 3; x++) if(g[groundY]) g[groundY][x] = 1;
        for (let x = cx - 4; x <= cx + 4; x++) if(g[groundY - 1]) g[groundY - 1][x] = 1;
        for (let x = cx - 5; x <= cx + 5; x++) if(g[groundY - 2]) g[groundY - 2][x] = 1;
        for (let x = cx - 4; x <= cx + 4; x++) if(g[groundY - 3]) g[groundY - 3][x] = 1;
        if(g[groundY - 2]) {
            g[groundY - 2][cx - 6] = 1;
            g[groundY - 2][cx + 6] = 1;
        }

        // B. STEM
        let progress = 0;
        if (user.kcal_goal > 0) {
            progress = Math.min(Math.max(user.kcal_current / user.kcal_goal, 0), 1);
        }
        const maxStemH = 8;
        const stemH = Math.floor(progress * maxStemH);

        for (let i = 0; i < stemH; i++) {
            if(g[groundY - 4 - i]) g[groundY - 4 - i][cx] = 1;
        }

        // C. FLOWER
        const flowerGrid = getFlowerShape(user);
        if (flowerGrid) {
            const rows = flowerGrid.length;    
            const cols = flowerGrid[0].length; 
            const visualStemH = Math.max(stemH, 2); 
            const topY = groundY - 4 - visualStemH - Math.floor(rows / 2); 
            const leftX = cx - Math.floor(cols / 2);

            for(let r=0; r < rows; r++) {
                for(let c=0; c < cols; c++) {
                    if (flowerGrid[r] && flowerGrid[r][c] === 1) {
                         const y = topY + r;
                         const x = leftX + c;
                         if (g[y] && g[y][x] !== undefined) g[y][x] = 1;
                    }
                }
            }
        }
      });
      setGrid(g);
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center p-8 gap-12 ${pixelify.className}`}>
      
      {/* LEFT SIDE: THE VISUAL GARDEN (Flip-dot Grid) */}
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
                <div key={`${y}-${x}`} className="w-[10px] h-[10px] flip-dot-wrapper">
                <div className={`flip-dot ${cell ? "is-flipped" : ""}`}>
                    <div className="flip-dot-face flip-dot-front" />
                    <div className="flip-dot-face flip-dot-back" />
                </div>
                </div>
            ))
            )}
        </div>
      </div>

      {/* RIGHT SIDE: THE TEXT LEADERBOARD */}
      <div className="text-white w-80">
        <h1 className="text-5xl font-bold mb-8 tracking-widest border-b-4 border-white pb-4">
          LEADERBOARD
        </h1>
        
        <div className="flex flex-col gap-6">
          {usersData.length === 0 ? (
            <p className="text-gray-500 animate-pulse">Scanning Garden...</p>
          ) : (
            usersData.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-3xl text-gray-400">#{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-bold uppercase">{user.name}</h2>
                    <p className="text-sm text-gray-400">Level {user.level || 1}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xl block">
                    {user.kcal_current}
                    <span className="text-xs text-gray-500 ml-1">kcal</span>
                  </span>
                  <div className="w-20 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                     <div 
                       className="h-full bg-white transition-all duration-500" 
                       style={{ width: `${Math.min((user.kcal_current / user.kcal_goal) * 100, 100)}%` }} 
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