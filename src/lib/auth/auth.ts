import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { userRepository } from "@/repositories/user.repository";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const providers: any[] = [
  // 1. Manual Email & Password
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const user = await userRepository.findByEmail(parsed.data.email);
      if (!user || !user.password) return null;

      const passwordsMatch = await bcrypt.compare(parsed.data.password, user.password);
      if (!passwordsMatch) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    },
  }),
];

// 2. Google OAuth (Hanya jika GOOGLE_CLIENT_ID & SECRET diisi di persekitaran pelayan)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "f68a78627b4b1db3c19e59178ad0b8b584736fdf5c76dbfb2215c13e51240ffb",
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Cari atau cipta akaun pengguna dalam pangkalan data MySQL
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Ahli HDM",
                image: user.image,
                role: "MEMBER",
                profile: {
                  create: {
                    calorieTarget: 2000,
                    proteinTarget: 150,
                    onboardingCompleted: false,
                  },
                },
                streak: {
                  create: {
                    currentStreak: 1,
                  },
                },
              },
            });
          }

          user.id = dbUser.id;
          (user as any).role = dbUser.role;
          return true;
        } catch (err) {
          console.error("Ralat pendaftaran Google Sign-in:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});
