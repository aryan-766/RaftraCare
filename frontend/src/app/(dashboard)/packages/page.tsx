"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Tags, Plus } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface HealthPackage {
  id: string;
  name: string;
  department: string;
  inclusions: string;
  price: number;
}

export default function PackagesPage() {
  const { success } = useToast();
  const packages: HealthPackage[] = [
    { id: "pkg_1", name: "Comprehensive Cardiac Checkup", department: "Cardiology", inclusions: "ECG, 2D Echo, TMT, Lipid Profile, Troponin-I, Specialist Consult", price: 4500 },
    { id: "pkg_2", name: "Executive Diabetic Wellness", department: "General Medicine", inclusions: "HbA1c, Fasting Blood Sugar, Lipid, Kidney Function, Eye Screening", price: 2800 },
    { id: "pkg_3", name: "Master Health Checkup (Senior)", department: "Preventive Health", inclusions: "Whole Body Screen, Ultrasound Abdomen, Chest X-Ray, LFT, KFT, CBC", price: 6200 },
    { id: "pkg_4", name: "Normal Delivery Package (IPD 3 Days)", department: "Obstetrics", inclusions: "Labour Room, Pediatrician Neonatal, 3-day General Ward stay, Nursing", price: 35000 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" /> Hospital Treatment Packages & Pricing Rate Card
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Bundled IPD surgical procedures, preventive wellness packages, and service tariffs
          </p>
        </div>
        <Button size="sm" onClick={() => success("Package Form", "New tariff builder opened.")} leftIcon={<Plus className="w-4 h-4" />}>
          + Create New Package
        </Button>
      </div>

      <Table
        data={packages}
        columns={[
          { header: "Package Title", accessorKey: "name", className: "font-bold text-xs" },
          { header: "Department", accessorKey: "department", className: "text-xs" },
          { header: "Inclusions & Services", accessorKey: "inclusions", className: "text-xs text-foreground-muted max-w-md truncate" },
          { header: "Bundled Price", render: (p) => <span className="font-mono font-bold text-primary">₹{p.price.toLocaleString()}</span> },
        ]}
        keyExtractor={(p) => p.id}
        pageSize={6}
      />
    </div>
  );
}
