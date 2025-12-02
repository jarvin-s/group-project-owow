import { supabase } from "./supabaseClient";

export async function logMeal(protein: number) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) return { error: "User not logged in" };

  const { data, error } = await supabase.from("meals").insert([
    {
      user_id: user.id,
      date: new Date(),
      protein,
    },
  ]);

  return { data, error };
}
