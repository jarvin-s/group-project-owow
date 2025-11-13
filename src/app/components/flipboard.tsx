"use client";

import { useRef, useEffect, useState } from "react";
import { Pixelify_Sans } from "next/font/google";
import { level_1, level_2 } from "./flowers";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DOT_SIZE = 8;
const DOT_SPACING = 10;
const COLS = Math.floor(1280 / DOT_SPACING);
const ROWS = Math.floor(720 / DOT_SPACING);

const CENTER_COL = Math.floor(COLS / 2);
const CENTER_ROW = Math.floor(ROWS / 2);

export default function Flipboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);

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

          const flowerRow = row - (CENTER_ROW - 4);
          const flowerCol = col - (CENTER_COL - 4);

          let isWhite = false;
          if (
            flowerRow >= 0 &&
            flowerRow < 12 &&
            flowerCol >= 0 &&
            flowerCol < 12
          ) {
            isWhite = level_2[frame][flowerRow][flowerCol] === 1;
          }

          ctx.fillStyle = isWhite ? "#fff" : "#222";
          ctx.beginPath();
          ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();
  }, [frame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % level_2.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
