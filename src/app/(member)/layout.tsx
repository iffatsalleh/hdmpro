import React from "react";
import { TopBar } from "@/components/ui/top-bar";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <TopBar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 sm:px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
