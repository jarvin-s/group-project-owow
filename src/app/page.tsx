"use client";

import { useAuth, signOut } from "@/lib/auth";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.refresh();
    } catch (err) {
      console.error("Error logging out:", err);
    }
    setLoggingOut(false);
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-screen ${pixelifySans.className}`}
      >
        <h1 className="text-2xl font-bold">{user?.email ?? "Guest"}</h1>
        <div className="bg-[#0f0f0f] w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-white flex flex-col p-5 overflow-y-auto">
          <h1 className="text-4xl font-bold text- text-white mb-8">Welcome</h1>
          {user && (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mb-6 bg-white text-black font-bold py-2 px-6 rounded-xl shadow border border-black transition hover:bg-gray-200 self-end"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          )}
          <div className="flex flex-col gap-4">
            <Link href="/tracker">
              <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Track Calories
                </h2>
              </div>
            </Link>
            <Link href="/flipboard">
              <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Flipboard
                </h2>
              </div>
            </Link>
            <Link href="/flower-garden">
              <div className="bg-white rounded-2xl p-12 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Flower Garden
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
