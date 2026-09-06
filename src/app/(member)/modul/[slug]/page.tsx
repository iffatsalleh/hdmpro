import { moduleService } from "@/services/module.service";
import { auth } from "@/lib/auth/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { completeLessonAction } from "@/app/actions/module";

export const dynamic = "force-dynamic";

interface ModuleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { slug } = await params;
  const session = await auth();
  const userId = session?.user?.id || "demo-member-id";

  let moduleData: any = null;
  try {
    moduleData = await moduleService.getModuleDetails(slug, userId);
  } catch {
    moduleData = null;
  }

  // Fallback demo lessons if module is not yet seeded
  if (!moduleData) {
    moduleData = {
      title: "Modul: Asas & Falsafah Hardcore Diet Mastery",
      description: "Panduan terperinci mengenai metodologi defisit kalori agresif dan minda konsistensi.",
      lessons: [
        {
          id: "lesson-1",
          title: "1. Minda Disiplin & Psikologi HDM",
          content:
            "Diet bukan sekadar menahan lapar; ia adalah pembentukan tabiat baru yang menuntut disiplin harian. Dalam HDM, kita mengutamakan data berstruktur berbanding tekaan semata-mata.",
          duration: 10,
          isCompleted: true,
        },
        {
          id: "lesson-2",
          title: "2. Pengiraan Defisit Kalori Optimum",
          content:
            "Untuk menurunkan berat badan secara konsisten tanpa kehilangan jisim otot, pengambilan protein mesti dijaga minimum 1.6g - 2.0g per kg berat badan semasa defisit.",
          duration: 15,
          isCompleted: false,
        },
      ],
    };
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-2">
        <Link
          href="/modul"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-xs font-semibold text-muted-foreground">Kembali ke Senarai Modul</span>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight">{moduleData.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{moduleData.description}</p>
      </div>

      <div className="flex flex-col gap-4">
        {moduleData.lessons.map((lesson: any, idx: number) => (
          <Card key={lesson.id || idx} className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">Pelajaran {idx + 1}</span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {lesson.duration} min
                </span>
              </div>

              {lesson.isCompleted ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" /> Selesai
                </span>
              ) : null}
            </div>

            <h3 className="text-sm font-bold text-foreground">{lesson.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line bg-secondary/30 p-3 rounded-xl border border-border/40">
              {lesson.content}
            </p>

            {!lesson.isCompleted ? (
              <form
                action={async () => {
                  "use server";
                  await completeLessonAction(lesson.id, slug);
                }}
                className="pt-2"
              >
                <Button type="submit" size="sm" variant="secondary" className="w-full gap-1.5 text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-warning" />
                  <span>Tandakan Selesai (+25 XP)</span>
                </Button>
              </form>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
