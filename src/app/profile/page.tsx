"use client";

import { signOut, useAuth } from "@/lib/auth";
import { Pixelify_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/bottom-navbar";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-200 ${pixelifySans.className}`}
    >
      <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 pb-20">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          Profile
        </h1>

        <div className="flex flex-col items-center gap-6 flex-1">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
            <span className="text-4xl text-white font-bold">
              {user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>

          {/* User info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black">
              {user?.user_metadata?.first_name || "User"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Info cards */}
          <div className="w-full flex flex-col gap-4 mt-4">
            <div className="bg-[#DEDBD8] rounded-2xl p-4">
              <h3 className="text-sm text-gray-600 mb-1">Email</h3>
              <p className="text-black font-medium">{user?.email || "Not set"}</p>
            </div>
            <div className="bg-[#A2A2A2] rounded-2xl p-4">
              <h3 className="text-sm text-gray-700 mb-1">Member since</h3>
              <p className="text-black font-medium">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="mt-auto mb-4 w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}

