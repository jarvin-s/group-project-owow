"use client";

import { supabase } from "./supabaseClient";

export interface UserProgress {
  id: string;
  user_id: string;
  flower_count: number;
  level: number;
  daily_calories_goal: number;
  daily_calories: number;
  goal_completions: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get user progress for the current authenticated user
 */
export async function getUserProgress(): Promise<UserProgress | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }

  return data;
}

/**
 * Update daily calories for the current user
 */
export async function updateDailyCalories(
  calories: number
): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return false;
  }

  const { error } = await supabase
    .from("user_progress")
    .update({
      daily_calories: calories,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error updating daily calories:", error);
    return false;
  }

  return true;
}

/**
 * Increment goal completions and reset daily calories
 */
export async function incrementGoalCompletions(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return false;
  }

  const progress = await getUserProgress();
  if (!progress) {
    return false;
  }

  const { error } = await supabase
    .from("user_progress")
    .update({
      goal_completions: progress.goal_completions + 1,
      daily_calories: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error incrementing goal completions:", error);
    return false;
  }

  return true;
}

/**
 * Get goal completions count for the current user
 */
export async function getGoalCompletions(): Promise<number> {
  const progress = await getUserProgress();
  return progress?.goal_completions ?? 0;
}

/**
 * Get daily calories for the current user
 */
export async function getDailyCalories(): Promise<number> {
  const progress = await getUserProgress();
  return progress?.daily_calories ?? 0;
}

