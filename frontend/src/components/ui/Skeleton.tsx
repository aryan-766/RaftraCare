import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4 bg-white dark:bg-surface-dark rounded-card border border-border dark:border-border-dark">
      <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border-dark">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className={cn("h-4 flex-1", j === 0 && "w-16 flex-none")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
