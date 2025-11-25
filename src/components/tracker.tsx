"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";


const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Food {
  id: string;
  name: string;
  serving: string;
}

interface TrackerProps {
  mealType?: string;
}

interface PopularFood {
  id: number;
  name: string;
  serving: string;
  calories: number;
  image: string;
  bgColor: string;
  buttonColor: string;
}

const CALORIES_PER_FOOD = 250;
const STORAGE_KEY = "dailyCalories";
const COMPLETIONS_KEY = "goalCompletions";
const DAILY_GOAL = 1800;

const popularFoods: PopularFood[] = [
  {
    id: 1,
    name: "Orange juice",
    serving: "1 serving, 100ml",
    calories: 250,
    image: "/food1.png",
    bgColor: "bg-[#DEDBD8]",
    buttonColor: "bg-[#A2A2A2]",
  },
  {
    id: 2,
    name: "Apple slices",
    serving: "1/2 cup, 88g",
    calories: 250,
    image: "/food2.png",
    bgColor: "bg-[#A2A2A2]",
    buttonColor: "bg-[#DEDBD8]",
  },
  {
    id: 3,
    name: "Bread, white",
    serving: "1 slice, 28g",
    calories: 250,
    image: "/bread.png",
    bgColor: "bg-[#DEDBD8]",
    buttonColor: "bg-[#A2A2A2]",
  },
  {
    id: 4,
    name: "Milk 2%",
    serving: "1 serving, 100ml",
    calories: 250,
    image: "/milk.png",
    bgColor: "bg-[#A2A2A2]",
    buttonColor: "bg-[#DEDBD8]",
  },
];

export default function Tracker({ mealType = "breakfast" }: TrackerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  // Stores logged foods for THIS meal
  const [loggedFoods, setLoggedFoods] = useState<string[]>([]);

  // Load saved foods for this mealType
  useEffect(() => {
    const key = `foods_${mealType}`;
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    setLoggedFoods(stored);
  }, [mealType]);

  const checkGoalCompletion = (calories: number) => {
    if (calories >= DAILY_GOAL) {
      const completions = parseInt(
        localStorage.getItem(COMPLETIONS_KEY) || "0",
        10
      );
      localStorage.setItem(COMPLETIONS_KEY, (completions + 1).toString());
      window.dispatchEvent(new Event("levelUpdated"));

      localStorage.setItem(STORAGE_KEY, "0");
      window.dispatchEvent(new Event("caloriesUpdated"));
    }
  };

  // UPDATED — now saves food name + serving
  const addCalories = (foodName?: string, serving?: string) => {
    const currentCalories = parseInt(
      localStorage.getItem(STORAGE_KEY) || "0",
      10
    );
    const newCalories = currentCalories + CALORIES_PER_FOOD;

    localStorage.setItem(STORAGE_KEY, newCalories.toString());
    window.dispatchEvent(new Event("caloriesUpdated"));
    checkGoalCompletion(newCalories);

    // Save food
    if (foodName) {
      const formatted = serving
        ? `${foodName} • ${serving}`
        : foodName;

      const key = `foods_${mealType}`;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");

      stored.push(formatted);

      localStorage.setItem(key, JSON.stringify(stored));
      setLoggedFoods(stored);
    }

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const mealNames: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  const mealName = mealNames[mealType.toLowerCase()] || "Breakfast";

  const currentDate = useMemo(() => {
    const date = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    }`;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentCalories = parseInt(
        localStorage.getItem(STORAGE_KEY) || "0",
        10
      );
      checkGoalCompletion(currentCalories);
    }
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
        .or(`name.ilike.${term}%,name.ilike.% ${term}%`);

      if (!error) setResults(data);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-200 p-4 ${pixelify.className}`}
    >
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto hide-scrollbar">

        {/* Back button */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <button
            onClick={() => router.push("/tracker")}
            className="text-black text-lg font-bold cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-base text-black">{currentDate}</h1>
        </div>

        <div className="w-full mb-4">
          <div className="bg-black py-6 flex flex-col justify-center items-center rounded-3xl gap-4">
            <h1 className="text-base text-white w-[90%]">{mealName}</h1>

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

          {/* Popular foods */}
          {search.length === 0 && (
            <>
              <h1 className="text-2xl text-black w-[90%] mt-4">Popular</h1>

              {popularFoods.map((food) => (
                <div key={food.id} className="w-full mt-5 mb-10">
  <div
    className={`${food.bgColor} rounded-[1.875rem] w-full h-28 mt-3 flex items-center relative px-3`}
  >
    <Image
      src={food.image}
      alt={food.name}
      width={90}
      height={90}
      className="rounded-lg"
    />

    <div className="flex flex-col mb-10">
      <h1 className="text-[1.2rem] text-black">{food.name}</h1>
      <p className="text-sm text-black">{food.serving}</p>
    </div>

    <div className="flex flex-col ml-7">
      <h1 className="text-[2rem] text-black">{food.calories}</h1>
      <p className="text-[1.2rem] text-black mt-[-9px]">kcal</p>
    </div>

    <button
      onClick={() => addCalories(food.name, food.serving)}
      className={`w-12 h-10 cursor-pointer ${food.buttonColor} rounded-[0.9375rem] flex items-center justify-center absolute right-8 -bottom-5 shadow-[0_8px_4px_rgba(0,0,0,0.30)]`}
    >
      <span className="text-2xl text-black">+</span>
    </button>
  </div>
</div>

              ))}
            </>
          )}
        </div>

        {/* Search Results */}
        {search.length > 0 && (
          <div className="w-full mt-4">
            <h1 className="text-[1.2rem] text-black mb-2">Results</h1>

            {results.length > 0 ? (
              results.map((item, index) => {
                const isEven = index % 2 === 0;
                const buttonColor = isEven ? "bg-[#A2A2A2]" : "bg-[#DEDBD8]";
                const rowBgColor = isEven ? "bg[#DEDBD8]" : "bg-[#A2A2A2]";

                return (
                  <div
                    key={item.id}
                    className={`text-sm text-black flex items-center justify-between ${
                      isEven ? "bg-[#DEDBD8]" : "bg-[#A2A2A2]"
                    } rounded-[0.9375rem] p-3 mb-3 h-20`}
                  >
                    <div>
                      <p className="text-[1.3rem]">{item.name}</p>
                      <p>{item.serving}</p>
                    </div>

                    {/* UPDATED — passes name + serving */}
                    <button
                      className={`cursor-pointer w-10 h-9 ${
                        buttonColor
                      } rounded-[0.9375rem] flex items-center justify-center shadow-[0_8px_4px_rgba(0,0,0,0.30)]`}
                      onClick={() =>
                        addCalories(item.name, item.serving)
                      }
                    >
                      <span className="text-xl text-black">+</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-black text-center mt-4 text-sm">
                No results...
              </p>
            )}
          </div>
        )}

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-black border-4 border-white rounded-2xl px-8 py-6 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-3xl text-white font-bold">+</span>
                <div>
                  <p className="text-xl text-white font-bold">
                    {CALORIES_PER_FOOD} calories
                  </p>
                  <p className="text-sm text-white">added!</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
