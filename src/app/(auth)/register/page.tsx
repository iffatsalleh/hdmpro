"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await registerAction(formData);

    setLoading(false);
    if (res.success) {
      router.push("/login?registered=true");
    } else {
      setError(res.error || "Gagal mendaftar akaun.");
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-6 border-border shadow-xl">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-black tracking-tight">
          HDM<span className="text-primary">PRO</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Bina akaun baru dan mulakan transformasi diet anda
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-danger/10 p-3 text-xs text-danger border border-danger/20">
          {error}
        </div>
      )}

      {/* Pilihan 1: Google OAuth (Gmail) */}
      <GoogleSignInButton text="Daftar dengan Google (Gmail)" />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">atau emel</span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      {/* Pilihan 2: Borang Manual */}
      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
        <Input
          label="Nama Penuh"
          name="name"
          type="text"
          placeholder="cth: Razak Ahmad"
          required
        />
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
          placeholder="Minimum 6 aksara"
          required
        />

        <Button type="submit" size="lg" className="w-full mt-2" isLoading={loading}>
          Daftar Akaun
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Sudah ada akaun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log Masuk
        </Link>
      </div>
    </Card>
  );
}
