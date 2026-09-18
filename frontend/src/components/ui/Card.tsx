import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-subtle",
        hover && "transition-shadow hover:shadow-card hover:border-slate-300 dark:hover:border-slate-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon,
  action,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-4 flex flex-col justify-between", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark">
          {title}
        </span>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-soft dark:bg-slate-800 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
        {action}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
          {value}
        </div>

        {change && (
          <div
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              changeType === "positive" && "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400",
              changeType === "negative" && "text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400",
              changeType === "neutral" && "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            {change}
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs text-foreground-muted dark:text-foreground-mutedDark">
          {subtitle}
        </div>
      )}
    </Card>
  );
}
