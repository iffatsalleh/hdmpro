"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareHeart, TrendingUp, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MAIN_NAV_ITEMS } from "@/config/nav";

const iconMap = {
  dashboard: LayoutDashboard,
  coach: MessageSquareHeart,
  progress: TrendingUp,
  modul: BookOpen,
  rank: Trophy,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-lg safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors duration-150",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200",
                  isActive && "bg-primary/15 text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              </div>
              <span className={cn(isActive && "font-semibold")}>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
