"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { signIn } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const authError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let displayError = error;
  if (!displayError && authError) {
    if (authError === "Configuration") {
      displayError = "Konfigurasi Google Sign-In belum lengkap di pelayan (Google Client ID & Secret diperlukan).";
    } else if (authError === "OAuthSignin" || authError === "OAuthCallbackError") {
      displayError = "Gagal menyambung ke akaun Google. Sila gunakan pendaftaran emel atau cuba lagi.";
    } else {
      displayError = "Terdapat ralat semasa memproses log masuk. Sila cuba lagi.";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);
      if (res?.error) {
        setError("Emel atau kata laluan tidak tepat.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setLoading(false);
      setError("Ralat semasa menyambung ke pelayan.");
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-6 border-border shadow-xl">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-black tracking-tight">
          HDM<span className="text-primary">PRO</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Log masuk ke akaun penjejakan Hardcore Diet Mastery anda
        </p>
      </div>

      {registered && (
        <div className="rounded-xl bg-success/15 p-3 text-xs text-success border border-success/30 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Akaun berjaya didaftarkan! Sila log masuk di bawah.</span>
        </div>
      )}

      {displayError && (
        <div className="rounded-xl bg-danger/10 p-3 text-xs text-danger border border-danger/20">
          {displayError}
        </div>
      )}

      {/* Pilihan 1: Google OAuth (Gmail) */}
      <GoogleSignInButton text="Log Masuk dengan Google (Gmail)" />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">atau emel</span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      {/* Pilihan 2: Borang Kredensial Manual */}
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <Input
          label="Emel"
          name="email"
          type="email"
          placeholder="nama@email.com"
          required
        />
        <Input
          label="Kata Laluan"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-border bg-input" />
            Ingat saya
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Lupa kata laluan?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" isLoading={loading}>
          Log Masuk
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Belum ada akaun?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar Sekarang
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-muted-foreground">Memuatkan...</div>}>
      <LoginForm />
    </Suspense>
  );
}
