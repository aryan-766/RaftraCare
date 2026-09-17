"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Receipt, Download } from "lucide-react";

interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  invoiceNumber: string;
  patientName: string;
  uhid: string;
  amount: number;
  method: "CASH" | "UPI" | "CARD" | "INSURANCE";
  timestamp: string;
  status: "SUCCESSFUL" | "PENDING" | "REFUNDED";
}

export default function PaymentsLedgerPage() {
  const [payments] = useState<PaymentTransaction[]>([
    {
      id: "pay_1",
      receiptNumber: "RCPT-2026-0812",
      invoiceNumber: "INV-2026-0891",
      patientName: "Raj Kumar",
      uhid: "HOS-001284",
      amount: 3200,
      method: "UPI",
      timestamp: "Today, 09:40 AM",
      status: "SUCCESSFUL",
    },
    {
      id: "pay_2",
      receiptNumber: "RCPT-2026-0813",
      invoiceNumber: "INV-2026-0892",
      patientName: "Neha Singh",
      uhid: "HOS-001285",
      amount: 1000,
      method: "CASH",
      timestamp: "Today, 09:50 AM",
      status: "SUCCESSFUL",
    },
    {
      id: "pay_3",
      receiptNumber: "RCPT-2026-0810",
      invoiceNumber: "INV-2026-0888",
      patientName: "Vikram Malhotra",
      uhid: "HOS-001288",
      amount: 4500,
      method: "CARD",
      timestamp: "Today, 08:30 AM",
      status: "SUCCESSFUL",
    },
  ]);

  const { success } = useToast();

  const columns: Column<PaymentTransaction>[] = [
    {
      header: "Receipt #",
      accessorKey: "receiptNumber",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      className: "font-mono text-xs text-foreground-muted",
    },
    {
      header: "Patient",
      render: (p) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">{p.patientName}</div>
          <div className="text-[11px] font-mono text-foreground-muted">{p.uhid}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "patientName",
    },
    {
      header: "Amount Paid",
      render: (p) => (
        <span className="font-mono font-bold text-emerald-600">
          ₹{p.amount.toLocaleString()}
        </span>
      ),
      sortable: true,
      accessorKey: "amount",
    },
    {
      header: "Payment Method",
      render: (p) => (
        <Badge variant="primary" dot>
          {p.method}
        </Badge>
      ),
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      className: "text-xs text-foreground-muted",
    },
    {
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" /> Daily Payments & Settlement Ledger
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Cash, UPI QR, POS terminal credit card collections, and cashier shift handovers
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => success("Export", "Payment transactions exported to Excel.")}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Ledger
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Collected" value="₹4,82,000" subtitle="Today (17 Sep)" />
        <StatCard title="UPI / Digital QR" value="₹2,68,000" subtitle="55% of receipts" />
        <StatCard title="Cash at Cashier" value="₹1,24,000" subtitle="Vault handover ready" />
        <StatCard title="Card POS Terminal" value="₹90,000" subtitle="Batch settled" />
      </div>

      <Table
        data={payments}
        columns={columns}
        keyExtractor={(p) => p.id}
        pageSize={10}
        searchPlaceholder="Filter receipts by receipt #, invoice #, or patient..."
        exportFilename="hospitalos-payments-ledger"
      />
    </div>
  );
}
