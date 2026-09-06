import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nama mestilah sekurang-kurangnya 2 aksara."),
  email: z.string().email("Format emel tidak sah."),
  password: z.string().min(6, "Kata laluan mestilah sekurang-kurangnya 6 aksara."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Maklumat tidak sah.",
        },
        { status: 400 }
      );
    }

    const user = await userService.registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error("Ralat pendaftaran:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Ralat semasa mendaftar akaun.",
      },
      { status: 400 }
    );
  }
}
