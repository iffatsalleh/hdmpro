import React from "react";
import { TopBar } from "@/components/ui/top-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <TopBar user={session.user} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 sm:px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
