"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { BarChart3, TrendingUp, Download, Calendar, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("THIS_MONTH");
  const [activeTab, setActiveTab] = useState("overview");
  const { success } = useToast();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "opd_ipd", label: "OPD & Inpatients" },
    { id: "revenue", label: "Financial & Billing" },
    { id: "pharmacy_lab", label: "Pharmacy & Labs" },
    { id: "doctors", label: "Doctor Utilization" },
  ];

  // Daily OPD trend data
  const weeklyTrends = [
    { day: "Mon", opd: 412, ipd: 14, rev: 4.2 },
    { day: "Tue", opd: 438, ipd: 16, rev: 4.6 },
    { day: "Wed", opd: 395, ipd: 12, rev: 3.9 },
    { day: "Thu (Today)", opd: 428, ipd: 18, rev: 4.8 },
    { day: "Fri", opd: 450, ipd: 20, rev: 5.1 },
    { day: "Sat", opd: 480, ipd: 15, rev: 5.4 },
    { day: "Sun", opd: 210, ipd: 8, rev: 2.2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Hospital Operations & Revenue Intelligence
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Cross-department performance analytics, patient volumes, and financial indicators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-8 text-xs w-40 font-semibold"
          >
            <option value="TODAY">Today (17 Sep)</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month (Sep 2026)</option>
            <option value="LAST_QUARTER">Last Quarter</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => success("Report Exported", "Analytics dashboard exported to CSV / Excel.")}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Reports
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Consultations" value="11,840" change="+12.4%" changeType="positive" subtitle="vs previous month" />
        <StatCard title="Average Bed Occupancy" value="76.2%" change="+3.1%" changeType="positive" subtitle="Target: 75–80%" />
        <StatCard title="Monthly Net Collection" value="₹1.42 Cr" change="+9.8%" changeType="positive" subtitle="₹18.5L Outstanding" />
        <StatCard title="Average Wait Time" value="14.2 min" change="-2.4 min" changeType="positive" subtitle="Front desk to consultation" />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Overview Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly OPD Trend Visualization (2 cols) */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                Weekly OPD & Inpatient Admission Volumes
              </h3>
              <p className="text-xs text-foreground-muted">Daily footfall pattern across all clinics</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> OPD Patients
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> IPD Admissions
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-4 border-b border-border dark:border-border-dark px-2">
            {weeklyTrends.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* OPD Bar */}
                  <div
                    style={{ height: `${(d.opd / 500) * 100}%` }}
                    className="w-full max-w-[28px] bg-primary hover:bg-primary-hover rounded-t transition-all relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono pointer-events-none whitespace-nowrap z-20 transition-opacity">
                      {d.opd} pts
                    </div>
                  </div>

                  {/* IPD Bar */}
                  <div
                    style={{ height: `${(d.ipd / 25) * 100}%` }}
                    className="w-full max-w-[16px] bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono pointer-events-none whitespace-nowrap z-20 transition-opacity">
                      {d.ipd} adm
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-foreground-muted dark:text-foreground-mutedDark whitespace-nowrap">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Revenue Contribution (1 col) */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Revenue by Department
          </h3>

          <div className="space-y-3.5 text-xs">
            {[
              { dept: "Cardiology & CathLab", amount: "₹48.2L", share: 34, color: "bg-primary" },
              { dept: "Orthopedics & Joint Care", amount: "₹36.5L", share: 26, color: "bg-blue-400" },
              { dept: "General Surgery & OT", amount: "₹28.0L", share: 20, color: "bg-emerald-500" },
              { dept: "Pathology & Diagnostics", amount: "₹18.4L", share: 13, color: "bg-amber-500" },
              { dept: "Pharmacy Counter", amount: "₹10.9L", share: 7, color: "bg-slate-400" },
            ].map((item) => (
              <div key={item.dept} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground dark:text-foreground-dark">{item.dept}</span>
                  <span className="font-mono font-bold">{item.amount} ({item.share}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
