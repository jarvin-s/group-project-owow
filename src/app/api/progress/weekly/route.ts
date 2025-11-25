import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // must be server-side
  );

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 6);

  const { data, error } = await supabase
    .from("meals")
    .select("date, protein, user_id")
    .gte("date", start.toISOString())
    .lte("date", today.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const week = ["M", "T", "W", "T", "F", "S", "S"];
  const totals = Array(7).fill(0);

  data.forEach((meal) => {
    const d = new Date(meal.date);
    const index = (d.getDay() + 6) % 7; // Monday = 0
    totals[index] += meal.protein;
  });

  return NextResponse.json({
    week,
    protein: totals,
  });
}
