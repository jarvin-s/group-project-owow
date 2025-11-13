import Link from "next/link";

import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function FlowerGarden() {
  return (
    <>
      <div
        className={`flex flex-col items-center justify-center h-screen ${pixelify.className}`}
      >
        <div className="bg-white w-[375px] h-[700px] rounded-[40px] shadow-2xl border-4 border-black flex flex-col p-5 overflow-y-auto">
          <div className="flex items-center justify-center flex-row gap-4">
            <Link href="/">
              <ArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold text-black">Flower Garden</h1>
          </div>
        </div>
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
