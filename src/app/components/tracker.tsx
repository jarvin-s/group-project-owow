"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


const DOT_SIZE = 8;
const DOT_SPACING = 10;
const WIDTH = 640;
const HEIGHT = 360;

export default function Page() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visiblePixels = useRef<number>(0);


  const sparklePositions = useRef<{ x: number; y: number }[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showFlower, setShowFlower] = useState(true);
  const sparkleInterval = useRef<NodeJS.Timeout | null>(null);

  //  flower pixel coordinates
  const flowerShape = (() => {
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2 + 20;
    const s = DOT_SPACING;
    const pattern = [
      //  Center
      [0, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1],
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [2, 0], [-2, 0], [0, 2], [0, -2],
      [1, 2], [-1, 2], [1, -2], [-1, -2],
      [2, 1], [-2, 1], [2, -1], [-2, -1],

      //  Inner petals
      [0, -4], [1, -4], [-1, -4],
      [0, 4], [1, 4], [-1, 4],
      [-4, 0], [-4, 1], [-4, -1],
      [4, 0], [4, 1], [4, -1],
      [3, -3], [-3, -3], [3, 3], [-3, 3],
      [2, -4], [-2, -4], [2, 4], [-2, 4],

      //  Outer petals
      [0, -6], [0, -7], [1, -6], [-1, -6],
      [0, 6], [0, 7], [1, 6], [-1, 6],
      [6, 0], [7, 0], [6, 1], [6, -1],
      [-6, 0], [-7, 0], [-6, 1], [-6, -1],
      [5, -4], [4, -5], [3, -6], [2, -6], [1, -5],
      [-5, -4], [-4, -5], [-3, -6], [-2, -6], [-1, -5],
      [5, 4], [4, 5], [3, 6], [2, 6], [1, 5],
      [-5, 4], [-4, 5], [-3, 6], [-2, 6], [-1, 5],

      //  Stem
      [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
      [0, 13], [0, 14], [0, 15], [0, 16], [0, 17], [0, 18],

      //  Left leaf
      [-1, 11], [-2, 10], [-3, 9], [-4, 9], [-5, 10], [-4, 11], [-3, 12], [-2, 13], [-1, 14],

      //  Right leaf
      [1, 11], [2, 10], [3, 9], [4, 9], [5, 10], [4, 11], [3, 12], [2, 13], [1, 14],
    ];

    return pattern.map(([x, y]) => ({
      x: cx + x * s,
      y: cy + y * s,
    }));
  })();


  const drawScene = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

  
    if (showFlower) {
      ctx.fillStyle = "#fff";
      for (let i = 0; i < visiblePixels.current; i++) {
        const p = flowerShape[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

   
    if (showCongrats) {
   
      ctx.fillStyle = "#fff";
      sparklePositions.current.forEach((s) => {
        if (Math.random() > 0.5) {
          ctx.fillRect(s.x, s.y, 3, 3); 
        }
      });

      ctx.font = "bold 36px Pixelify Sans";
      ctx.textAlign = "center";
      ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
      ctx.fillText("CONGRATULATIONS!", WIDTH / 2, HEIGHT / 2);
    }
  };


  const startCelebration = (ctx: CanvasRenderingContext2D) => {
    setShowFlower(false);
    setShowCongrats(true);

    const sparkleCount = 80;
    sparklePositions.current = Array.from({ length: sparkleCount }).map(() => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
    }));

    if (sparkleInterval.current) clearInterval(sparkleInterval.current);

    sparkleInterval.current = setInterval(() => {
      drawScene(ctx);
    }, 120);

    
    setTimeout(() => {
      if (sparkleInterval.current) clearInterval(sparkleInterval.current);
      sparklePositions.current = [];
      setShowCongrats(false);
      setShowFlower(true);
      visiblePixels.current = 0;
      drawScene(ctx);
    }, 3000);
  };


  const handleAddFood = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const addCount = Math.ceil(flowerShape.length / 10);
    visiblePixels.current = Math.min(
      flowerShape.length,
      visiblePixels.current + addCount
    );
    drawScene(ctx);


    if (visiblePixels.current >= flowerShape.length) {
      startCelebration(ctx);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    drawScene(ctx);
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const term = search.trim();
      if (term.length === 0) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .ilike("name", `%${term}%`);

      if (!error && data) {
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-200 gap-8 p-4 ${pixelify.className}`}
    >
      {/* phone display */}
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto">
        <h1 className="text-base text-black mb-4 text-left mt-2">Tue 4 Nov</h1>

        <div className="w-full mb-4">
          <div className="bg-black py-6 flex flex-col justify-center items-center rounded-3xl gap-4">
            <h1 className="text-base text-white w-[90%]">Breakfast</h1>
            <div className="w-[90%]">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-full shadow-sm border">
                <input
                  type="text"
                  placeholder="Search food..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-black placeholder:text-black font-light"
                />
              </div>
            </div>
          </div>

         
          {search.length === 0 && (
            <>
              <h1 className="text-2xl text-black w-[90%] mt-4">Popular</h1>

              {/* Food cart 1 */}
              <div className="w-full mb-4">
                <div className="bg-[#DEDBD8] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/food1.png" alt="Juice" width={90} height={90} className="rounded-lg" />
                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black">Orange juice</h1>
                    <p className="text-sm text-black">1 serving, 100ml</p>
                  </div>
                  <div className="flex flex-col ml-7">
                    <h1 className="text-[2rem] text-black">48</h1>
                    <p className="text-[1.2rem] text-black mt-[-9px]">kcal</p>
                  </div>
                  <button onClick={handleAddFood} className="w-12 h-10 bg-[#A2A2A2] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-md">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>

              {/* Food cart 2 */}
              <div className="w-full mt-9">
                <div className="bg-[#A2A2A2] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/food2.png" alt="Apple slices" width={90} height={90} className="rounded-lg" />
                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black">Apple slices</h1>
                    <p className="text-sm text-black">1/2 cup, 88g</p>
                  </div>
                  <div className="flex flex-col ml-11">
                    <h1 className="text-[2rem] text-black">30</h1>
                    <p className="text-[1.2rem] text-black mt-[-9px]">kcal</p>
                  </div>
                  <button onClick={handleAddFood} className="w-12 h-10 bg-[#DEDBD8] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-md">
                    <span className="text-2xl text-black">+</span>
                  </button>
                </div>
              </div>

              {/* Food cart 3 */}
              <div className="w-full mt-9">
                <div className="bg-[#DEDBD8] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/bread.png" alt="Bread" width={90} height={90} className="rounded-lg" />
                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black">Bread, white</h1>
                    <p className="text-sm text-black">1 slice, 28g</p>
                  </div>
                  <div className="flex flex-col ml-7">
                    <h1 className="text-[2rem] text-black">79</h1>
                    <p className="text-[1.2rem] text-black mt-[-9px]">kcal</p>
                  </div>
                  <button onClick={handleAddFood} className="w-12 h-10 bg-[#A2A2A2] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-md">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>

              {/* Food cart 4 */}
              <div className="w-full mb-4 mt-9">
                <div className="bg-[#A2A2A2] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/milk.png" alt="Milk" width={90} height={90} className="rounded-lg" />
                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black">Milk 2%</h1>
                    <p className="text-sm text-black">1 serving, 100ml</p>
                  </div>
                  <div className="flex flex-col ml-11">
                    <h1 className="text-[2rem] text-black">50</h1>
                    <p className="text-[1.2rem] text-black mt-[-9px]">kcal</p>
                  </div>
                  <button onClick={handleAddFood} className="w-12 h-10 bg-[#DEDBD8] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-md">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live search bar */}
        {search.length > 0 && (
          <div className="w-full mt-4">
            <h1 className="text-[1.2rem] text-black w-full mb-2">Results</h1>
            {results.length > 0 ? (
              results.map((item, index) => {
                const isEven = index % 2 === 0;
                const buttonColor = isEven ? "bg-[#A2A2A2]" : "bg-[#DEDBD8]";
                const rowBgColor = isEven ? "bg-[#DEDBD8]" : "bg-[#A2A2A2]";
                return (
                  <div key={item.id} className={`text-sm text-black flex items-center justify-between ${rowBgColor} rounded-[0.9375rem] p-3 mb-3 h-20`}>
                    <div>
                      <p className="text-[1.3rem]">{item.name}</p>
                      <p>{item.serving}</p>
                    </div>
                    <button
                      onClick={handleAddFood}
                      className={`w-10 h-9 ${buttonColor} rounded-[0.9375rem] flex items-center justify-center shadow-md`}
                    >
                      <span className="text-xl text-black">+</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-black text-center mt-4 text-sm">No results...</p>
            )}
          </div>
        )}
      </div>

     
      <div className="bg-black rounded-2xl shadow-2xl border-4 border-white">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="w-[640px] h-[360px]"
        />
      </div>
    </div>
  );
}
