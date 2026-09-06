"use server";

import { revalidatePath } from "next/cache";
import { profileRepository } from "@/repositories/profile.repository";
import { auth } from "@/lib/auth/auth";

export async function saveOnboardingAction(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-member-id";

    const gender = (formData.get("gender") as string) || undefined;
    const age = parseInt(formData.get("age") as string, 10) || undefined;
    const height = parseFloat(formData.get("height") as string) || undefined;
    const startingWeight = parseFloat(formData.get("startingWeight") as string) || undefined;
    const targetWeight = parseFloat(formData.get("targetWeight") as string) || undefined;
    const activityLevel = (formData.get("activityLevel") as string) || undefined;
    const dietGoal = (formData.get("dietGoal") as string) || undefined;

    const profile = await profileRepository.updateProfile(userId, {
      gender,
      age,
      height,
      startingWeight,
      currentWeight: startingWeight,
      targetWeight,
      activityLevel,
      dietGoal,
      onboardingCompleted: true,
    });

    revalidatePath("/dashboard");

    return { success: true, data: profile };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ralat menyimpan onboarding.",
    };
  }
}
