import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles, LogIn } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let session = null;
  try {
    session = await auth();
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("Session fetch error on home page:", err);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center max-w-sm w-full">
        {/* Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hardcore Diet Mastery Pro</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          HDM<span className="text-primary">PRO</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Platform penjejakan diet hibrid dan bimbingan AI pintar khusus untuk pejuang HDM.
        </p>

        {session?.user ? (
          /* Jika pengguna sudah log masuk */
          <div className="mt-8 flex w-full flex-col gap-3">
            <Link href="/dashboard" className="w-full">
              <Button size="lg" className="w-full gap-2 font-bold">
                <span>Teruskan ke Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Log masuk sebagai <span className="font-semibold text-foreground">{session.user.name || session.user.email}</span>
            </p>
          </div>
        ) : (
          /* Jika pengguna belum mendaftar/log masuk: 2 Pilihan Utama */
          <div className="mt-8 flex w-full flex-col gap-3">
            {/* Pilihan 1: LOG MASUK */}
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full gap-2 font-bold tracking-wide">
                <LogIn className="h-4 w-4" />
                <span>LOG MASUK</span>
              </Button>
            </Link>

            {/* Pilihan 2: LOG GUNA GOOGLE */}
            <GoogleSignInButton text="LOG GUNA GOOGLE" />

            {/* Pautan Daftar Akaun Baru di bawah */}
            <div className="mt-4 pt-3 border-t border-border/50 text-center text-xs text-muted-foreground">
              Belum ada akaun?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Daftar Akaun Baru
              </Link>
            </div>
          </div>
        )}

        {/* Motivation note */}
        <div className="mt-10 flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <Flame className="h-4 w-4 text-warning fill-warning" />
          <span>Disiplin Membina Hasil Sebenar.</span>
        </div>
      </div>
    </div>
  );
}
