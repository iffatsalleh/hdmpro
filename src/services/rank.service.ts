import { rankRepository, RankRepository } from "@/repositories/rank.repository";

export interface UserRankData {
  totalXP: number;
  badge: string;
  currentStreak: number;
  leaderboard: Array<{
    rank: number;
    userId: string;
    name: string;
    xp: number;
    streak: number;
    badge: string;
    isCurrent: boolean;
  }>;
}

export class RankService {
  constructor(private repo: RankRepository = rankRepository) {}

  getBadgeForXP(xp: number): string {
    if (xp >= 5000) return "HDM Master";
    if (xp >= 3000) return "HDM Elite";
    if (xp >= 1500) return "HDM Warrior";
    if (xp >= 500) return "HDM Challenger";
    return "HDM Recruit";
  }

  async getRankDashboard(userId: string): Promise<UserRankData> {
    const totalXP = await this.repo.getUserXP(userId);
    const streak = await this.repo.getUserStreak(userId);
    const leaderboardRaw = await this.repo.getLeaderboard(10);

    const leaderboard = leaderboardRaw.map((item) => ({
      ...item,
      badge: this.getBadgeForXP(item.xp),
      isCurrent: item.userId === userId,
    }));

    return {
      totalXP,
      badge: this.getBadgeForXP(totalXP),
      currentStreak: streak?.currentStreak ?? 0,
      leaderboard,
    };
  }
}

export const rankService = new RankService();
