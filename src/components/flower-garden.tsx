"use client";

import Link from "next/link";

import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import BottomNavbar from "@/components/bottom-navbar";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const level_1 = "levels/level_1.svg";
const level_2 = "levels/level_2.svg";
const level_3 = "levels/level_3.svg";
const level_4 = "levels/level_4.svg";
const level_5 = "levels/level_5.svg";
const level_6 = "levels/level_6.svg";

export default function FlowerGarden() {
  return (
    <>
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${pixelify.className}`}
      >
        <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 pb-20 overflow-y-auto justify-center items-center">
          <div className="flex items-center justify-center flex-row gap-4 mb-10">
            <Link href="/">
              <ArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold text-black">Flower Garden</h1>
          </div>

          <div className="bg-[#a2a2a2] w-[300px] h-[500px] rounded-[40px] shadow-2xl flex flex-col p-5 overflow-y-auto justify-center">
            <h1 className="text-2xl text-white">Levels</h1>
            {/* First row */}
            <div className="flex justify-between mb-4">
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_1} alt="Level 1" width={100} height={100} />
              </div>
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_2} alt="Level 2" width={90} height={90} />
              </div>
            </div>

            {/* Second row */}
            <div className="flex justify-between mb-4">
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_3} alt="Level 3" width={100} height={100} />
              </div>
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_4} alt="Level 4" width={90} height={90} />
              </div>
            </div>

            {/* Third row */}
            <div className="flex justify-between mb-4">
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_5} alt="Level 5" width={90} height={90} />
              </div>
              <div className="bg-[#030303] w-[120px] h-[120px] rounded-lg flex items-center justify-center">
                <Image src={level_6} alt="Level 6" width={90} height={90} />
              </div>
            </div>
          </div>
        </div>
        <BottomNavbar />
      </div>
    </>
  );
}

function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M20 12H4m0 0l6-6m-6 6l6 6"
      />
    </svg>
  );
}
