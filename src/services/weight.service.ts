import { weightRepository, WeightRepository } from "@/repositories/weight.repository";
import { prisma } from "@/lib/db/prisma";
import type { LogSource } from "@prisma/client";

export class WeightService {
  constructor(private repo: WeightRepository = weightRepository) {}

  async logWeight(params: {
    userId: string;
    weight: number;
    notes?: string;
    source?: LogSource;
  }) {
    if (!params.weight || params.weight <= 20 || params.weight >= 350) {
      throw new Error("Bacaan berat tidak sah (mesti antara 20kg - 350kg).");
    }

    const log = await this.repo.createWeightLog(params);

    // Record XP for logging weight (e.g. +10 XP)
    await prisma.xPTransaction.create({
      data: {
        userId: params.userId,
        amount: 10,
        type: "LOG_WEIGHT",
        description: `Log berat badan: ${params.weight} kg`,
      },
    });

    return log;
  }

  async getLatestWeight(userId: string) {
    return this.repo.getLatestWeight(userId);
  }

  async getWeightHistory(userId: string, limit = 30) {
    return this.repo.getWeightHistory(userId, limit);
  }
}

export const weightService = new WeightService();
