import React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No records found",
  description = "Try adjusting your search criteria or create a new entry.",
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-surface-dark border border-border/80 dark:border-border-dark rounded-card min-h-[220px]",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-bold text-foreground dark:text-foreground-dark">
        {title}
      </h4>
      <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information. Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-card min-h-[200px]",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 font-bold text-base">
        !
      </div>
      <h4 className="text-sm font-bold text-red-900 dark:text-red-200">{title}</h4>
      <p className="text-xs text-red-700/80 dark:text-red-300/80 max-w-sm mt-1 mb-4">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function PermissionState({
  message = "You don't have permission to access this resource.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-3">
        🔒
      </div>
      <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
        Access Restricted
      </h3>
      <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark max-w-sm mt-1">
        {message} Please contact your Hospital Administrator.
      </p>
    </div>
  );
}
