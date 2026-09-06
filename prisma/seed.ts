import { PrismaClient, Role, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding HDMPro database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Demo Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@hdmpro.app" },
    update: {},
    create: {
      email: "admin@hdmpro.app",
      name: "HDM Admin",
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          gender: "Lelaki",
          age: 32,
          height: 175,
          startingWeight: 80,
          currentWeight: 75,
          targetWeight: 72,
          onboardingCompleted: true,
        },
      },
    },
  });

  // 2. Create Demo Member
  const member = await prisma.user.upsert({
    where: { email: "member@hdmpro.app" },
    update: {},
    create: {
      email: "member@hdmpro.app",
      name: "Ahmad Albab",
      password: hashedPassword,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      profile: {
        create: {
          gender: "Lelaki",
          age: 28,
          height: 172,
          startingWeight: 88,
          currentWeight: 78.4,
          targetWeight: 72,
          calorieTarget: 2000,
          proteinTarget: 150,
          onboardingCompleted: true,
        },
      },
      streak: {
        create: {
          currentStreak: 8,
          longestStreak: 8,
          lastActivityDate: new Date(),
        },
      },
    },
  });

  // 3. Create Sample Module
  await prisma.module.upsert({
    where: { slug: "asas-hdm" },
    update: {},
    create: {
      title: "Modul 1: Asas & Falsafah Hardcore Diet Mastery",
      slug: "asas-hdm",
      description: "Kefahaman asas mengenai defisit kalori, psikologi diet, dan minda disiplin HDM.",
      order: 1,
      status: "PUBLISHED",
      lessons: {
        create: [
          {
            title: "Pengenalan Hardcore Diet Mastery",
            slug: "pengenalan-hdm",
            content: "Selamat datang ke Hardcore Diet Mastery...",
            order: 1,
            duration: 10,
          },
          {
            title: "Prinsip Defisit Kalori Berkesan",
            slug: "prinsip-defisit-kalori",
            content: "Defisit kalori adalah hukum termodinamik asas...",
            order: 2,
            duration: 15,
          },
        ],
      },
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
