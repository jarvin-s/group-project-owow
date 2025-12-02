import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// --- FORCED GEOMETRIC VARIETY ---
// Since 13x13 is small, we force specific shapes so they look different.
const FLOWER_SHAPES = [
  "A 5-POINTED STAR shape",
  "A SQUARE block shape",
  "A DIAMOND (Rhombus) shape",
  "An 'X' shape with thick diagonal petals",
  "A CROSS (+) shape",
  "A TRIANGLE pointing UP",
  "A HEART shape",
  "A RING / DONUT shape (Hollow center)",
  "A CHECKERBOARD pattern",
  "A RANDOM abstract glitch shape"
];

export async function POST(req: Request) {
  try {
    const { employeeId, level } = await req.json();

    // 1. Calculate which shape to use based on the level
    // Level 7 -> Index 0 (Star)
    // Level 8 -> Index 1 (Square)
    // ...
    const styleIndex = (level - 7) % FLOWER_SHAPES.length;
    // Safety check to ensure we always pick a valid shape
    const selectedShape = FLOWER_SHAPES[Math.abs(styleIndex)];

    console.log(`Generating Level ${level} for User ${employeeId} -> Force Shape: ${selectedShape}`);

    // 2. Use High Temperature for Variety
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-002",
        generationConfig: {
            temperature: 1.0, // High creativity
        }
    });
    
    // 3. The Strict "Anti-Boring" Prompt
    const prompt = `
      You are a pixel artist creating a tiny 13x13 icon.
      Generate a binary JSON 2D array (13 rows, 13 columns).
      
      MANDATORY GOAL: Draw ${selectedShape}.
      
      STRICT RULES:
      1. IGNORE standard circular flower shapes.
      2. Draw EXACTLY the shape described above.
      3. It must be SYMMETRICAL and CENTERED.
      4. Use 1 for ON, 0 for OFF.
      5. Return ONLY the raw JSON array.
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const flowerData = JSON.parse(text);

    // 4. Save to Database
    const { error } = await supabase
      .from('leaderboard')
      .update({ flower_data: flowerData })
      .eq('id', employeeId);

    if (error) throw error;

    return NextResponse.json({ success: true, shape: selectedShape });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate flower" }, { status: 500 });
  }
}