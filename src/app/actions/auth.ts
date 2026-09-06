"use server";

import { userService } from "@/services/user.service";
import { signIn } from "@/lib/auth/auth";
import { z } from "zod";
import { AuthError } from "next-auth";

const registerSchema = z.object({
  name: z.string().min(2, "Nama mestilah sekurang-kurangnya 2 aksara."),
  email: z.string().email("Format emel tidak sah."),
  password: z.string().min(6, "Kata laluan mestilah sekurang-kurangnya 6 aksara."),
});

export async function registerAction(formData: FormData) {
  try {
    const rawData = {
      name: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.trim().toLowerCase(),
      password: formData.get("password") as string,
    };

    const parsed = registerSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Maklumat tidak sah.",
      };
    }

    await userService.registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Ralat semasa mendaftar akaun.",
    };
  }
}

export async function loginCredentialsAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (err: any) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { success: false, error: "Emel atau kata laluan tidak tepat." };
        default:
          return { success: false, error: "Ralat semasa log masuk." };
      }
    }
    return {
      success: false,
      error: err.message || "Ralat sistem.",
    };
  }
}
