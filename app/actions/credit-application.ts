"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type CreditApplication = {
  id?: string
  user_id: string
  loan_amount: number
  loan_purpose: string
  loan_term: number
  loan_description?: string
  farm_name?: string
  farm_size?: number
  farm_location?: string
  primary_crop?: string
  farming_experience?: number
  previous_yield?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export async function getCreditApplications(userId: string) {
  const { data, error } = await supabase
    .from("credit_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching credit applications:", error)
    return []
  }

  return data as CreditApplication[]
}

export async function getCreditApplication(id: string) {
  const { data, error } = await supabase.from("credit_applications").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching credit application:", error)
    return null
  }

  return data as CreditApplication
}

export async function createCreditApplication(application: CreditApplication) {
  const { data, error } = await supabase.from("credit_applications").insert([application]).select()

  if (error) {
    console.error("Error creating credit application:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/applications")
  return data[0] as CreditApplication
}

export async function updateCreditApplication(application: Partial<CreditApplication> & { id: string }) {
  const { data, error } = await supabase
    .from("credit_applications")
    .update(application)
    .eq("id", application.id)
    .select()

  if (error) {
    console.error("Error updating credit application:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/applications")
  return data[0] as CreditApplication
}

export async function deleteCreditApplication(id: string) {
  const { error } = await supabase.from("credit_applications").delete().eq("id", id)

  if (error) {
    console.error("Error deleting credit application:", error)
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/applications")
  return true
}

