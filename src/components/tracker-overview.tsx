"use client";

import { useState, useEffect, useMemo } from "react";
import { Pixelify_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";

const STORAGE_KEY = "dailyCalories";

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
  {
    id: "breakfast",
    name: "Breakfast",
    icon: "/food1.png",
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: "/food2.png",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: "/bread.png",
  },
  {
    id: "snack",
    name: "Snack",
    icon: "/milk.png",
  },
];

export default function TrackerOverview() {
  const router = useRouter();
  const dailyGoal = 1800;

  const [totalCalories, setTotalCalories] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCalories = localStorage.getItem(STORAGE_KEY);
      if (storedCalories) {
        return parseInt(storedCalories, 10);
      } else {
        localStorage.setItem(STORAGE_KEY, "0");
        return 0;
      }
    }
    return 0;
  });

  useEffect(() => {
    const handleCaloriesUpdate = () => {
      const updatedCalories = parseInt(
        localStorage.getItem(STORAGE_KEY) || "0",
        10
      );
      setTotalCalories(updatedCalories);
      if (updatedCalories == dailyGoal) {
        localStorage.setItem(STORAGE_KEY, "0");
      }
    };

    window.addEventListener("caloriesUpdated", handleCaloriesUpdate);

    return () => {
      window.removeEventListener("caloriesUpdated", handleCaloriesUpdate);
    };
  }, []);

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
        {/* Status bar simulation */}
        <div className="text-xs text-black mb-2">{currentDate}</div>

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
        <div className="flex flex-col gap-3">
          {meals.map((meal, index) => (
            <div
              key={meal.id}
              className={`rounded-3xl p-4 flex items-center ${
                index % 2 === 0 ? "bg-[#DEDBD8]" : "bg-[#A2A2A2]"
              }`}
              onClick={() => handleMealClick(meal.id)}
            >
              {/* Meal icon */}
              <div className="w-16 h-16 mr-4 shrink-0">
                <Image
                  src={meal.icon}
                  alt={meal.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Meal info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-1">
                  {meal.name}
                </h3>
              </div>

              {/* Add button */}
              <button
                className={`px-4 py-2 rounded-xl flex cursor-pointer items-center justify-center shadow-[0_4px_4px_rgba(0,0,0,0.30)] ${
                  index % 2 === 0
                    ? "bg-[#A2A2A2] text-white"
                    : "bg-[#DEDBD8] text-black"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMealClick(meal.id);
                }}
              >
                <span className="text-xs font-bold">ADD FOOD</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
