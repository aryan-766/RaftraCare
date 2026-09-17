"use client";

import React from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { Activity, Clock, Plus } from "lucide-react";

interface OTSchedule {
  id: string;
  otRoom: string;
  surgeryName: string;
  patientName: string;
  uhid: string;
  leadSurgeon: string;
  anesthetist: string;
  scheduledTime: string;
  status: "IN_PROGRESS" | "SCHEDULED" | "RECOVERY" | "COMPLETED";
}

export default function OperationTheatrePage() {
  const schedules: OTSchedule[] = [
    {
      id: "ot_1",
      otRoom: "OT-1 (Cardiac Suite)",
      surgeryName: "Coronary Artery Bypass Graft (CABG)",
      patientName: "Harish Chandra",
      uhid: "HOS-001255",
      leadSurgeon: "Dr. Arvind Srivastava",
      anesthetist: "Dr. K. Nambiar",
      scheduledTime: "08:30 AM – 01:00 PM",
      status: "IN_PROGRESS",
    },
    {
      id: "ot_2",
      otRoom: "OT-2 (Orthopedic Suite)",
      surgeryName: "Total Knee Arthroplasty (Right)",
      patientName: "Sumit Mathur",
      uhid: "HOS-001290",
      leadSurgeon: "Dr. Arvind Rao",
      anesthetist: "Dr. K. Nambiar",
      scheduledTime: "02:00 PM – 04:30 PM",
      status: "SCHEDULED",
    },
  ];

  const columns: Column<OTSchedule>[] = [
    { header: "OT Suite", accessorKey: "otRoom", className: "font-mono font-bold text-xs text-primary" },
    { header: "Procedure", accessorKey: "surgeryName", className: "font-bold text-xs" },
    { header: "Patient", render: (s) => <div><div className="font-semibold">{s.patientName}</div><div className="text-[11px] text-foreground-muted font-mono">{s.uhid}</div></div> },
    { header: "Surgeon Team", render: (s) => <div><div>{s.leadSurgeon}</div><div className="text-[11px] text-foreground-muted">Anesth: {s.anesthetist}</div></div> },
    { header: "Slot Time", accessorKey: "scheduledTime", className: "font-mono text-xs" },
    { header: "Status", render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Operation Theatre (OT) & Surgical Suites
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Surgical rosters, anesthesia clearance, scrub nurse allocations, and PACU recovery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active Surgeries" value="1" subtitle="OT-1 Cardiac Suite" />
        <StatCard title="Scheduled Today" value="5" subtitle="3 Elective · 2 Emergency" />
        <StatCard title="Available OT Suites" value="3 / 5" subtitle="OT-2, OT-3, Minor OT" />
        <StatCard title="In Recovery (PACU)" value="2 Patients" subtitle="Monitoring stable" />
      </div>

      <Table data={schedules} columns={columns} keyExtractor={(s) => s.id} pageSize={6} />
    </div>
  );
}
