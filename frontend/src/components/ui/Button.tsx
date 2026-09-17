import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
    };

    const variantClasses = {
      primary:
        "bg-primary text-white hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-sm",
      secondary:
        "bg-deep text-white hover:bg-deep-hover border border-transparent shadow-sm",
      outline:
        "bg-white dark:bg-surface-dark text-foreground dark:text-foreground-dark border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm",
      ghost:
        "bg-transparent text-foreground-muted hover:text-foreground dark:text-foreground-mutedDark dark:hover:text-foreground-dark hover:bg-slate-100 dark:hover:bg-slate-800/60",
      soft:
        "bg-soft text-primary dark:bg-slate-800 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 font-medium",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none select-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
