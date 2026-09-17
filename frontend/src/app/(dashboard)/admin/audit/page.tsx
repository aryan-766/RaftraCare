"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { MOCK_AUDIT_LOGS } from "@/lib/mock/data";
import { AuditLogItem } from "@/types";
import { ShieldCheck, FileSpreadsheet } from "lucide-react";

export default function AuditLogsPage() {
  const columns: Column<AuditLogItem>[] = [
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      className: "font-mono text-xs font-semibold",
      sortable: true,
    },
    {
      header: "Actor / Staff",
      render: (a) => (
        <div>
          <div className="font-bold text-foreground dark:text-foreground-dark">{a.user_name}</div>
          <div className="text-[10px] font-mono text-primary">{a.user_role}</div>
        </div>
      ),
    },
    {
      header: "Action",
      render: (a) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
            a.action === "CREATE"
              ? "bg-emerald-50 text-emerald-700"
              : a.action === "UPDATE"
              ? "bg-blue-50 text-primary"
              : "bg-red-50 text-red-700"
          }`}
        >
          {a.action}
        </span>
      ),
    },
    {
      header: "Resource Target",
      render: (a) => (
        <div>
          <span className="font-semibold">{a.resource_type}</span>
          <span className="text-[11px] font-mono text-foreground-muted ml-1.5">({a.resource_id})</span>
        </div>
      ),
    },
    {
      header: "Audit Details",
      accessorKey: "details",
      className: "max-w-md truncate text-foreground-muted",
    },
    {
      header: "IP Address",
      accessorKey: "ip_address",
      className: "font-mono text-xs text-foreground-muted",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Immutable Compliance Audit Logs
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Cryptographically sealed trail of who accessed, modified, or exported patient records
          </p>
        </div>
      </div>

      <Table
        data={MOCK_AUDIT_LOGS}
        columns={columns}
        keyExtractor={(a) => a.id}
        pageSize={10}
        searchPlaceholder="Filter audit trails by staff name, action, or resource..."
        exportFilename="hospitalos-audit-logs"
      />
    </div>
  );
}
