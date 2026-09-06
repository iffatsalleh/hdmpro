import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { createCheckoutSessionAction } from "@/app/actions/subscription";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { success, canceled } = await searchParams;

  async function handleCheckout(formData: FormData) {
    "use server";
    const type = formData.get("planType") as "monthly" | "annual";
    const res = await createCheckoutSessionAction(type);
    if (res.success && res.url) {
      redirect(res.url);
    }
  }

  const features = [
    "Akses 24/7 ke AI Coach Berkuasa HDM",
    "Pangkalan Data RAG Metodologi HDM Rasmi",
    "Log Makanan Pantas Natural Language & Auto-Macros",
    "Log Berat & Analisis Trend Progres Terperinci",
    "Semua Modul Pembelajaran HDM & Video Pelajaran",
    "Sistem Gamifikasi, Lencana Pangkat & Leaderboard",
  ];

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto py-2">
      <div className="text-center flex flex-col items-center gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Langganan HDMPro</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Keahlian Eksklusif HDMPro</h1>
        <p className="text-xs text-muted-foreground max-w-xs">
          Bimbingan AI berterusan dan alatan lengkap untuk menjamin kejayaan diet anda.
        </p>
      </div>

      {success && (
        <div className="rounded-2xl bg-success/15 p-4 text-xs font-semibold text-success border border-success/30 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Pembayaran berjaya! Akaun anda kini aktif dengan akses penuh HDMPro.</span>
        </div>
      )}

      {canceled && (
        <div className="rounded-2xl bg-warning/15 p-3 text-xs text-warning border border-warning/30">
          Pembayaran dibatalkan. Anda boleh melanggan pada bila-bila masa.
        </div>
      )}

      {/* Plan Cards */}
      <div className="flex flex-col gap-4">
        {/* Annual Plan (Recommended) */}
        <Card variant="highlight" className="flex flex-col gap-4 p-5 border-primary/50 relative overflow-hidden">
          <div className="absolute top-3 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Jimat 32%
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-primary tracking-wider">Paling Popular</span>
            <h3 className="text-lg font-bold text-foreground">Pelan Tahunan HDMPro</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black">RM399</span>
              <span className="text-xs text-muted-foreground">/ tahun (~RM33/bulan)</span>
            </div>
          </div>

          <ul className="flex flex-col gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <form action={handleCheckout}>
            <input type="hidden" name="planType" value="annual" />
            <Button type="submit" size="lg" className="w-full mt-2 gap-2 shadow-lg shadow-primary/25">
              <Zap className="h-4 w-4" />
              <span>Langgan Tahunan (RM399)</span>
            </Button>
          </form>
        </Card>

        {/* Monthly Plan */}
        <Card className="flex flex-col gap-4 p-5 border-border">
          <div>
            <h3 className="text-base font-bold text-foreground">Pelan Bulanan HDMPro</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black">RM49</span>
              <span className="text-xs text-muted-foreground">/ bulan</span>
            </div>
          </div>

          <form action={handleCheckout}>
            <input type="hidden" name="planType" value="monthly" />
            <Button type="submit" variant="secondary" size="md" className="w-full">
              Langgan Bulanan (RM49)
            </Button>
          </form>
        </Card>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/80">
        Pembayaran selamat dikuasakan oleh Stripe. Boleh batalkan langganan pada bila-bila masa.
      </p>
    </div>
  );
}
