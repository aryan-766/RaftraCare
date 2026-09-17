"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { Shield, UserPlus, Check, X, Users, Lock } from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function UsersAndRBACPage() {
  const [activeTab, setActiveTab] = useState("matrix");
  const { success } = useToast();

  const tabs = [
    { id: "matrix", label: "RBAC Permission Matrix" },
    { id: "staff", label: "Staff Directory (48)" },
    { id: "roles", label: "Defined Roles (9)" },
  ];

  const staffList: StaffUser[] = [
    { id: "s1", name: "Dr. Arvind Srivastava", email: "admin@metrogeneral.org", role: "HOSPITAL_ADMIN", department: "Administration", status: "ACTIVE" },
    { id: "s2", name: "Dr. Rajesh Sharma", email: "dr.sharma@metrogeneral.org", role: "DOCTOR", department: "Cardiology", status: "ACTIVE" },
    { id: "s3", name: "Priya Verma", email: "priya.frontdesk@metrogeneral.org", role: "RECEPTIONIST", department: "Front Desk", status: "ACTIVE" },
    { id: "s4", name: "Ananya Iyer", email: "ananya.nurse@metrogeneral.org", role: "NURSE", department: "Ward A", status: "ACTIVE" },
    { id: "s5", name: "Sunil Nair", email: "sunil.pharm@metrogeneral.org", role: "PHARMACIST", department: "Pharmacy", status: "ACTIVE" },
    { id: "s6", name: "Manoj Patel", email: "manoj.lab@metrogeneral.org", role: "LAB_TECHNICIAN", department: "Laboratory", status: "ACTIVE" },
    { id: "s7", name: "Deepak Jain", email: "deepak.accounts@metrogeneral.org", role: "ACCOUNTANT", department: "Accounts", status: "ACTIVE" },
  ];

  // RBAC permissions matrix as specified in Section 30 of user prompt
  const rbacMatrix = [
    {
      resource: "Patients Directory",
      receptionist: { r: true, c: true, u: true, d: false },
      doctor: { r: true, c: true, u: true, d: false },
      nurse: { r: true, c: false, u: true, d: false },
      accountant: { r: true, c: false, u: false, d: false },
    },
    {
      resource: "Clinical Notes & EMR",
      receptionist: { r: false, c: false, u: false, d: false },
      doctor: { r: true, c: true, u: true, d: false },
      nurse: { r: true, c: true, u: true, d: false },
      accountant: { r: false, c: false, u: false, d: false },
    },
    {
      resource: "Prescriptions & Dispensing",
      receptionist: { r: false, c: false, u: false, d: false },
      doctor: { r: true, c: true, u: true, d: false },
      nurse: { r: true, c: false, u: false, d: false },
      accountant: { r: true, c: false, u: false, d: false },
    },
    {
      resource: "Billing & Receipts",
      receptionist: { r: true, c: true, u: true, d: false },
      doctor: { r: false, c: false, u: false, d: false },
      nurse: { r: false, c: false, u: false, d: false },
      accountant: { r: true, c: true, u: true, d: true },
    },
    {
      resource: "Beds & Wards Allocation",
      receptionist: { r: true, c: false, u: true, d: false },
      doctor: { r: true, c: false, u: false, d: false },
      nurse: { r: true, c: true, u: true, d: false },
      accountant: { r: true, c: false, u: false, d: false },
    },
  ];

  const renderCheck = (val: boolean) =>
    val ? (
      <span className="inline-flex items-center text-emerald-600 font-bold">
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </span>
    ) : (
      <span className="inline-flex items-center text-slate-300 dark:text-slate-600">
        <X className="w-3.5 h-3.5" />
      </span>
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Users & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Role hierarchy, fine-grained resource permissions, and medical data confidentiality
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => success("Invite Staff", "Staff invitation modal opened.")}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          + Invite Employee
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* RBAC Matrix Table */}
      {activeTab === "matrix" && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
            <span className="font-bold text-foreground dark:text-foreground-dark">
              Granular Permission Matrix (Read · Create · Update · Delete)
            </span>
            <span className="text-foreground-muted">Admin role inherits full operational access</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-border dark:border-border-dark text-foreground-muted font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Resource Module</th>
                  <th className="p-3.5 text-center">Receptionist</th>
                  <th className="p-3.5 text-center">Doctor / Specialist</th>
                  <th className="p-3.5 text-center">Staff Nurse</th>
                  <th className="p-3.5 text-center">Accountant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                {rbacMatrix.map((row) => (
                  <tr key={row.resource} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-foreground dark:text-foreground-dark">
                      {row.resource}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-3 font-mono text-[11px]">
                        <span title="Read">R {renderCheck(row.receptionist.r)}</span>
                        <span title="Create">C {renderCheck(row.receptionist.c)}</span>
                        <span title="Update">U {renderCheck(row.receptionist.u)}</span>
                        <span title="Delete">D {renderCheck(row.receptionist.d)}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-3 font-mono text-[11px]">
                        <span title="Read">R {renderCheck(row.doctor.r)}</span>
                        <span title="Create">C {renderCheck(row.doctor.c)}</span>
                        <span title="Update">U {renderCheck(row.doctor.u)}</span>
                        <span title="Delete">D {renderCheck(row.doctor.d)}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-3 font-mono text-[11px]">
                        <span title="Read">R {renderCheck(row.nurse.r)}</span>
                        <span title="Create">C {renderCheck(row.nurse.c)}</span>
                        <span title="Update">U {renderCheck(row.nurse.u)}</span>
                        <span title="Delete">D {renderCheck(row.nurse.d)}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-3 font-mono text-[11px]">
                        <span title="Read">R {renderCheck(row.accountant.r)}</span>
                        <span title="Create">C {renderCheck(row.accountant.c)}</span>
                        <span title="Update">U {renderCheck(row.accountant.u)}</span>
                        <span title="Delete">D {renderCheck(row.accountant.d)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Staff Directory */}
      {activeTab === "staff" && (
        <Table
          data={staffList}
          columns={[
            { header: "Staff Member", render: (s) => <div><div className="font-bold">{s.name}</div><div className="text-foreground-muted">{s.email}</div></div> },
            { header: "Assigned Role", render: (s) => <span className="font-mono font-bold text-primary">{s.role}</span> },
            { header: "Department", accessorKey: "department" },
            { header: "Status", render: (s) => <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">{s.status}</span> },
          ]}
          keyExtractor={(s) => s.id}
          pageSize={10}
        />
      )}
    </div>
  );
}
