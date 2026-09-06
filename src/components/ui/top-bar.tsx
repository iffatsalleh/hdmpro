"use client";

import React from "react";
import Link from "next/link";
import { Flame, Bell } from "lucide-react";

interface TopBarProps {
  title?: string;
  streakDays?: number;
}

export function TopBar({ title = "HDMPro", streakDays = 0 }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md safe-area-top">
      <div className="flex items-center gap-2">
        <span className="text-lg font-black tracking-tight text-foreground">
          HDM<span className="text-primary">PRO</span>
        </span>
        {title !== "HDMPro" && (
          <>
            <span className="text-border">/</span>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-semibold text-warning border border-warning/20">
          <Flame className="h-3.5 w-3.5 fill-warning text-warning animate-pulse" />
          <span>{streakDays}d</span>
        </div>

        {/* Profile / Notifications placeholder */}
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
