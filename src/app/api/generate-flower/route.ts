import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// ------------------------------------------------------------
// FLOWER SHAPES + STYLE VARIATIONS
// ------------------------------------------------------------
const BASE_SHAPES = [
  "round flower",
  "wide flower",
  "tall flower",
  "starburst flower",
  "curved petal flower",
  "bloom with arches",
  "soft cloud flower",
  "circular petal ring",
  "triangular petal bloom",
  "asymmetric organic flower"
];

const STYLES = [
  "with hollow petals",
  "with thick petals",
  "with thin petals",
  "with spiral centers",
  "with dotted accents",
  "with broken edges",
  "with double layer petals",
  "with scattered pixels",
  "with uneven petals",
  "with stacked shapes"
];

// ------------------------------------------------------------
// POST — GENERATE FLOWER
// ------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { employeeId, level } = await req.json();

    const base = BASE_SHAPES[level % BASE_SHAPES.length];
    const style = STYLES[(level * 3) % STYLES.length];
    const selectedShape = `${base} ${style}`;

    const noiseSeed =
      ((employeeId * 1234567 + level * 98765 + 4321) % 999999) + 1;

    console.log("🌸 USER:", employeeId, "LEVEL:", level);
    console.log("🌼 SHAPE:", selectedShape);
    console.log("🎲 SEED:", noiseSeed);

    // ------------------------------------------------------------
    // GEMINI MODEL
    // ------------------------------------------------------------
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 1.0 }
    });

    // ------------------------------------------------------------
    // PROMPT
    // ------------------------------------------------------------
    const prompt = `
Return ONLY a 13x13 JSON array containing 0s and 1s.

Draw a new pixel-art flower:
"${selectedShape}"

Rules:
- Center the flower.
- Use 1 for filled pixels, 0 for empty.
- After drawing, flip 6–12 random pixels using seed ${noiseSeed}.
- Do NOT explain anything.
- Output ONLY the JSON array.
`;

    const result = await model.generateContent(prompt);

    if (!result?.response) throw new Error("Empty AI response");

    const raw = result.response.text().trim();
    console.log("🧪 RAW AI OUTPUT:", raw);

    let flowerData;
    try {
      flowerData = JSON.parse(raw);
    } catch (err) {
      console.error("❌ JSON PARSE FAILED:", raw);
      throw new Error("AI output was not valid JSON");
    }

    console.log("🌺 FINAL GRID:", flowerData);

    // ------------------------------------------------------------
    // SAVE TO SUPABASE
    // ------------------------------------------------------------
    const { error } = await supabase
      .from("leaderboard")
      .update({ flower_data: flowerData })
      .eq("id", employeeId);

    if (error) {
      console.error("❌ SUPABASE UPDATE ERROR:", error);
      throw error;
    }

    console.log("✅ SAVED FLOWER FOR USER", employeeId);

    return NextResponse.json({
      success: true,
      shape: selectedShape,
      seed: noiseSeed,
      flowerData
    });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json(
      { error: "Flower generation failed" },
      { status: 500 }
    );
  }
}
