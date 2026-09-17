"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Radio, Download, Eye, Plus } from "lucide-react";

interface RadiologyStudy {
  id: string;
  studyCode: string;
  patientName: string;
  uhid: string;
  modality: "X-RAY" | "CT-SCAN" | "MRI" | "ULTRASOUND";
  studyName: string;
  status: "SCHEDULED" | "PATIENT_ARRIVED" | "COMPLETED" | "VERIFIED" | "PUBLISHED";
  radiologist: string;
  studyDate: string;
}

export default function RadiologyPage() {
  const [studies, setStudies] = useState<RadiologyStudy[]>([
    {
      id: "rad_1",
      studyCode: "RAD-2026-0182",
      patientName: "Neha Singh",
      uhid: "HOS-001285",
      modality: "X-RAY",
      studyName: "Right Knee Digital X-Ray (AP & Lateral)",
      status: "VERIFIED",
      radiologist: "Dr. S. Kulkarni (Radiologist)",
      studyDate: "2026-09-17",
    },
    {
      id: "rad_2",
      studyCode: "RAD-2026-0183",
      patientName: "Raj Kumar",
      uhid: "HOS-001284",
      modality: "X-RAY",
      studyName: "Chest Digital X-Ray PA View",
      status: "PUBLISHED",
      radiologist: "Dr. S. Kulkarni (Radiologist)",
      studyDate: "2026-09-17",
    },
    {
      id: "rad_3",
      studyCode: "RAD-2026-0184",
      patientName: "Sumit Mathur",
      uhid: "HOS-001290",
      modality: "CT-SCAN",
      studyName: "HRCT Thorax & Right Tibia 3D Reconstruction",
      status: "SCHEDULED",
      radiologist: "Dr. S. Kulkarni (Radiologist)",
      studyDate: "2026-09-17",
    },
  ]);

  const { success } = useToast();

  const columns: Column<RadiologyStudy>[] = [
    {
      header: "Study Code",
      accessorKey: "studyCode",
      className: "font-mono font-bold text-xs text-primary",
    },
    {
      header: "Modality",
      render: (s) => (
        <Badge
          variant={
            s.modality === "MRI"
              ? "purple"
              : s.modality === "CT-SCAN"
              ? "danger"
              : s.modality === "X-RAY"
              ? "primary"
              : "info"
          }
        >
          {s.modality}
        </Badge>
      ),
    },
    {
      header: "Patient",
      render: (s) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {s.patientName}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">{s.uhid}</div>
        </div>
      ),
    },
    {
      header: "Investigation Study",
      accessorKey: "studyName",
      className: "text-xs font-medium",
    },
    {
      header: "Reporting Radiologist",
      accessorKey: "radiologist",
      className: "text-xs text-foreground-muted",
    },
    {
      header: "Status",
      render: (s) => <StatusBadge status={s.status} />,
    },
    {
      header: "Action",
      render: (s) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => success("PACS Viewer", "DICOM image viewer launched.")}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View DICOM
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" /> Radiology & Medical Imaging (PACS/DICOM)
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            X-Ray, CT, MRI, Ultrasound imaging orders, radiologist verification, and DICOM viewer
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => success("Imaging Study", "New radiology scheduling drawer opened.")}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          + Schedule Imaging Study
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Today's Studies" value="48" subtitle="32 X-Ray · 10 CT · 6 MRI" />
        <StatCard title="Pending Acquisition" value="8" subtitle="Patients in waiting bay" />
        <StatCard title="Radiologist Queue" value="5" subtitle="Draft report pending" />
        <StatCard title="Verified & Released" value="35" subtitle="PACS synchronized" />
      </div>

      <Table
        data={studies}
        columns={columns}
        keyExtractor={(s) => s.id}
        pageSize={8}
        searchPlaceholder="Search imaging orders by patient name, study code, or modality..."
      />
    </div>
  );
}
