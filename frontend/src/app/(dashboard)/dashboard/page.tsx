"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { StatCard, Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Column } from "@/components/ui/Table";
import { MOCK_APPOINTMENTS, MOCK_QUEUE } from "@/lib/mock/data";
import { QueueToken, Appointment } from "@/types";
import {
  Users,
  Clock,
  BedDouble,
  LogOut,
  IndianRupee,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { user, hospital } = useAuth();
  const [selectedFlowStage, setSelectedFlowStage] = useState<string>("Waiting");

  const flowStages = [
    { name: "Registration", count: 12 },
    { name: "Check-in", count: 15 },
    { name: "Waiting", count: 37 },
    { name: "Consultation", count: 21 },
    { name: "Diagnostics", count: 18 },
    { name: "Pharmacy", count: 14 },
    { name: "Billing", count: 9 },
    { name: "Discharge", count: 11 },
  ];

  const deptLoads = [
    { name: "Cardiology", patients: 86, loadPercent: 92, doctor: "Dr. Sharma" },
    { name: "Orthopedics", patients: 64, loadPercent: 74, doctor: "Dr. Rao" },
    { name: "General Medicine", patients: 58, loadPercent: 62, doctor: "Dr. Sundaram" },
    { name: "Pediatrics", patients: 42, loadPercent: 50, doctor: "Dr. Varma" },
    { name: "Emergency / Trauma", patients: 28, loadPercent: 80, doctor: "On-Duty Team" },
  ];

  // Appointment columns
  const aptColumns: Column<Appointment>[] = [
    {
      header: "Time",
      accessorKey: "appointment_time",
      sortable: true,
      className: "w-24 font-mono font-medium",
    },
    {
      header: "Patient",
      render: (a) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {a.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            UHID: {a.patient_uhid}
          </div>
        </div>
      ),
    },
    {
      header: "Department / Doctor",
      render: (a) => (
        <div>
          <div className="font-medium text-foreground dark:text-foreground-dark">
            {a.department_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {a.doctor_name}
          </div>
        </div>
      ),
    },
    {
      header: "Token",
      render: (a) => (
        <span className="font-mono font-bold text-primary dark:text-blue-400">
          {a.token_number || "—"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
  ];

  // Queue snapshot columns
  const queueColumns: Column<QueueToken>[] = [
    {
      header: "Token",
      render: (q) => (
        <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950/80 text-primary dark:text-blue-400 px-2 py-0.5 rounded">
          {q.token_number}
        </span>
      ),
    },
    {
      header: "Patient",
      render: (q) => (
        <span className="font-semibold text-foreground dark:text-foreground-dark">
          {q.patient_name}
        </span>
      ),
    },
    {
      header: "Doctor / Room",
      render: (q) => (
        <div>
          <div className="font-medium">{q.doctor_name}</div>
          <div className="text-[10px] text-foreground-muted dark:text-foreground-mutedDark">
            {q.room_number}
          </div>
        </div>
      ),
    },
    {
      header: "Wait Time",
      render: (q) => (
        <span className="text-foreground-muted dark:text-foreground-mutedDark font-medium">
          {q.estimated_wait_minutes > 0 ? `${q.estimated_wait_minutes} mins` : "Now Serving"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (q) => <StatusBadge status={q.status} />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Good morning, {user?.first_name || "Admin"}
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Thursday, 17 September 2026 · {hospital?.name || "Metro General Hospital"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hospital Live
          </span>
        </div>
      </div>

      {/* KPI Cards: Compact & Professional */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title="Today's OPD"
          value="428"
          change="+8.4%"
          changeType="positive"
          subtitle="vs last Thursday"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Waiting Patients"
          value="37"
          change="-12%"
          changeType="positive"
          subtitle="avg wait 14 mins"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Admissions"
          value="18"
          subtitle="12 Planned · 6 ER"
          icon={<BedDouble className="w-4 h-4" />}
        />
        <StatCard
          title="Discharges"
          value="11"
          subtitle="8 completed · 3 billing"
          icon={<LogOut className="w-4 h-4" />}
        />
        <StatCard
          title="Today's Collection"
          value="₹4.82L"
          change="+14.2%"
          changeType="positive"
          subtitle="₹1.24L pending"
          icon={<IndianRupee className="w-4 h-4" />}
        />
      </div>

      {/* Live Patient Flow (Horizontal Operations Tracker) */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark">
              Live Hospital Patient Flow
            </h3>
          </div>
          <span className="text-xs text-foreground-muted dark:text-foreground-mutedDark">
            Active Stage: <strong className="text-primary">{selectedFlowStage}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {flowStages.map((stage, idx) => {
            const isSelected = selectedFlowStage === stage.name;
            return (
              <button
                key={stage.name}
                onClick={() => setSelectedFlowStage(stage.name)}
                className={`p-2.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? "bg-blue-50/90 dark:bg-blue-950/70 border-primary dark:border-blue-500 shadow-xs ring-1 ring-primary/20"
                    : "bg-white dark:bg-surface-dark border-border dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-[11px] font-medium text-foreground-muted dark:text-foreground-mutedDark truncate">
                  {stage.name}
                </div>
                <div className="text-lg font-bold text-foreground dark:text-foreground-dark mt-0.5">
                  {stage.count}
                </div>
                {idx < flowStages.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-700 pointer-events-none z-10" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Middle Grid: Today's Appointments & Department Load */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
              Today&apos;s Appointments
            </h3>
            <a
              href="/appointments"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Full Calendar →
            </a>
          </div>
          <Table
            data={MOCK_APPOINTMENTS}
            columns={aptColumns}
            keyExtractor={(a) => a.id}
            pageSize={5}
            searchable={false}
          />
        </div>

        {/* Department Load (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
              Department Load
            </h3>
            <span className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
              Real-time Capacity
            </span>
          </div>
          <Card className="p-4 space-y-4">
            {deptLoads.map((d) => (
              <div key={d.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground dark:text-foreground-dark">
                    {d.name}
                  </span>
                  <span className="text-foreground-muted dark:text-foreground-mutedDark font-mono">
                    {d.patients} pts ({d.loadPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      d.loadPercent > 85
                        ? "bg-rose-500"
                        : d.loadPercent > 70
                        ? "bg-amber-500"
                        : "bg-primary"
                    }`}
                    style={{ width: `${d.loadPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-foreground-muted dark:text-foreground-mutedDark">
                  Lead: {d.doctor}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Bottom Grid: Live Queue Snapshot, Revenue, Bed Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Snapshot (1.5 col) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
              Live Queue Snapshot
            </h3>
            <a href="/queue" className="text-xs font-semibold text-primary hover:underline">
              Open Token Caller →
            </a>
          </div>
          <Table
            data={MOCK_QUEUE}
            columns={queueColumns}
            keyExtractor={(q) => q.id}
            pageSize={5}
            searchable={false}
          />
        </div>

        {/* Bed Occupancy & Revenue Snapshot (1 col) */}
        <div className="space-y-6">
          {/* Bed Occupancy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                Bed Occupancy
              </h3>
              <a href="/wards" className="text-xs font-semibold text-primary hover:underline">
                Bed Map →
              </a>
            </div>
            <Card className="p-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                  182{" "}
                  <span className="text-xs font-normal text-foreground-muted dark:text-foreground-mutedDark">
                    / 240 Beds
                  </span>
                </span>
                <span className="text-xs font-bold text-primary">75.8% Occupied</span>
              </div>

              {/* Progress bar with status breakdown */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
                <div style={{ width: "75.8%" }} className="bg-primary" title="Occupied (182)" />
                <div style={{ width: "5%" }} className="bg-amber-400" title="Cleaning (12)" />
                <div style={{ width: "3.3%" }} className="bg-slate-400" title="Reserved (8)" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-border dark:border-border-dark">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Occupied
                  </span>
                  <span className="font-semibold">182</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="font-semibold text-emerald-600">38</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Cleaning
                  </span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Reserved
                  </span>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Snapshot */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                Revenue Snapshot
              </h3>
              <a href="/billing" className="text-xs font-semibold text-primary hover:underline">
                Billing →
              </a>
            </div>
            <Card className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-border-dark/60">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">
                  Today&apos;s Collection
                </span>
                <span className="font-bold text-emerald-600 text-sm">₹4,82,000</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-border-dark/60">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">
                  Pending Receivables
                </span>
                <span className="font-semibold text-amber-600">₹1,24,000</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/60 dark:border-border-dark/60">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">
                  Insurance / TPA Claims
                </span>
                <span className="font-semibold text-primary">₹3,48,000</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-foreground-muted dark:text-foreground-mutedDark">
                  Refunds Processed
                </span>
                <span className="font-semibold text-slate-500">₹4,500</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
