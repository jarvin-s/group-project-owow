"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Food {
  id: string;
  name: string;
  serving: string;
}

export default function Tracker() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Food[]>([]);

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
        .or(`name.ilike.${term}%,name.ilike.% ${term}%`);

      if (!error) setResults(data);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-200 p-4 ${pixelify.className}`}>
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto">
        
        <h1 className="text-base text-black mb-4 text-left mt-2">
          Tue 4 Nov
        </h1>

        <div className="w-full mb-4">
          <div className="bg-black py-6 flex flex-col justify-center items-center rounded-3xl gap-4">
            <h1 className="text-base text-white w-[90%]">
              Breakfast
            </h1>

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

          {/* it hides the food card when typing in search bar */}
          {search.length === 0 && (
            <>
              <h1 className="text-2xl text-black w-[90%] mt-4">
                Popular
              </h1>

              {/* food card 1 */}
              <div className="w-full mb-4">
                <div className="bg-[#DEDBD8] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/food1.png" alt="Juice" width={90} height={90} className="rounded-lg" />

                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black w-full">Orange juice</h1>
                    <p className="text-sm text-black w-[90%]">1 serving, 100ml</p>
                  </div>

                  <div className="flex flex-col ml-7">
                    <h1 className="text-[2rem] text-black w-full">48</h1>
                    <p className="text-[1.2rem] text-black w-[90%] mt-[-9px]">kcal</p>
                  </div>

                  <button className="w-12 h-10 bg-[#A2A2A2] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-[0_8px_4px_rgba(0,0,0,0.30)]">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>

              {/* food card 2 */}
              <div className="w-full mt-9">
                <div className="bg-[#A2A2A2] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/food2.png" alt="Juice" width={90} height={90} className="rounded-lg" />

                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black w-full">Apple slices</h1>
                    <p className="text-sm text-black w-[90%]">1/2 cup, 88g</p>
                  </div>

                  <div className="flex flex-col ml-11">
                    <h1 className="text-[2rem] text-black w-full">30</h1>
                    <p className="text-[1.2rem] text-black w-[90%] mt-[-9px]">kcal</p>
                  </div>

                  <button className="w-12 h-10 bg-[#DEDBD8] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-[0_8px_4px_rgba(0,0,0,0.30)]">
                    <span className="text-2xl text-black">+</span>
                  </button>
                </div>
              </div>

              {/* food card 3 */}
              <div className="w-full mt-9">
                <div className="bg-[#DEDBD8] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/bread.png" alt="Juice" width={90} height={90} className="rounded-lg" />

                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black w-full">Bread, white</h1>
                    <p className="text-sm text-black w-[90%]">1 slice, 28g</p>
                  </div>

                  <div className="flex flex-col ml-7">
                    <h1 className="text-[2rem] text-black w-full">79</h1>
                    <p className="text-[1.2rem] text-black w-[90%] mt-[-9px]">kcal</p>
                  </div>

                  <button className="w-12 h-10 bg-[#A2A2A2] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-[0_8px_4px_rgba(0,0,0,0.30)]">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>

              {/* food card 4 */}
              <div className="w-full mb-4 mt-9">
                <div className="bg-[#A2A2A2] rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3">
                  <Image src="/milk.png" alt="Juice" width={90} height={90} className="rounded-lg" />

                  <div className="flex flex-col mb-10">
                    <h1 className="text-[1.2rem] text-black w-full">Milk 2%</h1>
                    <p className="text-sm text-black w-full">1 serving, 100ml</p>
                  </div>

                  <div className="flex flex-col ml-11">
                    <h1 className="text-[2rem] text-black w-full">50</h1>
                    <p className="text-[1.2rem] text-black w-[90%] mt-[-9px]">kcal</p>
                  </div>

                  <button className="w-12 h-10 bg-[#DEDBD8] rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-[0_8px_4px_rgba(0,0,0,0.30)]">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 🔍 This will show the food results and it only shows when typing in the search bar */}
        {search.length > 0 && (
          <div className="w-full mt-4">
            {results.length > 0 ? (
              results.map((item) => (
                <div key={item.id} className="border-b py-2 text-sm text-black">
                  <p className="font-bold">{item.name}</p>
                  <p>{item.serving}</p>
                </div>
              ))
            ) : (
              <p className="text-black text-center mt-4 text-sm">No results...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
