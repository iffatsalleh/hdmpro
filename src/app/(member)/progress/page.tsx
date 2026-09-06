import { Card } from "@/components/ui/card";
import { TrendingDown, Calendar, Scale } from "lucide-react";

export default function ProgressPage() {
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
            <span className="text-xl font-bold">-9.6 kg</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Sejak mula HDM</span>
        </Card>

        <Card className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Purata Mingguan</span>
          <div className="flex items-center gap-1.5 text-primary">
            <Scale className="h-4 w-4" />
            <span className="text-xl font-bold">-0.8 kg</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Stabil & konsisten</span>
        </Card>
      </div>

      {/* Chart Placeholder Card */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trend Berat (30 Hari)</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Terakhir: Hari ini</span>
          </div>
        </div>

        {/* Visual Simulated Chart Bars */}
        <div className="flex h-36 items-end justify-between gap-1.5 pt-4 pb-2 border-b border-border/40">
          {[88, 86.5, 85.2, 84.8, 83.5, 82.1, 81.4, 80.2, 79.5, 78.4].map((w, idx) => {
            const heightPercent = Math.max(20, Math.min(100, (w - 70) * 5));
            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/30 to-primary transition-all duration-300 hover:opacity-80"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] text-muted-foreground">H{idx + 1}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>88.0 kg</span>
          <span className="font-semibold text-primary">Sasaran: 72.0 kg</span>
        </div>
      </Card>
    </div>
  );
}
