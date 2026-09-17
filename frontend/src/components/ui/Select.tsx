import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold tracking-wide uppercase text-foreground-muted dark:text-foreground-mutedDark"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-9 pl-3 pr-8 rounded-input bg-white dark:bg-surface-dark border text-sm text-foreground dark:text-foreground-dark appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer disabled:opacity-50",
              error
                ? "border-red-500"
                : "border-border dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-600",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-2.5 pointer-events-none text-foreground-muted dark:text-foreground-mutedDark">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
