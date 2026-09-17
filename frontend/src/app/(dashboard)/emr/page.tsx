"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { MOCK_PATIENTS } from "@/lib/mock/data";
import { Patient } from "@/types";
import { FileSpreadsheet, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EMRPage() {
  const router = useRouter();

  const columns: Column<Patient>[] = [
    {
      header: "UHID",
      accessorKey: "uhid",
      className: "font-mono font-bold text-xs text-primary",
    },
    {
      header: "Patient Name",
      render: (p) => (
        <div>
          <div className="font-bold">{p.first_name} {p.last_name}</div>
          <div className="text-[11px] text-foreground-muted">{p.age} yrs · {p.gender}</div>
        </div>
      ),
    },
    {
      header: "Chronic Conditions",
      render: (p) => (
        <span className="text-xs">
          {p.chronic_conditions?.join(", ") || "None recorded"}
        </span>
      ),
    },
    {
      header: "Last Encounter",
      render: (p) => (
        <div>
          <div>{p.last_visit_date}</div>
          <div className="text-[11px] text-foreground-muted">{p.last_doctor_name}</div>
        </div>
      ),
    },
    {
      header: "Action",
      render: (p) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/patients/${p.id}`)}
          rightIcon={<ArrowRight className="w-3 h-3" />}
        >
          Open Longitudinal EMR
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border/70 dark:border-border-dark pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" /> Longitudinal Electronic Medical Records (EMR)
        </h1>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          Unified patient histories, clinical documentation, encounter notes, and diagnostic archives
        </p>
      </div>

      <Table
        data={MOCK_PATIENTS}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search EMR records by patient name or UHID..."
      />
    </div>
  );
}
