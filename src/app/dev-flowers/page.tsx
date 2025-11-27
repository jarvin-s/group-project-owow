"use client";

import { flowers, FlowerFrame } from "@/components/flowers";

const CELL_SIZE = 16;

function FrameGrid({ frame }: { frame: FlowerFrame }) {
  return (
    <div
      className="inline-block border border-slate-500 bg-black"
      style={{ lineHeight: 0 }}
    >
      {frame.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell ? "white" : "black",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function DevFlowersPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Flower Frames Dev View</h1>

      <div className="space-y-10">
        {Object.entries(flowers).map(([key, flower]) => (
          <section key={key} className="space-y-3">
            <h2 className="text-xl font-medium capitalize">{key}</h2>
            <div className="flex flex-wrap gap-4 items-start">
              {flower.map((frame, index) => (
                <div key={index} className="space-y-1 text-center">
                  <div className="text-xs text-slate-400">Frame {index + 1}</div>
                  <FrameGrid frame={frame} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
