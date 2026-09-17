"use client";

import React from "react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-0.5 rounded-btn bg-slate-100 dark:bg-slate-800 border border-border dark:border-border-dark text-foreground-muted dark:text-foreground-mutedDark">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded transition-colors ${
          theme === "light" ? "bg-white text-primary shadow-xs" : "hover:text-foreground"
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded transition-colors ${
          theme === "dark" ? "bg-slate-700 text-blue-400 shadow-xs" : "hover:text-foreground"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded transition-colors ${
          theme === "system" ? "bg-white dark:bg-slate-700 text-primary dark:text-blue-400 shadow-xs" : "hover:text-foreground"
        }`}
        title="System Preference"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
