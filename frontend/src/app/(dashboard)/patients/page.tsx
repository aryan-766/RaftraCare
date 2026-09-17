"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { MOCK_PATIENTS } from "@/lib/mock/data";
import { Patient } from "@/types";
import { UserPlus, Filter, Phone, Calendar, ArrowRight } from "lucide-react";

export default function PatientsDirectoryPage() {
  const router = useRouter();

  const columns: Column<Patient>[] = [
    {
      header: "UHID",
      render: (p) => (
        <span className="font-mono font-bold text-primary dark:text-blue-400">
          {p.uhid}
        </span>
      ),
      sortable: true,
      accessorKey: "uhid",
    },
    {
      header: "Patient Name",
      render: (p) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {p.first_name} {p.last_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {p.gender} · {p.age} years · {p.blood_group || "B+"}
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: "first_name",
    },
    {
      header: "Contact",
      render: (p) => (
        <div className="text-foreground dark:text-foreground-dark">
          <div>{p.phone}</div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark truncate max-w-[180px]">
            {p.address}
          </div>
        </div>
      ),
    },
    {
      header: "Allergies / Conditions",
      render: (p) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {p.allergies && p.allergies.length > 0 ? (
            p.allergies.map((a) => (
              <span
                key={a}
                className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
              >
                {a}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
              None recorded
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Last Visit",
      render: (p) => (
        <div>
          <div className="font-medium">{p.last_visit_date || "—"}</div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {p.last_doctor_name || "—"}
          </div>
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
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Patient 360°
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Patients Master Directory
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Complete longitudinal patient database and unified electronic health records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => router.push("/front-desk")}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          >
            + Register Patient
          </Button>
        </div>
      </div>

      {/* Patients Table */}
      <Table
        data={MOCK_PATIENTS}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Filter patients by name, UHID, phone, or conditions..."
        pageSize={10}
        onRowClick={(p) => router.push(`/patients/${p.id}`)}
        exportFilename="hospitalos-patients"
      />
    </div>
  );
}
