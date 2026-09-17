import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    primary:
      "bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-400 border-blue-200 dark:border-blue-800",
    success:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    warning:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    danger:
      "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    info:
      "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    purple:
      "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    neutral:
      "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700",
  };

  const dotClasses = {
    default: "bg-slate-400",
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border leading-none shrink-0",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClasses[variant])} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();

  switch (s) {
    case "AVAILABLE":
    case "PAID":
    case "PUBLISHED":
    case "ACTIVE":
    case "CONFIRMED":
    case "COMPLETED":
    case "PRE_AUTH_APPROVED":
    case "SETTLED":
      return (
        <Badge variant="success" dot>
          {status.replace(/_/g, " ")}
        </Badge>
      );

    case "IN_CONSULTATION":
    case "PROCESSING":
    case "CALLED":
    case "CHECKED_IN":
      return (
        <Badge variant="primary" dot>
          {status.replace(/_/g, " ")}
        </Badge>
      );

    case "WAITING":
    case "SCHEDULED":
    case "PARTIALLY_PAID":
    case "SAMPLE_PENDING":
    case "ORDERED":
    case "PRE_AUTH_PENDING":
    case "QUERY_RAISED":
      return (
        <Badge variant="warning" dot>
          {status.replace(/_/g, " ")}
        </Badge>
      );

    case "OCCUPIED":
    case "CRITICAL":
    case "EMERGENCY":
    case "REJECTED":
    case "FAILED":
      return (
        <Badge variant="danger" dot>
          {status.replace(/_/g, " ")}
        </Badge>
      );

    case "CLEANING":
    case "MAINTENANCE":
    case "RESERVED":
    case "CANCELLED":
    case "NO_SHOW":
    case "DRAFT":
    default:
      return (
        <Badge variant="neutral" dot>
          {status.replace(/_/g, " ")}
        </Badge>
      );
  }
}
