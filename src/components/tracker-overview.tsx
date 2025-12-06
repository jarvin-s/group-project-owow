"use client";

import { useState, useEffect, useMemo } from "react";
import { Pixelify_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDailyCalories, getUserProgress } from "@/lib/userProgress";
import { supabase } from "@/lib/supabaseClient";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Meal {
  id: string;
  name: string;
  icon: string;
}

const meals: Meal[] = [
  { id: "breakfast", name: "Breakfast", icon: "/egg.png" },
  { id: "lunch", name: "Lunch", icon: "/hashbrown.png" },
  { id: "dinner", name: "Dinner", icon: "/burger.png" },
  { id: "snack", name: "Snack", icon: "/popcorn.png" },
];

export default function TrackerOverview() {
  const router = useRouter();
  const [dailyGoal, setDailyGoal] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [mealFoods, setMealFoods] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const foodsByMeal: Record<string, string[]> = {};

    meals.forEach((meal) => {
      const stored = JSON.parse(
        localStorage.getItem(`foods_${meal.id}`) || "[]"
      );
      foodsByMeal[meal.id] = stored;
    });

    setTimeout(() => {
      setMealFoods(foodsByMeal);
    }, 500);
  }, []);

  useEffect(() => {
    async function loadCalories() {
      const calories = await getDailyCalories();
      setTotalCalories(calories);
      const progress = await getUserProgress();
      if (progress) {
        setDailyGoal(progress.daily_calories_goal);
      }
    }
    loadCalories();

    const handleCaloriesUpdate = async () => {
      const updatedCalories = await getDailyCalories();
      setTotalCalories(updatedCalories);
    };

    window.addEventListener("caloriesUpdated", handleCaloriesUpdate);

    const channel = supabase
      .channel("user_progress_calories_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_progress",
        },
        () => {
          handleCaloriesUpdate();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("caloriesUpdated", handleCaloriesUpdate);
      supabase.removeChannel(channel);
    };
  }, [dailyGoal]);

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

  const progressPercentage = Math.round((totalCalories / dailyGoal) * 100);

  const handleMealClick = (mealId: string) => {
    router.push(`/tracker/${mealId}`);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-200 p-4 ${pixelify.className}`}
    >
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push("/")}
            className="text-black text-xl font-bold cursor-pointer"
          >
            ← Back
          </button>
          {/* Date */}
          <div className="text-base text-black mb-2 text-right">
            {currentDate}
          </div>
        </div>

        {/* Daily calories summary */}
        <div className="bg-black rounded-3xl p-6 mb-4">
          <h2 className="text-sm text-white mb-2">Daily calories</h2>
          <h1 className="text-4xl font-bold text-white mb-4">
            {totalCalories} kcal
          </h1>

          <div className="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white flex items-center justify-center"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              {progressPercentage > 10 && (
                <span className="text-xs text-black font-bold">
                  {progressPercentage}%
                </span>
              )}
            </div>

            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white">
              {dailyGoal} kcal
            </span>
          </div>
        </div>

        {/* Meal cards */}
        <div className="flex flex-col gap-9">
          {meals.map((meal, index) => (
            <div
              key={meal.id}
              className={`relative h-28 rounded-[1.875rem] p-4 flex items-center ${
                index % 2 === 0 ? "bg-[#DEDBD8]" : "bg-[#A2A2A2]"
              }`}
              onClick={() => handleMealClick(meal.id)}
            >
              {/* Icon */}
              <div className="w-[90px] h-[90px] mr-4 shrink-0 flex items-center justify-center">
                <Image
                  src={meal.icon}
                  alt={meal.name}
                  width={90}
                  height={90}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Meal info */}
              <div className="flex-1">
                <h3 className="text-[1.2rem] text-black w-full mb-2 leading-tight">
                  {meal.name}
                </h3>

                <p className="text-sm text-black w-full mb-3 leading-tight">
                  {(() => {
                    const items = mealFoods[meal.id] || [];

                    if (items.length === 0) return "No items logged yet";

                    // Clean names (remove servings)
                    const clean = items.map((f) => {
                      let n = f.split("•")[0];
                      n = n.replace(/\d.*$/, "");
                      return n.trim();
                    });

                    if (clean.length <= 2) return clean.join(", ");

                    return `${clean[0]}, ${clean[1]} …`;
                  })()}
                </p>
              </div>

              {/* Add button */}
              <button
                className={`w-12 h-10 rounded-[0.9375rem] flex items-center justify-center absolute right-8 top-24
                  shadow-[0_8px_4px_rgba(0,0,0,0.30)] cursor-pointer ${
                    index % 2 === 0 ? "bg-[#A2A2A2]" : "bg-[#DEDBD8]"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMealClick(meal.id);
                }}
              >
                <span className="text-2xl text-black">+</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
