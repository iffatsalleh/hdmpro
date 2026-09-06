import { moduleService } from "@/services/module.service";
import { auth } from "@/lib/auth/auth";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, Play, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ModulPage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-member-id";

  let modules: any[] = [];
  try {
    modules = await moduleService.getMemberModules(userId);
  } catch {
    modules = [];
  }

  // Fallback demo modules if DB is not yet populated
  if (modules.length === 0) {
    modules = [
      {
        id: "1",
        title: "Modul 1: Asas & Falsafah Hardcore Diet Mastery",
        slug: "asas-hdm",
        description: "Kefahaman asas mengenai defisit kalori, psikologi diet, dan minda disiplin HDM.",
        totalLessons: 2,
        completedLessons: 1,
        progressPercent: 50,
        isCompleted: false,
      },
      {
        id: "2",
        title: "Modul 2: Kiraan Makro & Sumber Makanan",
        slug: "makro-hdm",
        description: "Cara mengira protein, pemilihan karbohidrat kompleks, dan kawalan lemak.",
        totalLessons: 3,
        completedLessons: 0,
        progressPercent: 0,
        isCompleted: false,
      },
    ];
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Modul Pembelajaran HDM</h1>
        <p className="text-xs text-muted-foreground">Pelajari sains dan metodologi di sebalik diet anda.</p>
      </div>

      <div className="flex flex-col gap-3">
        {modules.map((m: any, idx: number) => (
          <Link key={m.id || idx} href={`/modul/${m.slug}`}>
            <Card className="flex flex-col gap-3 hover:border-primary/40 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Modul {idx + 1}
                  </span>
                </div>

                {m.isCompleted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                    <CheckCircle className="h-3 w-3" /> Selesai
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Play className="h-3 w-3" /> Belajar
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">{m.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{m.completedLessons} / {m.totalLessons} Pelajaran</span>
                  <span className="font-semibold text-primary">{m.progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${m.progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
