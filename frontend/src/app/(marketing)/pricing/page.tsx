"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  Sparkles,
  Building2,
  GitBranch,
  BedDouble,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  FileCheck2,
} from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      id: "STARTER",
      name: "Starter Clinic",
      subtitle: "For day-care clinics & nursing homes",
      monthlyPrice: 4999,
      annualPrice: 3999,
      badge: "Clinic Tier",
      popular: false,
      beds: "Up to 30 Beds",
      branches: "1 Facility Location",
      desc: "Essential digital operations to replace paper chits and spreadsheets in outpatient clinics.",
      features: [
        "1 Hospital Facility Location",
        "Up to 30 Hospital Beds",
        "Front Desk Registration & Token Queue",
        "Single-Screen OPD Doctor Workstation",
        "Digital Rx & e-Prescriptions",
        "Pharmacy Inventory & Dispensing Point",
        "Cash, UPI & Card Payment Invoicing",
        "Daily OPD Cashier Reconciliation",
        "WhatsApp Appointment Reminders",
        "Email & Standard Support",
      ],
      cta: "Start Free 14-Day Trial",
      href: "/signup?plan=STARTER",
    },
    {
      id: "GROWTH",
      name: "Growth Hospital",
      subtitle: "For multi-ward tertiary care hospitals",
      monthlyPrice: 14999,
      annualPrice: 11999,
      badge: "Most Popular",
      popular: true,
      beds: "Up to 250 Beds",
      branches: "Up to 3 Hospital Branches",
      desc: "Full-stack hospital operating system connecting front desk, IPD, emergency, lab, and billing.",
      features: [
        "Up to 3 Connected Hospital Branches",
        "Up to 250 Hospital Beds with Visual Map",
        "Inpatient (IPD) Admission & Discharge",
        "Emergency Room (ER) & Red Triage Bay",
        "Integrated Laboratory (LIS) with Reference Ranges",
        "Radiology Workstation & Study Requests",
        "Cashless TPA & Insurance Pre-Authorization",
        "Operation Theatre (OT) Surgical Scheduling",
        "ABDM M1-M3 Health ID & Locker Integration",
        "Unlimited Staff Accounts & 9-Role RBAC",
        "24/7 Priority Emergency Phone Support",
      ],
      cta: "Deploy Growth Hospital",
      href: "/signup?plan=GROWTH",
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise Network",
      subtitle: "For multi-hospital chains & groups",
      monthlyPrice: 39999,
      annualPrice: 31999,
      badge: "Enterprise Scale",
      popular: false,
      beds: "500+ Licensed Beds",
      branches: "Unlimited Hospital Branches",
      desc: "For hospital groups requiring multi-tenant group governance, DICOM PACS, and custom workflows.",
      features: [
        "Unlimited Hospital Branches & Campuses",
        "500+ Licensed Inpatient Beds",
        "Multi-Tenant Group Operations Analytics",
        "PACS / DICOM Imaging Viewer Bridge",
        "ASTM / HL7 Bidirectional Analyzer Interfaces",
        "Cross-Branch Central Patient Record (UHID)",
        "Custom Billing Rules & Corporate Rate Tariffs",
        "Dedicated Customer Success Manager",
        "Quarterly Staff Training & On-Site Audits",
        "99.99% Guaranteed SLA with BAA Agreement",
      ],
      cta: "Contact Enterprise Sales",
      href: "/signup?plan=ENTERPRISE",
    },
  ];

  const faqs = [
    {
      q: "How does multi-tenancy and branch licensing work?",
      a: "RaftraCare is built from the ground up for multi-tenancy. You can operate multiple hospital branches under one parent healthcare organization, sharing doctors and patient medical histories, or keep completely separate hospital legal entities isolated with independent billing accounts.",
    },
    {
      q: "Can I add more hospital branches later as we expand?",
      a: "Yes. You can add additional branch facilities at any time directly from the top bar or dashboard settings for a simple add-on of ₹3,500/month per branch location.",
    },
    {
      q: "Do you provide GST invoices with input tax credit (ITC)?",
      a: "Yes! Every subscription charge generates a GST compliant B2B tax invoice (SAC code 998313 — Information Technology Software) with your hospital GSTIN for 100% input tax credit claiming.",
    },
    {
      q: "Is there an onboarding setup fee?",
      a: "No hidden setup fees. Our team provides remote data migration assistance (master drug formulary, doctor schedules, and ward structures) at zero extra charge.",
    },
    {
      q: "Can we switch between Monthly and Annual billing?",
      a: "Yes, you can upgrade, downgrade, or switch between monthly and annual billing at any point. Unused prepaid time is automatically credited pro-rata to your account.",
    },
  ];

  return (
    <div className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-primary border border-blue-200 dark:border-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Transparent Hospital SaaS Licensing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Predictable pricing built for modern hospitals.
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
          From single daycare clinics to 500-bed multi-city hospital networks, RaftraCare provides
          unified hospital operating infrastructure with zero hidden per-user fees.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!annual ? "text-foreground" : "text-foreground-muted"}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 p-0.5 transition-colors relative"
          >
            <div
              className={`w-5 h-5 rounded-full bg-primary shadow-xs transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? "text-foreground" : "text-foreground-muted"}`}>
            Annual
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* 2. Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const price = annual ? p.annualPrice : p.monthlyPrice;
          return (
            <Card
              key={p.id}
              className={`relative flex flex-col justify-between p-6 sm:p-8 transition-all ${
                p.popular
                  ? "border-2 border-primary shadow-xl bg-white dark:bg-surface-dark ring-4 ring-blue-500/10"
                  : "border border-border dark:border-border-dark shadow-sm hover:shadow-md"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark">
                    {p.name}
                  </h3>
                  {!p.popular && (
                    <span className="text-[10px] font-semibold text-foreground-muted px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark min-h-[32px]">
                  {p.subtitle}
                </p>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-border dark:border-border-dark">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-foreground dark:text-foreground-dark">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-foreground-muted dark:text-foreground-mutedDark">
                      / facility / month
                    </span>
                  </div>
                  <div className="text-[11px] text-foreground-muted mt-1">
                    {annual ? "Billed annually (Includes 20% discount)" : "Billed monthly"}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/80 text-xs">
                  <div>
                    <div className="text-[10px] text-foreground-muted uppercase font-semibold">Beds Limit</div>
                    <div className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-primary" /> {p.beds}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted uppercase font-semibold">Multi-Tenancy</div>
                    <div className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-primary" /> {p.branches}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-foreground dark:text-foreground-dark uppercase tracking-wider">
                    Included Features:
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground-muted dark:text-foreground-mutedDark">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link href={p.href}>
                  <Button
                    variant={p.popular ? "primary" : "outline"}
                    className="w-full h-11 text-xs font-bold"
                  >
                    {p.cta}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <div className="text-center text-[10px] text-foreground-muted mt-2">
                  Instant activation · No credit card needed for trial
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Multi-Tenant Branch Add-on Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-primary text-[10px] font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              Multi-Tenant Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark">
              Operating multiple hospitals or city outpatient branches?
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Connect additional hospital branches or daycare centers with centralized patient records,
              unified doctor rosters, and consolidated group revenue reporting for just{" "}
              <strong className="text-foreground">₹3,500/month per additional branch</strong>.
            </p>
          </div>
          <Link href="/signup?plan=ENTERPRISE">
            <Button size="md" className="shrink-0 text-xs font-bold">
              Configure Multi-Branch Plan
            </Button>
          </Link>
        </div>
      </Card>

      {/* 4. Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            SaaS Licensing & Billing FAQ
          </h2>
          <p className="text-xs text-foreground-muted">
            Common questions regarding our software tiers, multi-tenancy, and onboarding.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-4 space-y-1.5">
              <div className="font-bold text-xs text-foreground dark:text-foreground-dark flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                {faq.q}
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed pl-5.5">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Bottom Ready CTA */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="text-2xl font-extrabold text-foreground">
          Ready to modernize your hospital operations?
        </h3>
        <p className="text-xs text-foreground-muted max-w-md mx-auto">
          Explore the live interactive HospitalOS dashboard or start your free hospital onboarding today.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="text-xs font-bold">
              Explore Live Demo Dashboard
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="text-xs font-bold">
              Sign Up Facility
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
