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

          <div className="flex flex-row gap-6 text-[#f3f3f3] text-lg justify-center mt-auto">
            <Link href="/">
              <div className="flex flex-col items-center cursor-pointer">
                <HomeIcon />
                <h1>Home</h1>
              </div>
            </Link>
            <Link href="/profile">
              <div className="flex flex-col items-center cursor-pointer">
                <ProfileIcon />
                <h1>Profile</h1>
              </div>
            </Link>

            <div
              className={`flex flex-col items-center cursor-pointer ${
                loggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={loggingOut ? undefined : handleLogout}
            >
              <ProfileIcon />
              <h1>{loggingOut ? "Logging out..." : "Logout"}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomeIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.67 12.1227V13.335H23.0332V25.4577H21.8209V26.67H16.9718V18.1841H9.69818V26.67H4.84909V25.4577H3.63682V13.335H0V12.1227H1.21227V10.9105H2.42455V9.69818H3.63682V8.48591H4.84909V7.27364H6.06136V6.06136H7.27364V4.84909H8.48591V3.63682H9.69818V2.42455H10.9105V1.21227H12.1227V0H14.5473V1.21227H15.7595V2.42455H16.9718V3.63682H18.1841V4.84909H19.3964V6.06136H20.6086V7.27364H21.8209V8.48591H23.0332V9.69818H24.2455V10.9105H25.4577V12.1227H26.67Z"
        fill="#f3f3f3"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="22"
      height="27"
      viewBox="0 0 22 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6667 0H6.66667V2.66667H4V10.6667H6.66667V2.66667H14.6667V0ZM14.6667 10.6667H6.66667V13.3333H14.6667V10.6667ZM14.6667 2.66667H17.3333V10.6667H14.6667V2.66667ZM0 18.6667H2.66667V16H18.6667V18.6667H2.66667V24H18.6667V18.6667H21.3333V26.6667H0V18.6667Z"
        fill="#f3f3f3"
      />
    </svg>
  );
}
