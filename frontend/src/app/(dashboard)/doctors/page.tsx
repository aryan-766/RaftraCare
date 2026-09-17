"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { MOCK_APPOINTMENTS, MOCK_LAB_ORDERS } from "@/lib/mock/data";
import { Appointment } from "@/types";
import { Stethoscope, Clock, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function DoctorDashboardPage() {
  const router = useRouter();

  const columns: Column<Appointment>[] = [
    {
      header: "Time",
      accessorKey: "appointment_time",
      className: "font-mono font-bold text-xs text-primary",
    },
    {
      header: "Patient",
      render: (a) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {a.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{a.patient_uhid}</div>
        </div>
      ),
    },
    {
      header: "Reason / Chief Complaint",
      accessorKey: "reason_for_visit",
    },
    {
      header: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: "Action",
      render: (a) => (
        <Button
          size="sm"
          onClick={() => router.push("/opd")}
          rightIcon={<ArrowRight className="w-3 h-3" />}
        >
          Consult Now
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Doctor Workspace — Dr. Rajesh Sharma
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Cardiology Department · OPD Room 204 · 17 September 2026
          </p>
        </div>
        <Button size="sm" onClick={() => router.push("/opd")}>
          Launch Active Consultation →
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Today's Patients" value="24" subtitle="18 Completed · 6 Remaining" />
        <StatCard title="Pending Consults" value="6" subtitle="Next: Raj Kumar (A-102)" />
        <StatCard title="Critical Lab Alerts" value="1" subtitle="HbA1c 7.8% (HOS-001284)" />
        <StatCard title="Scheduled Follow-ups" value="8" subtitle="Next 7 days" />
      </div>

      {/* Today's Consultations List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Today&apos;s Consultation Schedule
          </h3>
          <span className="text-xs text-foreground-muted">Live Queue</span>
        </div>
        <Table
          data={MOCK_APPOINTMENTS}
          columns={columns}
          keyExtractor={(a) => a.id}
          pageSize={5}
          searchable={false}
        />
      </div>

      {/* Recent Diagnostic Results to Review */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
          Recent Laboratory & Radiology Reports for Review
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_LAB_ORDERS.map((l) => (
            <Card key={l.id} className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-primary">{l.order_number}</span>
                <StatusBadge status={l.status} />
              </div>
              <div className="font-bold text-foreground dark:text-foreground-dark">
                {l.patient_name} ({l.patient_uhid})
              </div>
              <div className="text-foreground-muted">
                Tests: {l.tests.map((t) => t.test_name).join(", ")}
              </div>
              <div className="pt-2 border-t border-border/60 dark:border-border-dark flex justify-between items-center">
                <span className="text-[11px] text-foreground-muted">{l.sample_type}</span>
                <a href="/reports" className="text-primary font-semibold hover:underline">
                  View Full Report →
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
