import { rankService } from "@/services/rank.service";
import { auth } from "@/lib/auth/auth";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Flame, Zap, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RankPage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-member-id";

  let rankData: any = null;
  try {
    rankData = await rankService.getRankDashboard(userId);
  } catch {
    rankData = null;
  }

  if (!rankData) {
    rankData = {
      totalXP: 0,
      badge: "Recruit",
      currentStreak: 0,
      leaderboard: [],
    };
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Kedudukan & Gamifikasi</h1>
        <p className="text-xs text-muted-foreground">Kumpul XP dari konsistensi diet, timbangan, dan pelajaran HDM.</p>
      </div>

      {/* User Rank Card */}
      <Card variant="highlight" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning border border-warning/30">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-warning uppercase tracking-wider">
              {rankData.badge}
            </span>
            <h3 className="text-base font-bold text-foreground">
              {rankData.totalXP.toLocaleString()} XP
            </h3>
            <p className="text-[11px] text-muted-foreground">Berasaskan Lejar Transaksi XP</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs font-bold text-warning">
            <Flame className="h-3.5 w-3.5 fill-warning" />
            <span>{rankData.currentStreak} Hari</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Streak Aktif</span>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Papan Pendahulu Komuniti HDM
        </span>

        {rankData.leaderboard.length > 0 ? (
          <div className="flex flex-col gap-2">
            {rankData.leaderboard.map((u: any) => (
              <div
                key={u.rank}
                className={`flex items-center justify-between rounded-xl p-3 border transition-colors ${
                  u.isCurrent
                    ? "bg-primary/10 border-primary/40"
                    : "bg-secondary/50 border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center text-xs font-bold text-muted-foreground">
                    {u.rank === 1 ? (
                      <Medal className="h-4 w-4 text-warning" />
                    ) : u.rank === 2 ? (
                      <Medal className="h-4 w-4 text-slate-300" />
                    ) : (
                      `#${u.rank}`
                    )}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold ${u.isCurrent ? "text-primary" : "text-foreground"}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{u.badge}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Zap className="h-3.5 w-3.5 text-warning" />
                  <span>{u.xp.toLocaleString()} XP</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-secondary/30 border border-dashed border-border/80 gap-2">
            <Trophy className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs font-semibold text-foreground">Papan Pendahulu Belum Bermula</p>
            <p className="text-[11px] text-muted-foreground max-w-xs">
              Kumpul mata XP pertama anda dengan merekod makanan, menimbang berat, atau menamatkan modul HDM!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
