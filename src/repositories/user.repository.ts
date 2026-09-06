import { prisma } from "@/lib/db/prisma";
import type { User, UserProfile } from "@prisma/client";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findById(id: string): Promise<(User & { profile: UserProfile | null }) | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async createUser(data: {
    id?: string;
    email: string;
    name?: string;
    password?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        profile: {
          create: {},
        },
        streak: {
          create: {},
        },
      },
    });
  }

  async updateUser(
    id: string,
    data: { name?: string; image?: string; email?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
