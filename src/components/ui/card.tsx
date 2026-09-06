import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "highlight";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 transition-all duration-200",
        variant === "default" && "bg-card border border-border/80 shadow-sm",
        variant === "outline" && "border border-border bg-transparent",
        variant === "highlight" && "bg-gradient-to-b from-muted to-card border border-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
