"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type CreditScore = {
  id?: string
  user_id: string
  total_score: number
  soil_health_score?: number
  weather_risk_score?: number
  past_yields_score?: number
  gis_data_score?: number
  market_trends_score?: number
  created_at?: string
  updated_at?: string
}

export async function getCreditScore(userId: string) {
  const { data, error } = await supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No data found
      return null
    }
    console.error("Error fetching credit score:", error)
    return null
  }

  return data as CreditScore
}

export async function getCreditScoreHistory(userId: string) {
  const { data, error } = await supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching credit score history:", error)
    return []
  }

  return data as CreditScore[]
}

export async function createCreditScore(score: CreditScore) {
  const { data, error } = await supabase.from("credit_scores").insert([score]).select()

  if (error) {
    console.error("Error creating credit score:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  return data[0] as CreditScore
}

export async function updateCreditScore(score: Partial<CreditScore> & { id: string }) {
  const { data, error } = await supabase.from("credit_scores").update(score).eq("id", score.id).select()

  if (error) {
    console.error("Error updating credit score:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  return data[0] as CreditScore
}

