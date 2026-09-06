import React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? <label className="text-xs font-medium text-muted-foreground">{label}</label> : null}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 border border-border transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          {...props}
        />
        {error ? <span className="text-xs text-danger">{error}</span> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
