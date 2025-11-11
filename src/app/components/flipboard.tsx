"use client";

import { useRef, useEffect } from "react";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DOT_SIZE = 8;
const DOT_SPACING = 10;
const COLS = Math.floor(1280 / DOT_SPACING);
const ROWS = Math.floor(720 / DOT_SPACING);

export default function Flipboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<boolean[][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    dotsRef.current = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(false));

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * DOT_SPACING + DOT_SPACING / 2;
        const y = row * DOT_SPACING + DOT_SPACING / 2;

        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
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
