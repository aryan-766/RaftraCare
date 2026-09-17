import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      {/* Public Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 dark:border-border-dark bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" subtitle="Hospital Operations OS" href="/" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-foreground-muted dark:text-foreground-mutedDark">
            <a href="/#modules" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              Product
            </a>
            <a href="/#journey" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              Patient Journey
            </a>
            <a href="/#patient360" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              Patient 360
            </a>
            <a href="/#roles" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              Solutions
            </a>
            <a href="/pricing" className="text-primary font-bold hover:text-primary-hover transition-colors">
              Plans & Pricing
            </a>
            <a href="/about" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              About
            </a>
            <a href="/resources" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              Resources
            </a>
            <a href="/#faq" className="hover:text-foreground dark:hover:text-foreground-dark transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className="text-xs font-semibold px-2.5 py-1.5 text-foreground-muted hover:text-foreground transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-btn border border-border dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors"
            >
              Sign Up
            </a>
            <a
              href="/demo"
              className="h-9 px-4 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-flex items-center justify-center shadow-xs transition-colors"
            >
              Explore Live System
            </a>
          </div>
        </div>
      </header>

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
              ABDM M1-M3 Standard · 256-Bit TLS · ISO 27001 Certified Architecture
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
