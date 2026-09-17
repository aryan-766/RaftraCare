"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Laptop,
  Building2,
  ChevronDown,
  LogOut,
  UserCheck,
} from "lucide-react";
import { UserRole } from "@/types";
import { Button } from "../ui/Button";

export function TopBar({
  onOpenCommand,
  onOpenQuickAction,
}: {
  onOpenCommand: () => void;
  onOpenQuickAction: (action: string) => void;
}) {
  const { user, hospital, switchRole, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { role: UserRole; label: string }[] = [
    { role: "HOSPITAL_ADMIN", label: "Hospital Admin (Full)" },
    { role: "RECEPTIONIST", label: "Receptionist / Front Desk" },
    { role: "DOCTOR", label: "Doctor / Specialist" },
    { role: "NURSE", label: "Ward Staff Nurse" },
    { role: "PHARMACIST", label: "Chief Pharmacist" },
    { role: "ACCOUNTANT", label: "Billing & Accounts" },
  ];

  return (
    <header className="h-14 border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark px-4 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-input bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark text-xs text-foreground-muted dark:text-foreground-mutedDark hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-foreground-muted dark:text-foreground-mutedDark" />
            <span>Search patients, appointments, bills...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Hospital info badge */}
      <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-border/80 dark:border-border-dark text-xs font-medium text-foreground dark:text-foreground-dark">
        <Building2 className="w-3.5 h-3.5 text-primary" />
        <span>{hospital?.name || "Metro General Hospital"}</span>
        <span className="text-[10px] text-primary font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 rounded">
          {hospital?.subscription_tier}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Quick Action Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            leftIcon={<Plus className="w-4 h-4" />}
            rightIcon={<ChevronDown className="w-3 h-3 ml-0.5" />}
          >
            Quick Action
          </Button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-1.5 z-40 text-xs animate-in fade-in zoom-in-95"
              onClick={() => setShowQuickMenu(false)}
            >
              <button
                onClick={() => onOpenQuickAction("new-patient")}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-foreground dark:text-foreground-dark flex items-center gap-2"
              >
                + New Patient
              </button>
              <button
                onClick={() => onOpenQuickAction("appointment")}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-foreground dark:text-foreground-dark flex items-center gap-2"
              >
                + Book Appointment
              </button>
              <button
                onClick={() => onOpenQuickAction("walk-in")}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-foreground dark:text-foreground-dark flex items-center gap-2"
              >
                + Check-in Walk-in
              </button>
              <button
                onClick={() => onOpenQuickAction("invoice")}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-foreground dark:text-foreground-dark flex items-center gap-2"
              >
                + Create Invoice
              </button>
              <button
                onClick={() => onOpenQuickAction("admission")}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-foreground dark:text-foreground-dark flex items-center gap-2"
              >
                + IPD Admission
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-btn text-foreground-muted hover:text-foreground dark:text-foreground-mutedDark dark:hover:text-foreground-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-surface-dark" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-3 z-40 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border dark:border-border-dark font-bold text-foreground dark:text-foreground-dark">
                <span>Recent Notifications</span>
                <span className="text-[10px] text-primary cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2 rounded bg-blue-50/60 dark:bg-blue-950/40 text-xs">
                  <div className="font-semibold text-foreground dark:text-foreground-dark">
                    Lab Report Ready
                  </div>
                  <div className="text-foreground-muted dark:text-foreground-mutedDark text-[11px] mt-0.5">
                    Troponin-I report for Raj Kumar (HOS-001284) has been verified.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">4 mins ago</div>
                </div>
                <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/40 text-xs">
                  <div className="font-semibold text-foreground dark:text-foreground-dark">
                    Low Stock Alert
                  </div>
                  <div className="text-foreground-muted dark:text-foreground-mutedDark text-[11px] mt-0.5">
                    Metformin 500mg SR stock (220 units) is below reorder level (400 units).
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">18 mins ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark / System) */}
        <div className="flex items-center p-0.5 rounded-btn bg-slate-100 dark:bg-slate-800 border border-border dark:border-border-dark text-foreground-muted dark:text-foreground-mutedDark">
          <button
            onClick={() => setTheme("light")}
            className={`p-1 rounded ${theme === "light" ? "bg-white text-primary shadow-xs" : ""}`}
            title="Light Mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-1 rounded ${theme === "dark" ? "bg-slate-700 text-blue-400 shadow-xs" : ""}`}
            title="Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`p-1 rounded ${theme === "system" ? "bg-white dark:bg-slate-700 text-primary dark:text-blue-400 shadow-xs" : ""}`}
            title="System Mode"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Role Switcher & User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-border dark:hover:border-border-dark"
          >
            <div className="w-7 h-7 rounded-full bg-deep text-white font-bold text-xs flex items-center justify-center">
              {user?.first_name?.[0] || "U"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold leading-none text-foreground dark:text-foreground-dark">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-[10px] font-medium text-primary mt-0.5">
                {user?.role.replace(/_/g, " ")}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-foreground-muted dark:text-foreground-mutedDark ml-0.5" />
          </button>

          {showRoleMenu && (
            <div
              className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-2 z-40 text-xs animate-in fade-in zoom-in-95"
              onClick={() => setShowRoleMenu(false)}
            >
              <div className="px-2 py-1.5 text-[11px] font-semibold text-foreground-muted dark:text-foreground-mutedDark uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                Switch Demo Role
              </div>
              <div className="space-y-0.5 mb-2">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => switchRole(r.role)}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between ${
                      user?.role === r.role
                        ? "bg-blue-50 dark:bg-blue-950/60 font-semibold text-primary"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground dark:text-foreground-dark"
                    }`}
                  >
                    <span>{r.label}</span>
                    {user?.role === r.role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-border dark:border-border-dark pt-1">
                <button
                  onClick={logout}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
