import { prisma } from "@/lib/db/prisma";

export class ModuleRepository {
  async getPublishedModulesWithProgress(userId: string) {
    const modules = await prisma.module.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    return modules.map((m) => {
      const totalLessons = m.lessons.length;
      const completedLessons = m.lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].completed
      ).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description,
        totalLessons,
        completedLessons,
        progressPercent,
        isCompleted: totalLessons > 0 && completedLessons === totalLessons,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          slug: l.slug,
          duration: l.duration,
          order: l.order,
          isCompleted: l.progress.length > 0 && l.progress[0].completed,
        })),
      };
    });
  }

  async getModuleBySlug(slug: string, userId: string) {
    return prisma.module.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });
  }

  async markLessonComplete(userId: string, lessonId: string) {
    return prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }
}

export const moduleRepository = new ModuleRepository();
