import { moduleRepository, ModuleRepository } from "@/repositories/module.repository";
import { prisma } from "@/lib/db/prisma";

export class ModuleService {
  constructor(private repo: ModuleRepository = moduleRepository) {}

  async getMemberModules(userId: string) {
    return this.repo.getPublishedModulesWithProgress(userId);
  }

  async getModuleDetails(slug: string, userId: string) {
    const mod = await this.repo.getModuleBySlug(slug, userId);
    if (!mod) return null;

    const lessons = mod.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      slug: l.slug,
      content: l.content,
      videoUrl: l.videoUrl,
      duration: l.duration,
      isCompleted: l.progress.length > 0 && l.progress[0].completed,
    }));

    return {
      id: mod.id,
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      lessons,
    };
  }

  async completeLesson(userId: string, lessonId: string) {
    const progress = await this.repo.markLessonComplete(userId, lessonId);

    // Award +25 XP for completing lesson
    await prisma.xPTransaction.create({
      data: {
        userId,
        amount: 25,
        type: "COMPLETE_LESSON",
        referenceId: lessonId,
        description: "Menyelesaikan pelajaran HDM",
      },
    });

    return progress;
  }
}

export const moduleService = new ModuleService();
