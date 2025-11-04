"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Page() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

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
      

      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5">
        
 
        <h1 className="text-base font-bold mb-6 text-center">
          Tue 4 Nov
        </h1>

  
        <div className="w-full mb-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm border">
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

 
        <div className="w-full overflow-y-auto">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className="border-b py-2 text-sm">
                <p className="font-bold">{item.name}</p>
                <p>{item.serving}</p>
              </div>
            ))
          ) : (
            search.length > 0 && (
              <p className="text-gray-400 text-center mt-4 text-sm">No results...</p>
            )
          )}
        </div>

      </div>
    </div>
  );
}
