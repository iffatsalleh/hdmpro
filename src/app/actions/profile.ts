"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { userRepository } from "@/repositories/user.repository";
import { profileRepository } from "@/repositories/profile.repository";

export async function getUserProfileAction() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await userRepository.findById(session.user.id);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    image: user.image || "",
    phone: user.profile?.phone || "",
    state: user.profile?.state || "",
    country: user.profile?.country || "Malaysia",
    onboardingCompleted: user.profile?.onboardingCompleted || false,
  };
}

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sila log masuk terlebih dahulu." };
    }

    const userId = session.user.id;
    const name = (formData.get("name") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim() || null;
    const state = (formData.get("state") as string)?.trim() || null;
    const country = (formData.get("country") as string)?.trim() || "Malaysia";
    const image = (formData.get("image") as string)?.trim() || undefined;

    if (!name) {
      return { success: false, error: "Nama penuh diperlukan." };
    }

    // Kemaskini maklumat User
    await userRepository.updateUser(userId, {
      name,
      ...(image ? { image } : {}),
    });

    // Kemaskini maklumat UserProfile
    await profileRepository.updateProfile(userId, {
      phone,
      state,
      country,
      onboardingCompleted: true,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    console.error("Ralat kemaskini profil:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ralat mengemas kini profil.",
    };
  }
}
