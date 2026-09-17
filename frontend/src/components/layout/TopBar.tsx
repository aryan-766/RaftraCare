"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  GitBranch,
  Sparkles,
  Check,
  PlusCircle,
} from "lucide-react";
import { UserRole } from "@/types";
import { Button } from "../ui/Button";
import { AddFacilityModal } from "../modals/AddFacilityModal";

export function TopBar({
  onOpenCommand,
  onOpenQuickAction,
}: {
  onOpenCommand: () => void;
  onOpenQuickAction: (action: string) => void;
}) {
  const { user, hospital, availableHospitals, switchHospital, switchRole, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFacilityMenu, setShowFacilityMenu] = useState(false);
  const [addFacilityOpen, setAddFacilityOpen] = useState(false);

  const roles: { role: UserRole; label: string }[] = [
    { role: "HOSPITAL_ADMIN", label: "Hospital Admin (Full)" },
    { role: "RECEPTIONIST", label: "Receptionist / Front Desk" },
    { role: "DOCTOR", label: "Doctor / Specialist" },
    { role: "NURSE", label: "Ward Staff Nurse" },
    { role: "PHARMACIST", label: "Chief Pharmacist" },
    { role: "ACCOUNTANT", label: "Billing & Accounts" },
  ];

  // Group hospitals by organization for multi-tenancy display
  const orgMap: Record<string, typeof availableHospitals> = {};
  availableHospitals.forEach((h) => {
    const org = h.organization_name || h.name;
    if (!orgMap[org]) orgMap[org] = [];
    orgMap[org].push(h);
  });

  return (
    <>
      <header className="h-14 border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark px-3 sm:px-4 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
        {/* Search trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-sm sm:max-w-md">
          <button
            onClick={onOpenCommand}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-input bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark text-xs text-foreground-muted dark:text-foreground-mutedDark hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-foreground-muted dark:text-foreground-mutedDark" />
              <span className="truncate">Search patients, bills, UHID...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-800 border border-border dark:border-border-dark shadow-xs">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Center: Multi-Tenant Hospital & Branch Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowFacilityMenu(!showFacilityMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-border/80 dark:border-border-dark text-xs font-medium text-foreground dark:text-foreground-dark hover:border-primary/50 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <div className="text-left leading-none">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <span>{hospital?.name || "Metro General"}</span>
                {hospital?.branch_name && (
                  <span className="hidden md:inline font-normal text-foreground-muted dark:text-foreground-mutedDark text-[11px]">
                    · {hospital.branch_name}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-primary font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 rounded">
              {hospital?.code || "MGH"}
            </span>
            <ChevronDown className="w-3 h-3 text-foreground-muted" />
          </button>

          {/* Facility Multi-Tenant Dropdown */}
          {showFacilityMenu && (
            <div
              className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-2.5 z-50 text-xs animate-in fade-in zoom-in-95"
              onClick={() => setShowFacilityMenu(false)}
            >
              <div className="px-2 py-1 text-[11px] font-bold text-foreground-muted dark:text-foreground-mutedDark uppercase tracking-wider flex items-center justify-between border-b border-border pb-1.5 mb-2">
                <span className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-primary" />
                  Multi-Tenant Hospital Switcher
                </span>
                <span className="text-[10px] text-primary font-semibold lowercase">
                  {availableHospitals.length} active
                </span>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {Object.entries(orgMap).map(([orgName, branches]) => (
                  <div key={orgName} className="space-y-1">
                    <div className="text-[10px] font-extrabold text-foreground-muted px-2 uppercase tracking-wide">
                      {orgName}
                    </div>
                    {branches.map((b) => {
                      const isSelected = hospital?.id === b.id;
                      return (
                        <button
                          key={b.id}
                          onClick={() => switchHospital(b.id)}
                          className={`w-full text-left p-2 rounded-md transition-colors flex items-start justify-between ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-foreground dark:text-foreground-dark flex items-center gap-1.5">
                              {b.name}
                              {b.is_main_branch && (
                                <span className="text-[9px] font-bold px-1 bg-amber-100 text-amber-800 rounded">
                                  HQ
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-foreground-muted mt-0.5">
                              {b.branch_name || b.city} · {b.max_beds} Beds · {b.city}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Action: Add Branch or Hospital */}
              <div className="border-t border-border dark:border-border-dark pt-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFacilityMenu(false);
                    setAddFacilityOpen(true);
                  }}
                  className="w-full py-1.5 px-2.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-primary font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  + Add Hospital Branch / Tenant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SaaS Subscription Quick Badge -> Direct Link to /plans */}
        <Link
          href="/plans"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shrink-0 shadow-2xs"
          title="Manage SaaS Subscription and Multi-Tenant Licensing"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{hospital?.subscription_tier || "GROWTH"} Plan</span>
          <span className="text-[10px] opacity-75 font-normal">· Billing</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Action Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              leftIcon={<Plus className="w-4 h-4" />}
              rightIcon={<ChevronDown className="w-3 h-3 ml-0.5" />}
            >
              <span className="hidden sm:inline">Quick Action</span>
              <span className="sm:hidden">New</span>
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
                    <div className="font-semibold text-primary">Emergency Triage Alert</div>
                    <div className="text-foreground-muted text-[11px] mt-0.5">
                      Trauma patient arriving at Bay 2 in 4 mins.
                    </div>
                  </div>
                  <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/40 text-xs">
                    <div className="font-semibold text-amber-600">Critical Lab Result</div>
                    <div className="text-foreground-muted text-[11px] mt-0.5">
                      Troponin-I positive for IPD Patient UHID HOS-001284.
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 text-xs">
                    <div className="font-semibold text-foreground">SaaS Subscription Auto-Renew</div>
                    <div className="text-foreground-muted text-[11px] mt-0.5">
                      Razorpay invoice generated for Growth Plan.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <div className="flex items-center p-0.5 rounded-btn bg-slate-100 dark:bg-slate-800 border border-border/60">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded text-foreground-muted hover:text-foreground transition-colors ${
                theme === "light" ? "bg-white dark:bg-surface-dark text-primary shadow-2xs font-bold" : ""
              }`}
              title="Light mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded text-foreground-muted hover:text-foreground transition-colors ${
                theme === "dark" ? "bg-white dark:bg-surface-dark text-primary shadow-2xs font-bold" : ""
              }`}
              title="Dark mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 sm:gap-2 pl-2 pr-1.5 py-1 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-border dark:hover:border-border-dark"
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
                className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-dropdown p-2 z-40 text-xs animate-in fade-in zoom-in-95"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-foreground-muted dark:text-foreground-mutedDark uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-1.5 mb-1.5">
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

                <div className="border-t border-border dark:border-border-dark pt-1.5 space-y-1">
                  <Link
                    href="/plans"
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground font-medium flex items-center gap-2 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    SaaS Plans & Multi-Tenancy
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold flex items-center gap-2 transition-colors text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of RaftraCare
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Prominent Sign Out Icon */}
          <button
            onClick={logout}
            className="p-2 rounded-btn text-foreground-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Sign Out of Dashboard"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Modal to add new hospital branch or tenant */}
      <AddFacilityModal
        isOpen={addFacilityOpen}
        onClose={() => setAddFacilityOpen(false)}
      />
    </>
  );
}
