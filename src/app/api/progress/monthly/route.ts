import { createClient } from "@supabase/supabase-js";


interface ProteinRow {
  date: string;
  protein: number;
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("protein_log") 
    .select("date, protein");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!data) {
    return new Response(JSON.stringify({ week: [], protein: [] }), { status: 200 });
  }

  const monthMap: Record<string, number> = {};

  data.forEach((row: ProteinRow) => {
    const date = new Date(row.date);
    const month = date.toLocaleString("default", { month: "short" });
    monthMap[month] = (monthMap[month] || 0) + row.protein;
  });

  const months = Object.keys(monthMap);
  const protein = Object.values(monthMap);

  return new Response(
    JSON.stringify({
      week: months,
      protein,
    }),
    { status: 200 }
  );
}
