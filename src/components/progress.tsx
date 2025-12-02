"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

import flower from "@/components/images/flowerimage.png";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

type WeeklyData = {
  day: string;
  protein: number;
};

export default function ProgressPage() {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [view, setView] = useState<"weekly" | "monthly">("weekly"); // current view
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/progress/${view}`);
        const json = await res.json();

        if (!json.week || !json.protein) return;

        const chart = json.week.map((day: string, index: number) => ({
          day,
          protein: json.protein[index],
        }));

        setData(chart);
      } catch (err) {
        console.error(`Failed to load ${view} data:`, err);
      }
    };

    fetchData();
  }, [view]);

  // Calculate dynamic summary
  const consistentThreshold = 50;
  const consistentDays = data.filter(
    (d) => d.protein >= consistentThreshold
  ).length;
  const avgProtein =
    data.reduce((sum, d) => sum + d.protein, 0) / (data.length || 1);

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-white ${pixelifySans.className}`}
    >
      <div className="bg-white w-[375px] h-[700px] hide-scrollbar rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto">
        <div className="flex items-center justify-evenly mb-4 mt-2">
          <button
            onClick={() => router.push("/")}
            className="text-black text-lg font-bold cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-black">Progress & History</h1>
        </div>

        {/* Main Progress Section */}
        <div className="bg-[#A2A2A2] p-6 rounded-3xl shadow-lg flex flex-col gap-4 mb-6 border border-black">
          <div className="mb-4 text-xl font-semibold text-black">
            Your progress
          </div>

          {/* Weekly / Monthly Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-xl border border-black font-bold cursor-pointer ${
                view === "weekly"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setView("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 rounded-xl border border-black font-bold cursor-pointer ${
                view === "monthly"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setView("monthly")}
            >
              Monthly
            </button>
          </div>

          {/* Chart */}
          <div className="w-full h-[200px] min-h-[200px]">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" key={view}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="day"
                    stroke="#000"
                    interval={0}
                    tick={{
                      fontSize: 12,
                      fontFamily: "Sans-serif",
                      fontWeight: "bold",
                      fill: "#000",
                    }}
                  />
                  <YAxis
                    stroke="#000"
                    tick={{
                      fontSize: 16,
                      fontFamily: "Sans-serif",
                      fontWeight: "bold",
                      fill: "#000",
                    }}
                  />
                  <Bar dataKey="protein" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-black text-center">Loading chart...</p>
            )}
          </div>
        </div>

        {/* Recent Meals Box */}
        <div className="bg-[#A2A2A2] rounded-3xl p-5 shadow-md mb-6 border border-black">
          <h2 className="text-xl font-semibold mb-3 text-black">
            Recent meals:
          </h2>
          {data.length > 0 ? (
            <p className="text-sm leading-relaxed text-black font-sans">
              <strong>Summary:</strong>
              <br />
              Consistent Days: {consistentDays}/{data.length} <br />
              Avg Protein: {Math.round(avgProtein)}g
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-black text-center">
              Loading summary...
            </p>
          )}
        </div>

        {/* Clickable Flower */}
        <div className="flex justify-center mt-2 mb-4">
          <button onClick={() => router.push("/")}>
            <Image
              src={flower}
              alt="Flower icon"
              width={90}
              height={90}
              className="cursor-pointer hover:scale-110 transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
