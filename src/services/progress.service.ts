import { profileRepository, ProfileRepository } from "@/repositories/profile.repository";
import { weightRepository, WeightRepository } from "@/repositories/weight.repository";
import { dietRepository, DietRepository } from "@/repositories/diet.repository";

export class ProgressService {
  constructor(
    private profileRepo: ProfileRepository = profileRepository,
    private weightRepo: WeightRepository = weightRepository,
    private dietRepo: DietRepository = dietRepository
  ) {}

  async getMemberDashboardData(userId: string) {
    const profile = await this.profileRepo.getProfile(userId);
    const latestWeightLog = await this.weightRepo.getLatestWeight(userId);
    const todayDiet = await this.dietRepo.getTodayLogs(userId);

    const startingWeight = profile?.startingWeight ?? 0;
    const currentWeight = latestWeightLog?.weight ?? profile?.currentWeight ?? startingWeight;
    const targetWeight = profile?.targetWeight ?? currentWeight;

    // Progress percentage calculation
    let progressPercentage = 0;
    const totalToLose = startingWeight - targetWeight;
    const lostSoFar = startingWeight - currentWeight;

    if (totalToLose > 0) {
      progressPercentage = Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)));
    } else if (totalToLose < 0) {
      // Bulking / gaining weight
      const totalToGain = targetWeight - startingWeight;
      const gainedSoFar = currentWeight - startingWeight;
      progressPercentage = Math.min(100, Math.max(0, Math.round((gainedSoFar / totalToGain) * 100)));
    }

    const remainingKg = Math.abs(currentWeight - targetWeight);

    // Today's macros
    const todayCalories = todayDiet.reduce((sum, item) => sum + item.calories, 0);
    const todayProtein = todayDiet.reduce((sum, item) => sum + item.protein, 0);

    const calorieTarget = profile?.calorieTarget ?? 2000;
    const proteinTarget = profile?.proteinTarget ?? 150;

    return {
      startingWeight,
      currentWeight,
      targetWeight,
      remainingKg: Number(remainingKg.toFixed(1)),
      lostSoFar: Number(lostSoFar.toFixed(1)),
      progressPercentage,
      calorieTarget,
      proteinTarget,
      todayCalories,
      todayProtein,
      caloriePercentage: Math.min(100, Math.round((todayCalories / calorieTarget) * 100)),
      proteinPercentage: Math.min(100, Math.round((todayProtein / proteinTarget) * 100)),
      todayMeals: todayDiet,
      onboardingCompleted: profile?.onboardingCompleted ?? false,
    };
  }
}

export const progressService = new ProgressService();
