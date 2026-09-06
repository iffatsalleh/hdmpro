import { prisma } from "@/lib/db/prisma";

export class RankRepository {
  async getUserXP(userId: string): Promise<number> {
    const agg = await prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return agg._sum.amount ?? 0;
  }

  async getUserStreak(userId: string) {
    return prisma.streak.findUnique({
      where: { userId },
    });
  }

  async getLeaderboard(limit = 10) {
    // Group XP transactions by user
    const xpTotals = await prisma.xPTransaction.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: "desc" },
      },
      take: limit,
    });

    const userIds = xpTotals.map((x) => x.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        image: true,
        streak: {
          select: { currentStreak: true },
        },
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return xpTotals.map((x, index) => {
      const user = userMap.get(x.userId);
      return {
        rank: index + 1,
        userId: x.userId,
        name: user?.name || "Ahli HDM",
        xp: x._sum.amount ?? 0,
        streak: user?.streak?.currentStreak ?? 0,
      };
    });
  }
}

export const rankRepository = new RankRepository();
