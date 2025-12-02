// src/app/api/generate-flower/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// 1. Setup Database Connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 2. Setup AI Connection
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    // Read data sent from the Tracker page
    const { employeeId, level } = await req.json();

    console.log(`Generating flower for User ${employeeId} at Level ${level}...`);

    // 3. Configure the Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
    
    // 4. The Prompt (Strict rules for pixel art)
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
    
    // 5. Ask Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const flowerData = JSON.parse(text);

    // 6. Save the new flower to Supabase
    const { error } = await supabase
      .from('leaderboard')
      .update({ flower_data: flowerData })
      .eq('id', employeeId);

    if (error) throw error;

    console.log("Success! Flower saved to DB.");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("AI Generation Failed:", error);
    return NextResponse.json({ error: "Failed to generate flower" }, { status: 500 });
  }
}