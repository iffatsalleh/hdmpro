import { prisma } from "@/lib/db/prisma";
import type { UserProfile } from "@prisma/client";

export class ProfileRepository {
  async getProfile(userId: string): Promise<UserProfile | null> {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  }

  async updateProfile(
    userId: string,
    data: Partial<Omit<UserProfile, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<UserProfile> {
    return prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

export const profileRepository = new ProfileRepository();
