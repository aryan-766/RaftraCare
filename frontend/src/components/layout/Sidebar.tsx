"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  BedDouble,
  AlertTriangle,
  Clock,
  Stethoscope,
  HeartPulse,
  FileSpreadsheet,
  Pill,
  ClipboardList,
  FlaskConical,
  Radio,
  FileCheck2,
  Package,
  ShoppingCart,
  Building,
  CreditCard,
  Receipt,
  ShieldCheck,
  Tags,
  Ambulance,
  Activity,
  UserCheck,
  CalendarCheck,
  CalendarDays,
  Bell,
  MessageSquare,
  Smartphone,
  Globe,
  BarChart3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  allowedRoles?: UserRole[];
  badge?: string | number;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

export function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, hospital, logout } = useAuth();

  const currentRole = user?.role || "HOSPITAL_ADMIN";

  const navSections: NavSection[] = [
    {
      section: "CORE",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        {
          title: "Front Desk",
          href: "/front-desk",
          icon: Users,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"],
          badge: "Live",
        },
        {
          title: "Patients",
          href: "/patients",
          icon: Users,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"],
        },
        {
          title: "Appointments",
          href: "/appointments",
          icon: Calendar,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"],
        },
        {
          title: "OPD",
          href: "/opd",
          icon: Layers,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "RECEPTIONIST"],
        },
        {
          title: "IPD",
          href: "/ipd",
          icon: BedDouble,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"],
        },
        {
          title: "Emergency",
          href: "/emergency",
          icon: AlertTriangle,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"],
          badge: "Triage",
        },
        {
          title: "Queue & Token",
          href: "/queue",
          icon: Clock,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"],
        },
      ],
    },
    {
      section: "CLINICAL",
      items: [
        {
          title: "Doctors",
          href: "/doctors",
          icon: Stethoscope,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"],
        },
        {
          title: "Nursing",
          href: "/nursing",
          icon: HeartPulse,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR"],
        },
        {
          title: "EMR",
          href: "/emr",
          icon: FileSpreadsheet,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"],
        },
        {
          title: "Prescriptions",
          href: "/prescriptions",
          icon: Pill,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "PHARMACIST"],
        },
        {
          title: "Care Plans",
          href: "/care-plans",
          icon: ClipboardList,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"],
        },
      ],
    },
    {
      section: "DIAGNOSTICS",
      items: [
        {
          title: "Laboratory",
          href: "/lab",
          icon: FlaskConical,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"],
          badge: "2",
        },
        {
          title: "Radiology",
          href: "/radiology",
          icon: Radio,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"],
        },
        {
          title: "Reports",
          href: "/reports",
          icon: FileCheck2,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "LAB_TECHNICIAN"],
        },
      ],
    },
    {
      section: "PHARMACY",
      items: [
        {
          title: "Pharmacy",
          href: "/pharmacy",
          icon: Pill,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"],
        },
        {
          title: "Inventory",
          href: "/inventory",
          icon: Package,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"],
        },
        {
          title: "Purchase",
          href: "/purchase",
          icon: ShoppingCart,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "ACCOUNTANT"],
        },
        {
          title: "Vendors",
          href: "/vendors",
          icon: Building,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "ACCOUNTANT"],
        },
      ],
    },
    {
      section: "REVENUE",
      items: [
        {
          title: "Billing",
          href: "/billing",
          icon: CreditCard,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"],
        },
        {
          title: "Payments",
          href: "/payments",
          icon: Receipt,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"],
        },
        {
          title: "Insurance / TPA",
          href: "/insurance",
          icon: ShieldCheck,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"],
        },
        {
          title: "Packages & Pricing",
          href: "/packages",
          icon: Tags,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"],
        },
      ],
    },
    {
      section: "OPERATIONS",
      items: [
        {
          title: "Beds & Wards",
          href: "/wards",
          icon: BedDouble,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR", "RECEPTIONIST"],
        },
        {
          title: "OT Schedules",
          href: "/ot",
          icon: Activity,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"],
        },
        {
          title: "Ambulance",
          href: "/ambulance",
          icon: Ambulance,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"],
        },
      ],
    },
    {
      section: "PEOPLE",
      items: [
        {
          title: "Staff",
          href: "/staff",
          icon: UserCheck,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
        {
          title: "Attendance",
          href: "/attendance",
          icon: CalendarCheck,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
        {
          title: "Shifts",
          href: "/shifts",
          icon: CalendarDays,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR"],
        },
      ],
    },
    {
      section: "COMMUNICATION",
      items: [
        {
          title: "Notifications",
          href: "/notifications",
          icon: Bell,
        },
        {
          title: "WhatsApp & SMS",
          href: "/whatsapp",
          icon: MessageSquare,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"],
        },
        {
          title: "Patient Portal",
          href: "/portal",
          icon: Globe,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
      ],
    },
    {
      section: "ANALYTICS",
      items: [
        {
          title: "Hospital Analytics",
          href: "/analytics",
          icon: BarChart3,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"],
        },
      ],
    },
    {
      section: "ADMIN",
      items: [
        {
          title: "Hospital Settings",
          href: "/admin/settings",
          icon: Sliders,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
        {
          title: "Users & Roles",
          href: "/admin/users",
          icon: Users,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
        {
          title: "Billing & Subscription",
          href: "/settings/billing",
          icon: Sparkles,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
          badge: "SaaS",
        },
        {
          title: "Audit Logs",
          href: "/admin/audit",
          icon: FileSpreadsheet,
          allowedRoles: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark border-r border-border dark:border-border-dark select-none">
      {/* Brand Header */}
      <div className="h-14 px-3.5 border-b border-border dark:border-border-dark flex items-center justify-between shrink-0">
        {!collapsed ? (
          <Logo size="sm" subtitle="Operations OS" href="/dashboard" />
        ) : (
          <div className="mx-auto">
            <Logo size="sm" showWordmark={false} href="/dashboard" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((sec) => {
          // Filter items by role
          const visibleItems = sec.items.filter((item) => {
            if (!item.allowedRoles) return true;
            if (currentRole === "SUPER_ADMIN" || currentRole === "HOSPITAL_ADMIN") return true;
            return item.allowedRoles.includes(currentRole);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={sec.section} className="space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground-muted dark:text-foreground-mutedDark uppercase">
                  {sec.section}
                </div>
              )}

              {visibleItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon as any;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors relative group",
                      isActive
                        ? "bg-blue-50/80 dark:bg-blue-950/60 text-primary dark:text-blue-400 font-semibold"
                        : "text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground dark:hover:text-foreground-dark hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary dark:text-blue-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-foreground dark:group-hover:text-foreground-dark"
                      )}
                    />

                    {!collapsed && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-primary dark:text-blue-300">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                    )}
                  </a>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer: User Profile + Sign Out */}
      {!collapsed ? (
        <div className="p-2.5 border-t border-border dark:border-border-dark bg-slate-50/70 dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground dark:text-foreground-dark truncate">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-[10px] text-primary font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {hospital?.branch_name || hospital?.name}
              </div>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-primary uppercase shrink-0">
              {currentRole.replace(/_/g, " ").slice(0, 10)}
            </span>
          </div>

          <button
            onClick={logout}
            className="w-full py-1.5 px-2.5 rounded-md bg-white dark:bg-slate-800 border border-border dark:border-border-dark hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs group"
          >
            <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="p-2 border-t border-border dark:border-border-dark flex justify-center">
          <button
            onClick={logout}
            title="Sign Out of Dashboard"
            className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-200 z-20 h-screen sticky top-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
