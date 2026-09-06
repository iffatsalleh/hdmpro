import { Card } from "@/components/ui/card";
import { TrendingDown, Calendar, Scale, PlusCircle } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { weightRepository } from "@/repositories/weight.repository";
import { profileRepository } from "@/repositories/profile.repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let logs: any[] = [];
  let profile: any = null;

  if (userId) {
    try {
      logs = await weightRepository.getWeightHistory(userId, 14);
      profile = await profileRepository.getProfile(userId);
    } catch (err) {
      console.error("Ralat memuat data progres:", err);
    }
  }

  // Susun mengikut turutan tarikh menaik untuk graf
  const sortedLogs = [...logs].reverse();
  const hasLogs = sortedLogs.length > 0;

  const startingWeight = profile?.startingWeight || (hasLogs ? sortedLogs[0].weight : 0);
  const currentWeight = hasLogs ? sortedLogs[sortedLogs.length - 1].weight : (profile?.currentWeight || 0);
  const targetWeight = profile?.targetWeight || 0;

  const totalLost = startingWeight > 0 && currentWeight > 0 ? Number((startingWeight - currentWeight).toFixed(1)) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Graf & Analitik Progres</h1>
        <p className="text-xs text-muted-foreground">Prestasi penurunan berat dan konsistensi diet anda.</p>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Jumlah Berat Turun</span>
          <div className="flex items-center gap-1.5 text-success">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xl font-bold">
              {hasLogs ? `${totalLost > 0 ? `-${totalLost}` : `${totalLost}`} kg` : "-- kg"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {hasLogs ? "Sejak mula HDM" : "Belum mula"}
          </span>
        </Card>

        <Card className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Berat Semasa</span>
          <div className="flex items-center gap-1.5 text-primary">
            <Scale className="h-4 w-4" />
            <span className="text-xl font-bold">
              {currentWeight > 0 ? `${currentWeight} kg` : "-- kg"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {targetWeight > 0 ? `Sasaran: ${targetWeight} kg` : "Belum ada sasaran"}
          </span>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trend Berat ({sortedLogs.length} Rekod)
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{hasLogs ? "Aktif" : "Tiada rekod"}</span>
          </div>
        </div>

        {hasLogs ? (
          <>
            {/* Visual Real Chart Bars */}
            <div className="flex h-36 items-end justify-between gap-1.5 pt-4 pb-2 border-b border-border/40">
              {sortedLogs.map((log, idx) => {
                const minWeight = Math.min(...sortedLogs.map((l) => l.weight)) - 2;
                const maxWeight = Math.max(...sortedLogs.map((l) => l.weight)) + 2;
                const range = maxWeight - minWeight || 1;
                const heightPercent = Math.max(15, Math.min(100, Math.round(((log.weight - minWeight) / range) * 100)));

                return (
                  <div key={log.id || idx} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[8px] text-muted-foreground">{log.weight}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary/30 to-primary transition-all duration-300 hover:opacity-80"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">R{idx + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mula: {startingWeight} kg</span>
              <span className="font-semibold text-primary">
                {targetWeight > 0 ? `Sasaran: ${targetWeight} kg` : `Terkini: ${currentWeight} kg`}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-secondary/30 border border-dashed border-border/80 gap-3">
            <Scale className="h-8 w-8 text-muted-foreground/50" />
            <div>
              <p className="text-xs font-semibold text-foreground">Belum ada rekod berat badan</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                Log berat badan pertama anda di Dashboard atau melalui AI Coach untuk mula membina graf kemajuan.
              </p>
            </div>
            <Link href="/dashboard">
              <Button size="sm" variant="secondary" className="gap-1 text-xs">
                <PlusCircle className="h-3.5 w-3.5 text-primary" />
                <span>Log Berat di Dashboard</span>
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
