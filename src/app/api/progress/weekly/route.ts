import { createClient } from "@supabase/supabase-js";


type ProteinRow = {
  id?: number;
  date: string;
  protein: number;
  user_id?: string | null;
};

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Supabase env variables missing" }),
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  
  const { data, error } = await supabase
    .from("protein_log")
    .select("date, protein");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const rows: ProteinRow[] = data || [];

  
  const weekMap: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  
  rows.forEach((row) => {
    const date = new Date(row.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    if (weekMap[dayName] !== undefined) {
      weekMap[dayName] += row.protein;
    }
  });

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const protein = week.map((day) => weekMap[day]);

  return Response.json({ week, protein });
}
