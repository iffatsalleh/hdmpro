import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "f68a78627b4b1db3c19e59178ad0b8b584736fdf5c76dbfb2215c13e51240ffb",
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isMemberRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/coach") ||
        pathname.startsWith("/progress") ||
        pathname.startsWith("/modul") ||
        pathname.startsWith("/rank") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/subscription") ||
        pathname.startsWith("/admin");

      const isAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      // Halang sesiapa yang belum login dari masuk ke halaman ahli
      if (isMemberRoute) {
        if (isLoggedIn) return true;
        return false; // NextAuth automatik lencongkan ke pages.signIn ("/login")
      }

      // Jika sudah login dan buka login/register, bawa ke dashboard
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
};
