import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// ------------------------------------------------------------
// Completely Random, Fully Generated From Scratch
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { employeeId, level } = await req.json();

    const noiseSeed =
      ((employeeId * 912367 + level * 81231 + 777) % 999999) + 1;

    console.log(`🌼 Generating fresh flower | user ${employeeId} | level ${level}`);

    // Load stable working Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 1.0 }
    });

    // ------------------------------------------------------------
    // NEW PROMPT → Creates 100% NEW FLOWER, no diamond, no template
    // ------------------------------------------------------------
    const prompt = `
Return ONLY a 13x13 JSON array of 0s and 1s.

Create a COMPLETELY ORIGINAL pixel-art flower.
It must NOT resemble diamonds, triangles, arrows, or symmetric icons.

Rules:
- Center the flower naturally.
- Use creative, organic, or abstract petal shapes.
- It may include or omit a stem.
- It may be round, chaotic, clustered, asymmetric, ring-like, layered — anything unique.
- Use 1 for filled pixels, 0 for empty.
- Apply random pixel mutations (10–20 toggles) using seed ${noiseSeed}.
- Do NOT return text, labels, comments, or formatting — ONLY the JSON array.
    `;

    // Call Gemini
    const result = await model.generateContent(prompt);
    if (!result?.response) throw new Error("Empty response from AI");

    const raw = result.response.text().trim();
    console.log("🌺 AI RAW OUTPUT:", raw);

    let flowerGrid;
    try {
      flowerGrid = JSON.parse(raw);
    } catch (err) {
      console.error("🚨 JSON Error: ", raw);
      throw new Error("AI returned invalid JSON.");
    }

    // Save in Supabase
    const { error } = await supabase
      .from("leaderboard")
      .update({ flower_data: flowerGrid })
      .eq("id", employeeId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      seed: noiseSeed
    });
  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json(
      { error: "Flower generation failed" },
      { status: 500 }
    );
  }
}
