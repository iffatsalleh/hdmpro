import { prisma } from "@/lib/db/prisma";
import type { DietLog, MealType, LogSource } from "@prisma/client";

export interface CreateDietLogInput {
  userId: string;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbohydrates?: number;
  fat?: number;
  notes?: string;
  source?: LogSource;
  date?: Date;
  items?: Array<{
    name: string;
    portion?: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
  }>;
}

export class DietRepository {
  async createDietLog(data: CreateDietLogInput): Promise<DietLog> {
    return prisma.dietLog.create({
      data: {
        userId: data.userId,
        mealType: data.mealType,
        description: data.description,
        calories: data.calories,
        protein: data.protein,
        carbohydrates: data.carbohydrates ?? 0,
        fat: data.fat ?? 0,
        notes: data.notes,
        source: data.source ?? "MANUAL",
        date: data.date ?? new Date(),
        items: data.items && data.items.length > 0
          ? {
              create: data.items.map((i) => ({
                name: i.name,
                portion: i.portion,
                calories: i.calories,
                protein: i.protein,
                carbs: i.carbs ?? 0,
                fat: i.fat ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });
  }

  async getTodayLogs(userId: string, targetDate = new Date()): Promise<DietLog[]> {
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.dietLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: true,
      },
      orderBy: { date: "asc" },
    });
  }

  async getRecentLogs(userId: string, limit = 20): Promise<DietLog[]> {
    return prisma.dietLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
      include: { items: true },
    });
  }
}

export const dietRepository = new DietRepository();
