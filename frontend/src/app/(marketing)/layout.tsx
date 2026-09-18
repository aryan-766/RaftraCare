import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      {/* Public Responsive Navigation Bar */}
      <MarketingHeader />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Comprehensive Professional Enterprise Footer */}
      <footer className="border-t border-border dark:border-border-dark bg-white dark:bg-surface-dark py-14 px-4 sm:px-6 lg:px-8 text-xs text-foreground-muted dark:text-foreground-mutedDark">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <Logo size="sm" subtitle="Unified Healthcare Platform" href="/" />
            <p className="max-w-sm text-xs leading-relaxed">
              The operating system for modern healthcare institutions. One connected system for
              front desk, OPD, IPD, diagnostics, pharmacy, billing, and clinical governance.
            </p>
            <div className="text-[11px] text-slate-400">
              Security-Focused Architecture · Role-Based Access Control · 256-Bit TLS Encryption
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-foreground dark:text-foreground-dark text-xs uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2">
              <li><a href="/#modules" className="hover:underline">Front Desk & Queue</a></li>
              <li><a href="/#modules" className="hover:underline">OPD Doctor Workspace</a></li>
              <li><a href="/#modules" className="hover:underline">IPD & Bed Management</a></li>
              <li><a href="/#modules" className="hover:underline">Laboratory LIS</a></li>
              <li><a href="/#modules" className="hover:underline">Pharmacy Dispensing</a></li>
              <li><a href="/#modules" className="hover:underline">Revenue & Billing</a></li>
              <li><a href="/pricing" className="text-primary font-bold hover:underline">SaaS Plans & Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-foreground dark:text-foreground-dark text-xs uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2">
              <li><a href="/resources" className="hover:underline">Implementation Guides</a></li>
              <li><a href="/resources" className="hover:underline">Operations Case Studies</a></li>
              <li><a href="/about" className="hover:underline">Product Philosophy</a></li>
              <li><a href="/#faq" className="hover:underline">Architecture FAQ</a></li>
              <li><a href="/resources" className="hover:underline">Release Notes</a></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-bold text-foreground dark:text-foreground-dark text-xs uppercase tracking-wider">
              Security & Legal
            </div>
            <ul className="space-y-2">
              <li><a href="/#security" className="hover:underline">Role-Based Access (RBAC)</a></li>
              <li><a href="/#security" className="hover:underline">Immutable Audit Logs</a></li>
              <li><a href="/about" className="hover:underline">Patient Data Privacy</a></li>
              <li><a href="/about" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border/60 dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© 2026 RaftraCare Technologies Inc. All rights reserved.</span>
          <span>Designed for serious hospital operations.</span>
        </div>
      </footer>
    </div>
  );
}
