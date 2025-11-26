"use client";

import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export default function SignIn() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${pixelifySans.className}`}
    >
      <div className="bg-[#0f0f0f] w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-white flex flex-col p-5 overflow-y-auto">
        <h1 className="text-4xl font-bold text-center text-white">FlowerMe</h1>
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="w-full bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6">Sign In</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <p className="text-sm text-black hover:underline text-right cursor-pointer">
                  Forgot password?
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full px-4 cursor-pointer py-2 bg-[#0f0f0f] text-white font-semibold rounded-full hover:bg-[#0f0f0f]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <p className="text-sm text-black text-center">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
