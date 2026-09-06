import { dietRepository, DietRepository, CreateDietLogInput } from "@/repositories/diet.repository";
import { prisma } from "@/lib/db/prisma";

export class DietService {
  constructor(private repo: DietRepository = dietRepository) {}

  async logFood(input: CreateDietLogInput) {
    if (!input.description || input.description.trim().length === 0) {
      throw new Error("Penerangan makanan tidak boleh kosong.");
    }

    if (input.calories < 0 || input.protein < 0) {
      throw new Error("Kiraan kalori atau protein tidak sah.");
    }

    const log = await this.repo.createDietLog(input);

    // Record XP (+10 XP for meal log)
    await prisma.xPTransaction.create({
      data: {
        userId: input.userId,
        amount: 10,
        type: "LOG_FOOD",
        description: `Log makanan: ${input.description}`,
      },
    });

    return log;
  }

  async getTodaySummary(userId: string, date = new Date()) {
    const logs = await this.repo.getTodayLogs(userId, date);

    const totals = logs.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbohydrates,
        fat: acc.fat + curr.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      logs,
      totals,
      mealCount: logs.length,
    };
  }
}

export const dietService = new DietService();
