"use server";

import { auth } from "@/lib/auth/auth";
import { progressService } from "@/services/progress.service";
import { prisma } from "@/lib/db/prisma";

export async function getDashboardDataAction() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  try {
    const data = await progressService.getMemberDashboardData(userId);
    const streak = await prisma.streak.findUnique({ where: { userId } });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    return {
      userName: user?.name || "Ahli HDM",
      currentStreak: streak?.currentStreak || 0,
      startingWeight: data.startingWeight,
      currentWeight: data.currentWeight,
      targetWeight: data.targetWeight,
      remainingKg: data.remainingKg,
      lostSoFar: data.lostSoFar,
      progressPercentage: data.progressPercentage,
      calorieTarget: data.calorieTarget,
      proteinTarget: data.proteinTarget,
      todayCalories: data.todayCalories,
      todayProtein: data.todayProtein,
      caloriePercentage: data.caloriePercentage,
      proteinPercentage: data.proteinPercentage,
      todayMeals: data.todayMeals.map((m) => ({
        id: m.id,
        mealType: m.mealType,
        description: m.description,
        calories: m.calories,
        protein: m.protein,
        createdAt: m.createdAt.toISOString(),
      })),
      onboardingCompleted: data.onboardingCompleted,
    };
  } catch (err) {
    console.error("Ralat mendapatkan data dashboard:", err);
    return null;
  }
}
