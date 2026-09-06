"use server";

import { revalidatePath } from "next/cache";
import { weightService } from "@/services/weight.service";
import { auth } from "@/lib/auth/auth";

export async function logWeightAction(formData: FormData) {
  try {
    const session = await auth();
    // For demo/development without strict auth requirement, fallback or use session user
    const userId = session?.user?.id || "demo-member-id";

    const weightStr = formData.get("weight") as string;
    const notes = (formData.get("notes") as string) || undefined;

    const weight = parseFloat(weightStr);
    if (isNaN(weight)) {
      return { success: false, error: "Sila masukkan angka berat yang sah." };
    }

    const log = await weightService.logWeight({
      userId,
      weight,
      notes,
      source: "MANUAL",
    });

    revalidatePath("/dashboard");
    revalidatePath("/progress");

    return { success: true, data: log };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ralat merekod berat badan.",
    };
  }
}
