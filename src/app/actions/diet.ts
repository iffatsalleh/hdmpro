"use server";

import { revalidatePath } from "next/cache";
import { dietService } from "@/services/diet.service";
import { auth } from "@/lib/auth/auth";
import type { MealType } from "@prisma/client";

export async function logFoodAction(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-member-id";

    const mealType = (formData.get("mealType") as MealType) || "OTHER";
    const description = (formData.get("description") as string)?.trim();
    const calories = parseInt(formData.get("calories") as string, 10) || 0;
    const protein = parseFloat(formData.get("protein") as string) || 0;
    const notes = (formData.get("notes") as string)?.trim() || undefined;

    if (!description) {
      return { success: false, error: "Penerangan makanan diperlukan." };
    }

    const log = await dietService.logFood({
      userId,
      mealType,
      description,
      calories,
      protein,
      notes,
      source: "MANUAL",
    });

    revalidatePath("/dashboard");

    return { success: true, data: log };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ralat merekod makanan.",
    };
  }
}
