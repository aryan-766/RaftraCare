"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { MOCK_MEDICINES } from "@/lib/mock/data";
import { Medicine } from "@/types";
import { Package, AlertTriangle, Plus, Download } from "lucide-react";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const { success } = useToast();

  const columns: Column<Medicine>[] = [
    {
      header: "Medicine & Strength",
      render: (m) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {m.name}
          </div>
          <div className="text-[11px] text-foreground-muted">
            {m.generic_name} · {m.category}
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: "name",
    },
    {
      header: "Batch #",
      accessorKey: "batch_number",
      className: "font-mono font-bold text-xs",
    },
    {
      header: "Expiry Date",
      render: (m) => {
        const isExpiring = m.expiry_date.startsWith("2026-10");
        return (
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-xs ${isExpiring ? "text-rose-600 font-bold" : ""}`}>
              {m.expiry_date}
            </span>
            {isExpiring && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                Expiring
              </span>
            )}
          </div>
        );
      },
      sortable: true,
      accessorKey: "expiry_date",
    },
    {
      header: "Current Stock",
      render: (m) => {
        const isLow = m.current_stock <= m.reorder_level;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-xs ${isLow ? "text-amber-600" : ""}`}>
              {m.current_stock}
            </span>
            {isLow && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Low Stock
              </span>
            )}
          </div>
        );
      },
      sortable: true,
      accessorKey: "current_stock",
    },
    {
      header: "Reserved",
      accessorKey: "reserved_stock",
      className: "font-mono text-xs text-foreground-muted",
    },
    {
      header: "Reorder Level",
      accessorKey: "reorder_level",
      className: "font-mono text-xs text-foreground-muted",
    },
    {
      header: "Unit Price",
      render: (m) => <span className="font-semibold font-mono">₹{m.unit_price}</span>,
    },
    {
      header: "Supplier",
      accessorKey: "supplier",
      className: "text-xs text-foreground-muted",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Pharmacy Stock & Inventory
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Medicine stock levels, batch numbers, FEFO expiry tracking, and purchase replenishment
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => success("Stock Added", "New GRN purchase stock entry modal opened.")}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          + Add Stock / Purchase PO
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total SKUs" value="1,480" subtitle="Active formulary" />
        <StatCard title="Stock Valuation" value="₹18.4L" subtitle="At cost price" />
        <StatCard title="Below Reorder Level" value="4 items" changeType="negative" subtitle="Purchase order pending" />
        <StatCard title="Expiring within 30 Days" value="2 batches" changeType="negative" subtitle="Atorvastatin Batch 2401" />
      </div>

      {/* Inventory Table */}
      <Table
        data={medicines}
        columns={columns}
        keyExtractor={(m) => m.id}
        pageSize={8}
        searchPlaceholder="Search medicines by brand name, generic name, or batch #..."
        exportFilename="hospitalos-medicine-inventory"
      />
    </div>
  );
}
