import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { employeeId, level } = await req.json();

    console.log(`Generating flower for ID: ${employeeId}, Level: ${level}`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Return ONLY a 13x13 JSON array containing 0s and 1s.
    Draw a new pixel-art flower that includes a stem and resembles flowers like a tulip, rose, sunflower, etc.

    RULES:
    - Center the flower.
    - Use 1 for filled pixels, 0 for empty.
    - After drawing, flip 6–12 random pixels using seed with thick petals.
    - Do NOT explain anything.
    - Output ONLY the JSON array.
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const flowerData = JSON.parse(text);

    const revealOrder = [];
    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        if (flowerData[r][c] === 1) {
          revealOrder.push({ r, c });
        }
      }
    }

    for (let i = revealOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [revealOrder[i], revealOrder[j]] = [revealOrder[j], revealOrder[i]];
    }

    const { error } = await supabase
      .from('leaderboard')
      .update({
        flower_data: flowerData,
        reveal_order: revealOrder
      })
      .eq('id', employeeId);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Failed to generate flower" }, { status: 500 });
  }
}