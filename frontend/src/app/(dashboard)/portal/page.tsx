"use client";

import React from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Globe, ShieldCheck, UserCheck } from "lucide-react";

export default function PatientPortalConfigPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border/70 dark:border-border-dark pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Patient Self-Service Portal & Telehealth
        </h1>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          Secure mobile login for patients to access test reports, bills, prescriptions, and video consultations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard title="Active Portal Users" value="8,420" subtitle="65% of regular patients" />
        <StatCard title="Reports Downloaded" value="1,890" subtitle="This month" />
        <StatCard title="Telehealth Consults" value="142" subtitle="Online appointments" />
      </div>

      <Card className="p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
          Portal URL & QR Integration
        </h3>
        <p className="text-foreground-muted">
          Your public patient portal is accessible at:{" "}
          <strong className="text-primary underline">https://portal.raftracare.io/metrogeneral</strong>
        </p>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
          <span>Printed on all prescription headers and bill receipts automatically.</span>
          <span className="text-emerald-600 font-bold">Enabled</span>
        </div>
      </Card>
    </div>
  );
}
