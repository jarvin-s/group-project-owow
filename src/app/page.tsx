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
    router.push("/");
    try {
      await signOut();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-screen ${pixelifySans.className}`}
      >
        <div className="bg-[#0f0f0f] w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-white flex flex-col p-5">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            Welcome {user?.user_metadata?.first_name ?? ""}!
          </h1>
          <div className="flex flex-col gap-4 flex-1">
            <Link href="/tracker">
              <div className="bg-white rounded-2xl p-10 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Track Calories
                </h2>
              </div>
            </Link>
            <Link href="/flipboard">
              <div className="bg-white rounded-2xl p-10 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Flipboard
                </h2>
              </div>
            </Link>
            <Link href="/flower-garden">
              <div className="bg-white rounded-2xl p-10 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Flower Garden
                </h2>
              </div>
            </Link>
            <Link href="/progress">
              <div className="bg-white rounded-2xl p-10 shadow-lg cursor-pointer">
                <h2 className="text-2xl font-bold text-black text-center">
                  Progress
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
