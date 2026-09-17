"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { MOCK_BEDS, MOCK_WARDS } from "@/lib/mock/data";
import { Bed } from "@/types";
import { BedDouble, User, Check, RefreshCw, Layers } from "lucide-react";

export default function BedsAndWardsPage() {
  const [selectedWard, setSelectedWard] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [beds, setBeds] = useState<Bed[]>(MOCK_BEDS);
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);
  const { success } = useToast();

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== "ALL" && b.ward_id !== selectedWard) return false;
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (status: Bed["status"]) => {
    if (!activeBedModal) return;
    setBeds((prev) =>
      prev.map((b) => (b.id === activeBedModal.id ? { ...b, status } : b))
    );
    setActiveBedModal({ ...activeBedModal, status });
    success("Bed Status Updated", `Bed ${activeBedModal.bed_number} changed to ${status}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Beds & Ward Management
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Real-time inpatient occupancy, bed turnover, and transfer allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="h-8 text-xs w-44"
          >
            <option value="ALL">All Wards</option>
            <option value="ward_a">Ward A (Medical)</option>
            <option value="ward_icu">Main ICU</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 text-xs w-36"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="CLEANING">Cleaning</option>
            <option value="RESERVED">Reserved</option>
          </Select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard title="Total Capacity" value="240" subtitle="Across 4 Wards" />
        <StatCard title="Occupied Beds" value="182" change="75.8%" changeType="neutral" />
        <StatCard title="Available Beds" value="38" subtitle="Ready for admission" />
        <StatCard title="Under Cleaning" value="12" subtitle="Housekeeping in progress" />
        <StatCard title="Reserved" value="8" subtitle="OT & Elective Planned" />
      </div>

      {/* Visual Interactive Bed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
            Interactive Floor Map
          </h3>
          <span className="text-xs text-foreground-muted">Click any bed to manage status or patient</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredBeds.map((bed) => {
            const isOccupied = bed.status === "OCCUPIED";
            const isAvailable = bed.status === "AVAILABLE";
            const isCleaning = bed.status === "CLEANING";
            const isReserved = bed.status === "RESERVED";

            return (
              <Card
                key={bed.id}
                hover
                onClick={() => setActiveBedModal(bed)}
                className={`p-3.5 cursor-pointer text-xs space-y-2 border-t-4 transition-transform active:scale-95 ${
                  isOccupied
                    ? "border-t-primary"
                    : isAvailable
                    ? "border-t-emerald-500"
                    : isCleaning
                    ? "border-t-amber-400"
                    : "border-t-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-foreground dark:text-foreground-dark">
                    {bed.bed_number}
                  </span>
                  <StatusBadge status={bed.status} />
                </div>

                <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                  {bed.ward_name}
                </div>

                {isOccupied && bed.current_patient_name ? (
                  <div className="pt-2 border-t border-border/60 dark:border-border-dark">
                    <div className="font-bold text-foreground dark:text-foreground-dark truncate">
                      {bed.current_patient_name}
                    </div>
                    <div className="text-[10px] text-foreground-muted font-mono">
                      {bed.current_patient_uhid}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-border/60 dark:border-border-dark text-[11px] font-semibold text-emerald-600">
                    ₹{bed.daily_charge.toLocaleString()}/day
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bed Details & Action Modal */}
      <Modal
        isOpen={!!activeBedModal}
        onClose={() => setActiveBedModal(null)}
        title={`Bed ${activeBedModal?.bed_number} — ${activeBedModal?.ward_name}`}
        description="Bed assignment and housekeeping status controls"
      >
        {activeBedModal && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Current Status:</span>
                <StatusBadge status={activeBedModal.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Daily Rate:</span>
                <span className="font-bold">₹{activeBedModal.daily_charge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Floor & Wing:</span>
                <span>{activeBedModal.floor}</span>
              </div>
              {activeBedModal.current_patient_name && (
                <>
                  <div className="flex justify-between pt-1 border-t border-border/60">
                    <span className="text-foreground-muted">Admitted Patient:</span>
                    <span className="font-bold text-foreground dark:text-foreground-dark">
                      {activeBedModal.current_patient_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">UHID:</span>
                    <span className="font-mono">{activeBedModal.current_patient_uhid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Admitted At:</span>
                    <span>{activeBedModal.admitted_at}</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted">
                Change Bed Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus("AVAILABLE")}
                >
                  Set Available
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus("CLEANING")}
                >
                  Mark Cleaning
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus("MAINTENANCE")}
                >
                  Maintenance
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus("RESERVED")}
                >
                  Reserve Bed
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-border dark:border-border-dark flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setActiveBedModal(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
