"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  subtitle,
  children,
  maxWidth = "md",
  size,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedWidth = size || maxWidth;
  const resolvedDesc = description || subtitle;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={cn(
          "w-full bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-modal shadow-modal overflow-hidden animate-in zoom-in-95 duration-150",
          maxWidthClasses[resolvedWidth]
        )}
      >
        {(title || resolvedDesc) && (
          <div className="px-6 py-4 border-b border-border dark:border-border-dark flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
                  {title}
                </h3>
              )}
              {resolvedDesc && (
                <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
                  {resolvedDesc}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-foreground-muted hover:text-foreground dark:text-foreground-mutedDark dark:hover:text-foreground-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl" | "2xl";
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "lg",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={cn(
            "w-screen bg-white dark:bg-surface-dark border-l border-border dark:border-border-dark shadow-2xl flex flex-col animate-in slide-in-from-right duration-250",
            widthClasses[width]
          )}
        >
          <div className="px-6 py-4 border-b border-border dark:border-border-dark flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
            <div>
              <h2 className="text-base font-bold text-foreground dark:text-foreground-dark">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-foreground-muted hover:text-foreground dark:text-foreground-mutedDark dark:hover:text-foreground-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
