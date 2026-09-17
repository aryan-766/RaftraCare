"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { MOCK_LAB_ORDERS } from "@/lib/mock/data";
import { LabOrder } from "@/types";
import { FlaskConical, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export default function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const { success } = useToast();

  const tabs = [
    { id: "all", label: "All Orders", count: orders.length },
    { id: "SAMPLE_PENDING", label: "Sample Pending", count: 1 },
    { id: "PROCESSING", label: "Processing", count: 1 },
    { id: "VERIFIED", label: "Verified & Published", count: 1 },
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const columns: Column<LabOrder>[] = [
    {
      header: "Order #",
      accessorKey: "order_number",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient",
      render: (o) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {o.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{o.patient_uhid}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "Tests Requested",
      render: (o) => (
        <span className="font-medium text-xs">
          {o.tests.map((t) => t.test_name).join("; ")}
        </span>
      ),
    },
    {
      header: "Sample Type",
      accessorKey: "sample_type",
      className: "text-xs text-foreground-muted",
    },
    {
      header: "Priority",
      render: (o) => (
        <Badge variant={o.priority === "URGENT" ? "danger" : "default"}>
          {o.priority}
        </Badge>
      ),
    },
    {
      header: "Status",
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      header: "Action",
      render: (o) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(o)}>
          Inspect Results
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
            Diagnostic Laboratory
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Pathology accessioning, analyzer integration, and verified report release
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => success("New Order", "Lab accession barcode generated.")}
          leftIcon={<FlaskConical className="w-4 h-4" />}
        >
          + New Lab Order
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Today's Orders" value="142" subtitle="88 Routine · 54 Stat" />
        <StatCard title="Samples Processing" value="18" subtitle="Avg turnaround 45 min" />
        <StatCard title="Critical Flags" value="3" changeType="negative" subtitle="Troponin & Potassium" />
        <StatCard title="Verified & Released" value="121" subtitle="98% on-time TAT" />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Orders Table */}
      <Table
        data={filteredOrders}
        columns={columns}
        keyExtractor={(o) => o.id}
        pageSize={8}
        exportFilename="hospitalos-lab-orders"
      />

      {/* Lab Result Screen (Clearly distinguishes: Test, Result, Unit, Reference Range, Flag, Verified By, Verified At) */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Diagnostic Result — ${selectedOrder?.order_number}`}
        description={`Patient: ${selectedOrder?.patient_name} (${selectedOrder?.patient_uhid})`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="overflow-x-auto border border-border dark:border-border-dark rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border dark:border-border-dark">
                  <tr className="text-foreground-muted dark:text-foreground-mutedDark text-[11px] uppercase font-bold">
                    <th className="p-3">Test</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Reference Range</th>
                    <th className="p-3">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                  {selectedOrder.tests.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-foreground dark:text-foreground-dark">
                        {t.test_name}
                      </td>
                      <td className="p-3 font-bold font-mono">
                        {t.result || "Processing..."}
                      </td>
                      <td className="p-3 text-foreground-muted">{t.unit || "—"}</td>
                      <td className="p-3 text-foreground-muted font-mono">{t.reference_range || "—"}</td>
                      <td className="p-3">
                        {t.flag ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              t.flag === "HIGH"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {t.flag}
                          </span>
                        ) : (
                          <span className="text-foreground-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedOrder.tests[0]?.verified_by && (
              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-300">
                    Verified by: {selectedOrder.tests[0].verified_by}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Verified At: {selectedOrder.tests[0].verified_at}
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-border dark:border-border-dark">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  success("Report Exported", "Diagnostic report PDF downloaded.");
                  setSelectedOrder(null);
                }}
              >
                Print / Download PDF
              </Button>
              <Button size="sm" variant="primary" onClick={() => setSelectedOrder(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
