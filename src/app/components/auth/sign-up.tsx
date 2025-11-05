import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

export default function SignUp() {
  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${pixelifySans.className}`}
    >
      <div className="w-[375px] h-[612px] p-10 border-white border-2 rounded-2xl">
        <h1 className="text-4xl font-bold text-center text-white">FlowerMe</h1>
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="w-full bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6">Sign Up</h2>
            <form className="flex flex-col gap-4">
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <p className="text-sm text-black text-center cursor-pointer">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="font-bold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 cursor-pointer py-2 bg-[#0f0f0f] text-white font-semibold rounded-full hover:bg-[#0f0f0f]/80 transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
