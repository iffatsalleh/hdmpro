import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { userRepository } from "@/repositories/user.repository";
import { profileRepository } from "@/repositories/profile.repository";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Sila log masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, state, country, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama penuh diperlukan." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Kemas kini maklumat User
    await userRepository.updateUser(userId, {
      name: name.trim(),
      ...(image ? { image } : {}),
    });

    // Kemas kini maklumat UserProfile
    await profileRepository.updateProfile(userId, {
      phone: phone?.trim() || null,
      state: state?.trim() || null,
      country: country?.trim() || "Malaysia",
      onboardingCompleted: true,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Ralat kemaskini profil API:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Ralat mengemas kini profil." },
      { status: 500 }
    );
  }
}
