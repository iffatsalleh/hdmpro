"use client";

import React from "react";
import Link from "next/link";
import { Flame, User } from "lucide-react";

interface TopBarProps {
  title?: string;
  streakDays?: number;
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  } | null;
}

export function TopBar({ title = "HDMPro", streakDays = 0, user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md safe-area-top">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-foreground">
            HDM<span className="text-primary">PRO</span>
          </span>
        </Link>
        {title !== "HDMPro" && (
          <>
            <span className="text-border">/</span>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-semibold text-warning border border-warning/20">
          <Flame className="h-3.5 w-3.5 fill-warning text-warning animate-pulse" />
          <span>{streakDays}d</span>
        </div>

        {/* Profile Avatar Button */}
        <Link
          href="/profile"
          title="Profil Ahli"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 overflow-hidden transition-all"
        >
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || "Profil"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-primary uppercase">
              {user?.name ? user.name.charAt(0) : <User className="h-4 w-4" />}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
