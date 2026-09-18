"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#modules", label: "Product" },
    { href: "/#journey", label: "Patient Journey" },
    { href: "/#patient360", label: "Patient 360" },
    { href: "/#roles", label: "Solutions" },
    { href: "/pricing", label: "Plans & Pricing", isHighlight: true },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Resources" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 dark:border-border-dark bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo size="sm" subtitle="Hospital Operations OS" href="/" />

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold text-foreground-muted dark:text-foreground-mutedDark">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={
                link.isHighlight
                  ? "text-primary font-bold hover:text-primary-hover transition-colors"
                  : "hover:text-foreground dark:hover:text-foreground-dark transition-colors"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href="/login"
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 text-foreground-muted hover:text-foreground transition-colors"
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
            href="/signup"
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-flex items-center justify-center shadow-xs transition-colors gap-1"
          >
            <span>Explore</span>
            <span className="hidden sm:inline">Live System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border dark:border-border-dark bg-white dark:bg-surface-dark px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg transition-colors ${
                  link.isHighlight
                    ? "bg-blue-50 dark:bg-blue-950/60 text-primary font-bold border border-blue-200 dark:border-blue-900"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-border dark:border-border-dark grid grid-cols-2 gap-2">
            <a
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 rounded-lg border border-border dark:border-border-dark flex items-center justify-center text-xs font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Sign In
            </a>
            <a
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center text-xs font-bold shadow-sm"
            >
              Register Facility
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default MarketingHeader;
