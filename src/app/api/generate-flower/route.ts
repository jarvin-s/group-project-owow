import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Connect to Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { employeeId, level } = await req.json();

    console.log(`Generating flower for ID: ${employeeId}, Level: ${level}`);

    // 1. ASK GEMINI FOR THE FLOWER SHAPE
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a pixel artist creating a 13x13 icon.
    Generate a binary JSON 2D array (13 rows, 13 columns) for a Level ${level} flower bloom.
    
    STRICT RULES:
    1. Output MUST be a single connected shape.
    2. It must be SYMMETRICAL and CENTERED.
    3. It must look like a solid pixel-art flower head.
    4. Do NOT include a stem. Just the bloom.
    5. Use 1 for ON, 0 for OFF.
    6. Return ONLY the raw JSON array.
  `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const flowerData = JSON.parse(text);

    // 2. CREATE THE "REVEAL ORDER" (SHUFFLE)
    // This makes the pixels appear randomly instead of in boring rows
    const revealOrder = [];
    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        if (flowerData[r][c] === 1) {
          revealOrder.push({ r, c });
        }
      }
    }

    // Shuffle the array (Fisher-Yates shuffle)
    for (let i = revealOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [revealOrder[i], revealOrder[j]] = [revealOrder[j], revealOrder[i]];
    }

    // 3. SAVE TO SUPABASE
    // We update the specific user in the 'leaderboard' table
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