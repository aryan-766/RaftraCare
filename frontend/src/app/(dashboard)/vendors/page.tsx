"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Building, Plus } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function VendorsPage() {
  const { success } = useToast();
  const vendors = [
    { id: "v1", name: "Cipla Healthcare Ltd", category: "Pharmaceuticals", contact: "+91 22 2482 1000", email: "orders@cipla.com", paymentTerms: "30 Days Net" },
    { id: "v2", name: "Sun Pharma Laboratories", category: "Pharmaceuticals", contact: "+91 22 4324 4324", email: "hospital.supplies@sunpharma.com", paymentTerms: "45 Days Net" },
    { id: "v3", name: "GE Healthcare Life Sciences", category: "Biomedical Equipment", contact: "+91 80 4111 2000", email: "service.india@gehealthcare.com", paymentTerms: "100% Advance" },
    { id: "v4", name: "Transasia Bio-Medicals Ltd", category: "Diagnostic Lab Reagents", contact: "+91 22 4030 9000", email: "sales@transasia.co.in", paymentTerms: "30 Days Net" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Vendor & Supplier Master Directory
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Pharmaceutical manufacturers, surgical consumable suppliers, and biomedical service partners
          </p>
        </div>
        <Button size="sm" onClick={() => success("Vendor Form", "New vendor registration opened.")} leftIcon={<Plus className="w-4 h-4" />}>
          + Add New Vendor
        </Button>
      </div>

      <Table
        data={vendors}
        columns={[
          { header: "Vendor Enterprise", accessorKey: "name", className: "font-bold text-xs" },
          { header: "Supply Category", accessorKey: "category", className: "text-xs text-primary font-medium" },
          { header: "Phone", accessorKey: "contact", className: "font-mono text-xs text-foreground-muted" },
          { header: "Official Email", accessorKey: "email", className: "text-xs text-foreground-muted" },
          { header: "Payment Terms", accessorKey: "paymentTerms", className: "text-xs" },
        ]}
        keyExtractor={(v) => v.id}
        pageSize={6}
      />
    </div>
  );
}
