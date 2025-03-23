"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type FarmerProfile = {
  id: string
  first_name: string
  last_name: string
  farm_name?: string
  farm_size?: number
  region?: string
  created_at?: string
  updated_at?: string
}

export async function getFarmerProfile(userId: string) {
  const { data, error } = await supabase.from("farmer_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching farmer profile:", error)
    return null
  }

  return data as FarmerProfile
}

export async function createFarmerProfile(profile: Omit<FarmerProfile, "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("farmer_profiles").insert([profile]).select()

  if (error) {
    console.error("Error creating farmer profile:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  return data[0] as FarmerProfile
}

export async function updateFarmerProfile(profile: Partial<FarmerProfile> & { id: string }) {
  const { data, error } = await supabase.from("farmer_profiles").update(profile).eq("id", profile.id).select()

  if (error) {
    console.error("Error updating farmer profile:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  return data[0] as FarmerProfile
}

