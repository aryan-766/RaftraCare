"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { StatCard, Card } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";
import { MOCK_INVOICES } from "@/lib/mock/data";
import { Invoice } from "@/types";
import { CreditCard, Printer, Check, Plus, ShieldCheck, Download } from "lucide-react";

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { success } = useToast();

  const handleRecordPayment = () => {
    if (!selectedInvoice) return;
    const balance = selectedInvoice.balance_amount;
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === selectedInvoice.id
          ? { ...i, paid_amount: i.total_amount, balance_amount: 0, status: "PAID" }
          : i
      )
    );
    success(
      "Payment Recorded",
      `₹${balance.toLocaleString()} recorded for ${selectedInvoice.invoice_number}. Receipt issued.`
    );
    setSelectedInvoice(null);
  };

  const columns: Column<Invoice>[] = [
    {
      header: "Invoice #",
      accessorKey: "invoice_number",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient",
      render: (inv) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {inv.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{inv.patient_uhid}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "Services Summary",
      accessorKey: "services_summary",
      className: "max-w-xs truncate text-xs",
    },
    {
      header: "Total Amount",
      render: (inv) => (
        <span className="font-bold font-mono text-foreground dark:text-foreground-dark">
          ₹{inv.total_amount.toLocaleString()}
        </span>
      ),
      sortable: true,
      accessorKey: "total_amount",
    },
    {
      header: "Paid",
      render: (inv) => (
        <span className="font-mono text-emerald-600 font-semibold">
          ₹{inv.paid_amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Balance",
      render: (inv) => (
        <span className={`font-mono font-semibold ${inv.balance_amount > 0 ? "text-rose-600" : "text-slate-400"}`}>
          ₹{inv.balance_amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      render: (inv) => <StatusBadge status={inv.status} />,
    },
    {
      header: "Action",
      render: (inv) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(inv)}>
          View Receipt
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
            Hospital Revenue & Billing
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Patient invoices, cashier settlement, TPA insurance claims, and tax receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => success("New Bill", "Billing encounter drawer opened.")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Create New Invoice
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Today's Collection" value="₹4,82,000" change="+14.2%" changeType="positive" subtitle="Cash + UPI + Card" />
        <StatCard title="Pending Receivables" value="₹1,24,000" changeType="negative" subtitle="18 Unsettled Invoices" />
        <StatCard title="Insurance / TPA" value="₹3,48,000" subtitle="Pre-auth claims pending" />
        <StatCard title="Refunds Processed" value="₹4,500" subtitle="2 Inpatient adjustments" />
      </div>

      {/* Invoice Ledger Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Invoice Ledger
          </h3>
          <span className="text-xs text-foreground-muted">GST Compliant Billing</span>
        </div>
        <Table
          data={invoices}
          columns={columns}
          keyExtractor={(i) => i.id}
          pageSize={8}
          searchPlaceholder="Search by invoice #, patient name, or UHID..."
          exportFilename="hospitalos-billing-invoices"
        />
      </div>

      {/* Professional Printable Invoice Drawer */}
      <Drawer
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Tax Invoice & Cash Receipt"
        subtitle={`Invoice: ${selectedInvoice?.invoice_number}`}
      >
        {selectedInvoice && (
          <div className="space-y-5 text-xs bg-white dark:bg-surface-dark p-2">
            {/* Header info */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-foreground dark:text-foreground-dark">
                    Metro General Hospital
                  </div>
                  <div className="text-foreground-muted text-[11px]">
                    Sector 18, Gurugram, Haryana · GSTIN: 06AABCM1234F1Z8
                  </div>
                </div>
                <StatusBadge status={selectedInvoice.status} />
              </div>

              <div className="pt-2 border-t border-border/60 dark:border-border-dark grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-foreground-muted">Billed To: </span>
                  <strong className="text-foreground dark:text-foreground-dark">
                    {selectedInvoice.patient_name}
                  </strong>
                  <div className="text-foreground-muted font-mono">
                    UHID: {selectedInvoice.patient_uhid}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground-muted">
                    Date: {selectedInvoice.created_at.split("T")[0]}
                  </div>
                  <div className="font-mono text-foreground-muted">
                    Due: {selectedInvoice.due_date}
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border dark:border-border-dark text-[11px] font-bold text-foreground-muted">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                  {selectedInvoice.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-2.5 font-medium">{it.description}</td>
                      <td className="p-2.5 text-center font-mono">{it.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{it.unit_price.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        ₹{it.total_price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Calculation */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Subtotal:</span>
                <span className="font-mono">₹{selectedInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Discount / Scheme:</span>
                <span className="font-mono text-emerald-600">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Healthcare GST:</span>
                <span className="font-mono">Exempt</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/60 text-sm font-bold">
                <span>Net Payable:</span>
                <span className="text-primary font-mono">
                  ₹{selectedInvoice.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono">₹{selectedInvoice.paid_amount.toLocaleString()}</span>
              </div>
              {selectedInvoice.balance_amount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold pt-1">
                  <span>Balance Due:</span>
                  <span className="font-mono">
                    ₹{selectedInvoice.balance_amount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border dark:border-border-dark flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Receipt
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
                {selectedInvoice.balance_amount > 0 && (
                  <Button size="sm" variant="primary" onClick={handleRecordPayment}>
                    Record Settlement (₹{selectedInvoice.balance_amount.toLocaleString()})
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
