"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { AlertTriangle, Clock, Activity, UserPlus, ArrowRight } from "lucide-react";

interface ERCase {
  id: string;
  erCode: string;
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  arrivalTime: string;
  status: "TRIAGE" | "RESUSCITATION" | "ATTENDING_DOCTOR" | "OBSERVATION" | "DISPOSITION";
  assignedDoctor: string;
}

export default function EmergencyPage() {
  const [cases, setCases] = useState<ERCase[]>([
    {
      id: "er_1",
      erCode: "ER-0917-01",
      patientName: "Harish Chandra",
      age: 62,
      gender: "MALE",
      chiefComplaint: "Acute severe crushing chest pain radiating to left arm, diaphoresis",
      priority: "CRITICAL",
      arrivalTime: "10:14 AM",
      status: "RESUSCITATION",
      assignedDoctor: "Dr. Arvind Srivastava",
    },
    {
      id: "er_2",
      erCode: "ER-0917-02",
      patientName: "Sumit Mathur",
      age: 28,
      gender: "MALE",
      chiefComplaint: "Road traffic accident, suspected compound fracture right tibia",
      priority: "HIGH",
      arrivalTime: "10:28 AM",
      status: "ATTENDING_DOCTOR",
      assignedDoctor: "Dr. Arvind Rao",
    },
    {
      id: "er_3",
      erCode: "ER-0917-03",
      patientName: "Deepika Sharma",
      age: 34,
      gender: "FEMALE",
      chiefComplaint: "High grade fever with severe chills and dehydration",
      priority: "MEDIUM",
      arrivalTime: "10:35 AM",
      status: "OBSERVATION",
      assignedDoctor: "Dr. Meenakshi Sundaram",
    },
  ]);

  const { success } = useToast();

  const columns: Column<ERCase>[] = [
    {
      header: "ER Code",
      accessorKey: "erCode",
      className: "font-mono font-bold text-xs",
    },
    {
      header: "Priority",
      render: (c) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
            c.priority === "CRITICAL"
              ? "bg-red-600 text-white animate-pulse"
              : c.priority === "HIGH"
              ? "bg-amber-500 text-white"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {c.priority}
        </span>
      ),
    },
    {
      header: "Patient",
      render: (c) => (
        <div>
          <div className="font-bold text-foreground dark:text-foreground-dark">
            {c.patientName}
          </div>
          <div className="text-[11px] text-foreground-muted">
            {c.age} yrs · {c.gender}
          </div>
        </div>
      ),
    },
    {
      header: "Chief Complaint",
      accessorKey: "chiefComplaint",
      className: "max-w-xs truncate text-xs",
    },
    {
      header: "Arrival Time",
      accessorKey: "arrivalTime",
      className: "font-mono text-xs",
    },
    {
      header: "Attending Doctor",
      accessorKey: "assignedDoctor",
      className: "font-medium text-xs text-primary",
    },
    {
      header: "Workflow Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Emergency & Trauma Triage
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            24/7 Red-code intake, rapid resuscitation protocols, and ER disposition tracking
          </p>
        </div>

        <Button
          size="sm"
          variant="danger"
          onClick={() => success("Rapid Triage", "Emergency intake initiated.")}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          + Urgent ER Intake
        </Button>
      </div>

      {/* Triage Flow Stepper (Visual) */}
      <Card className="p-4 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-2">
          Emergency Clinical Workflow
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
          {[
            "1. Arrival",
            "2. Registration",
            "3. Triage",
            "4. Priority",
            "5. Doctor",
            "6. Orders",
            "7. Treatment",
            "8. Disposition",
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-white dark:bg-surface-dark border border-border dark:border-border-dark font-medium"
            >
              {step}
            </div>
          ))}
        </div>
      </Card>

      {/* ER KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Active ER Cases" value={cases.length} subtitle="1 Resuscitation Bay" />
        <StatCard title="Critical (Red)" value="1" changeType="negative" subtitle="Immediate care" />
        <StatCard title="Average Triage Time" value="4 mins" subtitle="Target < 5 mins" />
        <StatCard title="Available ER Bays" value="6 / 12" subtitle="Bay 1-6 free" />
      </div>

      {/* Active ER Table */}
      <Table
        data={cases}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Search ER cases by patient or code..."
      />
    </div>
  );
}
