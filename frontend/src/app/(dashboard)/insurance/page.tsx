"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { StatCard, Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { MOCK_INSURANCE_CLAIMS } from "@/lib/mock/data";
import { InsuranceClaim } from "@/types";
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2, FileCheck } from "lucide-react";

export default function InsuranceTPAPage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>(MOCK_INSURANCE_CLAIMS);
  const { success } = useToast();

  const workflowSteps = [
    "1. Policy Verification",
    "2. Pre-auth Request",
    "3. TPA Approval",
    "4. Inpatient Treatment",
    "5. Final Claim Dossier",
    "6. Query Resolution",
    "7. Bank Settlement",
  ];

  const columns: Column<InsuranceClaim>[] = [
    {
      header: "Claim #",
      accessorKey: "claim_number",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient",
      render: (c) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {c.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{c.patient_uhid}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "TPA & Policy Number",
      render: (c) => (
        <div>
          <div className="font-medium text-foreground dark:text-foreground-dark">{c.tpa_name}</div>
          <div className="text-[11px] font-mono text-foreground-muted">{c.policy_number}</div>
        </div>
      ),
    },
    {
      header: "Estimated Cost",
      render: (c) => <span className="font-mono">₹{c.estimated_cost.toLocaleString()}</span>,
    },
    {
      header: "Approved Sum",
      render: (c) => (
        <span className="font-mono font-bold text-emerald-600">
          {c.approved_amount > 0 ? `₹${c.approved_amount.toLocaleString()}` : "Pending"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      header: "Action",
      render: (c) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            success("TPA Portal Opened", `Interfacing with ${c.tpa_name} API portal.`)
          }
        >
          Track Claim
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Insurance & TPA Desk
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Cashless pre-authorization, claim submissions, queries, and insurer settlements
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => success("Claim Initiated", "New cashless pre-auth form opened.")}
        >
          + New Cashless Pre-auth
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Pre-auth Pending" value="14" subtitle="Medi Assist, Star Health, Vidal" />
        <StatCard title="Claims Pending" value="23" subtitle="Dossier under audit" />
        <StatCard title="Queries Raised" value="7" changeType="negative" subtitle="Medical docs required" />
        <StatCard title="Total Outstanding" value="₹8.4L" subtitle="Receivable from TPAs" />
      </div>

      {/* Visual Workflow Steps */}
      <Card className="p-4 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-2">
          Insurance & Cashless Claim Life Cycle
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-white dark:bg-surface-dark border border-border dark:border-border-dark font-medium"
            >
              {step}
            </div>
          ))}
        </div>
      </Card>

      {/* Claims Table */}
      <Table
        data={claims}
        columns={columns}
        keyExtractor={(c) => c.id}
        pageSize={8}
        searchPlaceholder="Search claims by patient name, policy #, or TPA..."
        exportFilename="hospitalos-insurance-claims"
      />
    </div>
  );
}
