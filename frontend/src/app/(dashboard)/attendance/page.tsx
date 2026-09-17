"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CalendarCheck } from "lucide-react";

export default function AttendancePage() {
  const records = [
    { id: "att_1", name: "Dr. Rajesh Sharma", role: "DOCTOR", department: "Cardiology", checkIn: "08:24 AM", status: "PRESENT" },
    { id: "att_2", name: "Priya Verma", role: "RECEPTIONIST", department: "Front Desk", checkIn: "07:55 AM", status: "PRESENT" },
    { id: "att_3", name: "Ananya Iyer", role: "NURSE", department: "Ward A", checkIn: "07:48 AM", status: "PRESENT" },
    { id: "att_4", name: "Sunil Nair", role: "PHARMACIST", department: "Pharmacy", checkIn: "08:12 AM", status: "PRESENT" },
    { id: "att_5", name: "Dr. Arvind Rao", role: "DOCTOR", department: "Orthopedics", checkIn: "—", status: "ON_DUTY_LEAVE" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border/70 dark:border-border-dark pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary" /> Daily Staff Attendance & Biometrics
        </h1>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          Biometric fingerprint clock-ins, duty shifts, and clinical staffing coverage
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Staff on Duty" value="42 / 48" subtitle="Morning Shift Active" />
        <StatCard title="Punctuality Rate" value="95.2%" subtitle="Clock-in before 08:30 AM" />
        <StatCard title="Approved Leave" value="3" subtitle="Planned Cover Assigned" />
        <StatCard title="On-Call Doctors" value="4" subtitle="Emergency Trauma Standby" />
      </div>

      <Table
        data={records}
        columns={[
          { header: "Staff Member", accessorKey: "name", className: "font-semibold" },
          { header: "Designation", accessorKey: "role", className: "font-mono text-xs text-primary" },
          { header: "Department", accessorKey: "department" },
          { header: "Biometric Punch In", accessorKey: "checkIn", className: "font-mono text-xs" },
          { header: "Status", render: (r) => <Badge variant={r.status === "PRESENT" ? "success" : "warning"}>{r.status}</Badge> },
        ]}
        keyExtractor={(r) => r.id}
        pageSize={5}
      />
    </div>
  );
}
