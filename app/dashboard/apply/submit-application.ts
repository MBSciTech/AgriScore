"use server"

import { createCreditApplication } from "@/app/actions/credit-application"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitApplication(formData: FormData) {
  try {
    const userId = formData.get("userId") as string

    if (!userId) {
      throw new Error("User ID is required")
    }

    const application = {
      user_id: userId,
      loan_amount: Number(formData.get("loan-amount")),
      loan_purpose: formData.get("loan-purpose") as string,
      loan_term: Number(formData.get("loan-term")),
      loan_description: formData.get("loan-description") as string,
      farm_name: formData.get("farm-name") as string,
      farm_size: Number(formData.get("farm-size")),
      farm_location: formData.get("farm-location") as string,
      primary_crop: formData.get("primary-crop") as string,
      farming_experience: Number(formData.get("farming-experience")),
      previous_yield: Number(formData.get("previous-yield")),
      status: "pending",
    }

    await createCreditApplication(application)

    revalidatePath("/dashboard")
    redirect("/dashboard?success=application-submitted")
  } catch (error) {
    console.error("Error submitting application:", error)
    redirect("/dashboard/apply?error=submission-failed")
  }
}

