import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-screen ${pixelifySans.className}`}
      >
        <div className="bg-[#0f0f0f] w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-white flex flex-col p-5 overflow-y-auto">
          <h1 className="text-4xl font-bold text- text-white mb-8">Welcome</h1>
          <div className="flex flex-col gap-4">
            <Link href="/tracker">
              <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Track Calories
                </h2>
              </div>
            </Link>
            <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
              <h2 className="text-2xl font-bold text-black text-center">
                Flower Garden
              </h2>
            </div>
            <Link href="/leaderboard">
              <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Leaderboard
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
