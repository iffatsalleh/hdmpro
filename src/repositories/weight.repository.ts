import { prisma } from "@/lib/db/prisma";
import type { WeightLog, LogSource } from "@prisma/client";

export class WeightRepository {
  async createWeightLog(data: {
    userId: string;
    weight: number;
    notes?: string;
    source?: LogSource;
    date?: Date;
    time?: string;
  }): Promise<WeightLog> {
    return prisma.$transaction(async (tx) => {
      const log = await tx.weightLog.create({
        data: {
          userId: data.userId,
          weight: data.weight,
          notes: data.notes,
          source: data.source ?? "MANUAL",
          date: data.date ?? new Date(),
          time: data.time,
        },
      });

      // Update current weight in user profile
      await tx.userProfile.upsert({
        where: { userId: data.userId },
        update: { currentWeight: data.weight },
        create: {
          userId: data.userId,
          currentWeight: data.weight,
          startingWeight: data.weight,
        },
      });

      return log;
    });
  }

  async getLatestWeight(userId: string): Promise<WeightLog | null> {
    return prisma.weightLog.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });
  }

  async getWeightHistory(userId: string, limit = 30): Promise<WeightLog[]> {
    return prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
  }
}

export const weightRepository = new WeightRepository();
