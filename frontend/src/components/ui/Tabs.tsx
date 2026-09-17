import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg gap-1 border border-border/50 dark:border-border-dark/50",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                isActive
                  ? "bg-white dark:bg-surface-dark text-primary dark:text-blue-400 shadow-xs"
                  : "text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground dark:hover:text-foreground-dark"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-blue-50 text-primary dark:bg-blue-950 dark:text-blue-300"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-6 border-b border-border dark:border-border-dark overflow-x-auto no-scrollbar",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 pb-3 pt-1 text-sm font-semibold border-b-2 transition-colors relative whitespace-nowrap",
              isActive
                ? "border-primary text-primary dark:border-blue-500 dark:text-blue-400"
                : "border-transparent text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground dark:hover:text-foreground-dark hover:border-slate-300 dark:hover:border-slate-700"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold",
                  isActive
                    ? "bg-blue-50 text-primary dark:bg-blue-950 dark:text-blue-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
