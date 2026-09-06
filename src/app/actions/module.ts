"use server";

import { revalidatePath } from "next/cache";
import { moduleService } from "@/services/module.service";
import { auth } from "@/lib/auth/auth";

export async function completeLessonAction(lessonId: string, moduleSlug: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-member-id";

    await moduleService.completeLesson(userId, lessonId);

    revalidatePath("/modul");
    revalidatePath(`/modul/${moduleSlug}`);
    revalidatePath("/rank");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Ralat menanda pelajaran selesai.",
    };
  }
}
