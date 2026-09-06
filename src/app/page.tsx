import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-center max-w-sm">
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
          Bukan sekadar penjejak kalori. Platform penjejakan progres dan bimbingan AI pintar khusus untuk pejuang HDM.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 flex w-full flex-col gap-3">
          <Link href="/dashboard" className="w-full">
            <Button size="lg" className="w-full gap-2">
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="secondary" size="md" className="w-full">
              Log Masuk Akaun
            </Button>
          </Link>
        </div>

        {/* Motivation note */}
        <div className="mt-12 flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <Flame className="h-4 w-4 text-warning fill-warning" />
          <span>Disiplin Membina Hasil Sebenar.</span>
        </div>
      </div>
    </div>
  );
}
