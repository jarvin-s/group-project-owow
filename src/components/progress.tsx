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

export default function ProgressPage() {
  const [weekly, setWeekly] = useState<{ day: string; protein: number }[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/progress/weekly")
      .then((res) => res.json())
      .then((data) => {
        const chart = data.week.map((day: string, index: number) => ({
          day,
          protein: data.protein[index],
        }));
        setWeekly(chart);
      });
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen bg-white ${pixelifySans.className}`}
    >
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto">
        <h1 className="text-4xl font-bold text-black mb-6">
          Progress & History
        </h1>

        {/* Main Progress Section */}
        <div className="bg-[#A2A2A2] p-6 rounded-3xl shadow-lg flex flex-col gap-4 mb-6">
          <div className="mb-4 text-lg font-semibold text-black">
            Your progress:
          </div>

          <div className="flex gap-4 mb-4">
            <button className="bg-white border border-black px-4 py-2 rounded-xl text-black">
              Weekly
            </button>
            <button className="bg-white border border-black px-4 py-2 rounded-xl text-black">
              Monthly
            </button>
          </div>

          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <XAxis dataKey="day" stroke="#000" />
                <YAxis stroke="#000" />
                <Bar dataKey="protein" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Meals Box */}
        <div className="bg-[#A2A2A2] rounded-3xl p-5 shadow-md mb-6 border border-black">
          <h2 className="text-xl font-semibold mb-3 text-black">
            Recent meals:
          </h2>
          <p className="text-sm leading-relaxed text-black">
            <strong>Summary:</strong>
            <br />
            Consistent Days: 3/7 <br />
            Avg Protein: 70g/day
          </p>
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
