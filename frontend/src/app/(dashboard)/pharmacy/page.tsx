"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { Drawer } from "@/components/ui/Drawer";
import { useToast } from "@/components/ui/Toast";
import { MOCK_PRESCRIPTIONS, MOCK_MEDICINES } from "@/lib/mock/data";
import { Prescription, Medicine } from "@/types";
import { Pill, AlertTriangle, Check, Search, ArrowRight, Package } from "lucide-react";

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const { success } = useToast();

  const handleDispense = () => {
    if (!selectedRx) return;
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === selectedRx.id ? { ...rx, status: "DISPENSED" } : rx))
    );
    success(
      "Prescription Dispensed",
      `${selectedRx.prescription_number} dispensed and stock deducted from pharmacy inventory.`
    );
    setSelectedRx(null);
  };

  const columns: Column<Prescription>[] = [
    {
      header: "Rx Number",
      accessorKey: "prescription_number",
      className: "font-mono font-bold text-xs text-primary",
      sortable: true,
    },
    {
      header: "Patient",
      render: (rx) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {rx.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{rx.patient_uhid}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "Prescribed Items",
      render: (rx) => (
        <span className="font-medium text-xs">
          {rx.items.map((i) => i.medicine_name).join("; ")}
        </span>
      ),
    },
    {
      header: "Doctor",
      accessorKey: "doctor_name",
      className: "text-xs",
    },
    {
      header: "Status",
      render: (rx) => <StatusBadge status={rx.status} />,
    },
    {
      header: "Action",
      render: (rx) => (
        <Button
          size="sm"
          variant={rx.status === "DISPENSED" ? "outline" : "primary"}
          onClick={() => setSelectedRx(rx)}
        >
          {rx.status === "DISPENSED" ? "View Dispensed" : "Dispense Now"}
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
            Hospital Pharmacy & Dispensing
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Prescription verification, batch allocation, and point-of-sale dispensing
          </p>
        </div>
        <a
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Package className="w-4 h-4" /> Open Medicine Stock Inventory →
        </a>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Pending Prescriptions" value="14" subtitle="Avg dispensing time 4 mins" />
        <StatCard title="Dispensed Today" value="186" subtitle="₹1.42L Total revenue" />
        <StatCard title="Low Stock Alerts" value="4" changeType="negative" subtitle="Reorder required" />
        <StatCard title="Expiring Soon (<30d)" value="2" changeType="negative" subtitle="Atorvastatin Batch 2401" />
      </div>

      {/* Prescriptions Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Active Prescription Queue
          </h3>
          <span className="text-xs text-foreground-muted">Live sync with doctor EMR</span>
        </div>
        <Table
          data={prescriptions}
          columns={columns}
          keyExtractor={(rx) => rx.id}
          pageSize={8}
          searchPlaceholder="Search by prescription #, patient, or medicine..."
        />
      </div>

      {/* Dispensing Drawer */}
      <Drawer
        isOpen={!!selectedRx}
        onClose={() => setSelectedRx(null)}
        title="Dispense Prescription"
        subtitle={`Rx: ${selectedRx?.prescription_number} · Patient: ${selectedRx?.patient_name}`}
      >
        {selectedRx && (
          <div className="space-y-5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark space-y-1.5">
              <div className="font-semibold text-foreground dark:text-foreground-dark">
                Prescribing Physician: {selectedRx.doctor_name}
              </div>
              <div className="text-foreground-muted">
                UHID: <span className="font-mono">{selectedRx.patient_uhid}</span> · Date: {selectedRx.date}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted">
                Medication Items Verification
              </h4>
              {selectedRx.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border dark:border-border-dark space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground dark:text-foreground-dark">
                      {item.medicine_name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock (1450 units)
                    </span>
                  </div>
                  <div className="text-foreground-muted">
                    Dosage: {item.dosage} · Frequency: {item.frequency} · Duration: {item.duration}
                  </div>
                  <div className="text-[11px] text-primary">
                    Instruction: {item.instructions}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border dark:border-border-dark flex items-center justify-between">
              <div>
                <div className="text-[11px] text-foreground-muted">Total Pharmacy Bill</div>
                <div className="text-base font-bold text-foreground dark:text-foreground-dark">
                  ₹840.00
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedRx(null)}>
                  Close
                </Button>
                {selectedRx.status !== "DISPENSED" && (
                  <Button size="sm" variant="primary" onClick={handleDispense}>
                    Confirm & Deduct Stock
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
