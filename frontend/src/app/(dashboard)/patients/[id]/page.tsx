"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Table, Column } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import {
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_PRESCRIPTIONS,
  MOCK_LAB_ORDERS,
  MOCK_INVOICES,
  MOCK_INSURANCE_CLAIMS,
} from "@/lib/mock/data";
import {
  User,
  Heart,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Plus,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Patient360Page() {
  const params = useParams();
  const router = useRouter();
  const { success } = useToast();
  const patientId = params.id as string;

  const patient =
    MOCK_PATIENTS.find((p) => p.id === patientId || p.uhid === patientId) || MOCK_PATIENTS[0];

  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline Feed" },
    { id: "appointments", label: "Appointments", count: 2 },
    { id: "prescriptions", label: "Prescriptions", count: 1 },
    { id: "lab", label: "Lab Reports", count: 2 },
    { id: "radiology", label: "Radiology", count: 1 },
    { id: "admissions", label: "Admissions", count: 1 },
    { id: "bills", label: "Bills & Invoices", count: 2 },
    { id: "insurance", label: "Insurance / TPA", count: 1 },
    { id: "documents", label: "Documents" },
  ];

  // Timeline entries
  const timelineEntries = [
    {
      date: "17 Sep 2026, 09:40 AM",
      title: "OPD Consultation & Clinical Assessment",
      doctor: "Dr. Rajesh Sharma (Cardiology)",
      desc: "Patient presented with mild chest tightness on brisk exertion. BP 130/84 mmHg, Pulse 76 bpm. 12-lead ECG ordered, Telmisartan 40mg maintained.",
      badge: "OPD",
      type: "clinical",
    },
    {
      date: "17 Sep 2026, 10:15 AM",
      title: "Laboratory Results Published",
      doctor: "Dr. K. Saxena (Pathologist)",
      desc: "HbA1c reported at 7.8% (HIGH). Serum Creatinine 1.05 mg/dL (Normal). Troponin-I negative (<0.01 ng/mL).",
      badge: "Diagnostic",
      type: "lab",
    },
    {
      date: "16 Sep 2026, 04:30 PM",
      title: "Pharmacy Dispensed",
      doctor: "Sunil Nair (Pharmacist)",
      desc: "Dispensed Telmisartan 40mg (30 Tabs), Metformin 500mg SR (60 Tabs). Total billed: ₹840.",
      badge: "Pharmacy",
      type: "pharmacy",
    },
    {
      date: "10 Aug 2026, 11:00 AM",
      title: "Follow-up Cardiology Consult",
      doctor: "Dr. Rajesh Sharma",
      desc: "Regular quarterly cardiac review post-stent placement. Echo shows EF 55%, good wall motion.",
      badge: "OPD",
      type: "clinical",
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Back navigation */}
      <button
        onClick={() => router.push("/patients")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted dark:text-foreground-mutedDark hover:text-foreground dark:hover:text-foreground-dark transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Patients Directory
      </button>

      {/* Patient Master Header */}
      <Card className="p-5 border-l-4 border-l-primary">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-soft dark:bg-slate-800 text-primary font-bold text-xl flex items-center justify-center shrink-0">
              {patient.first_name[0]}
              {patient.last_name[0]}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground dark:text-foreground-dark">
                  {patient.first_name} {patient.last_name}
                </h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-primary dark:text-blue-300 border border-blue-200/80 dark:border-blue-900">
                  UHID: {patient.uhid}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                  Active Patient
                </span>
              </div>

              <div className="text-xs text-foreground-muted dark:text-foreground-mutedDark flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  <strong>{patient.age} yrs</strong> · {patient.gender}
                </span>
                <span>
                  Blood Group: <strong>{patient.blood_group || "B+"}</strong>
                </span>
                <span>Phone: {patient.phone}</span>
                <span>City: Gurugram</span>
              </div>

              {/* Critical allergy tags */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Drug Allergies:
                  </span>
                  {patient.allergies.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.2 rounded font-bold text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                success("Print Ready", "Patient summary sent to printer.");
                window.print();
              }}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Summary
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/appointments")}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Book Appointment
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/billing")}
              leftIcon={<CreditCard className="w-3.5 h-3.5" />}
            >
              Create Bill
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Vitals & Clinical Context (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vitals Grid */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" /> Recorded Vitals (Today, 09:15 AM)
                </h3>
                <span className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                  Nurse: Ananya Iyer
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/80 dark:border-border-dark text-center">
                  <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-medium">
                    Blood Pressure
                  </div>
                  <div className="text-lg font-bold text-foreground dark:text-foreground-dark mt-0.5">
                    130 / 84
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Normal / Stage 1</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/80 dark:border-border-dark text-center">
                  <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-medium">
                    Heart Rate
                  </div>
                  <div className="text-lg font-bold text-foreground dark:text-foreground-dark mt-0.5">
                    76 bpm
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Regular rhythm</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/80 dark:border-border-dark text-center">
                  <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-medium">
                    SpO2 Oxygen
                  </div>
                  <div className="text-lg font-bold text-foreground dark:text-foreground-dark mt-0.5">
                    99%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Room air</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/80 dark:border-border-dark text-center">
                  <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-medium">
                    Temperature / Weight
                  </div>
                  <div className="text-lg font-bold text-foreground dark:text-foreground-dark mt-0.5">
                    98.4°F
                  </div>
                  <span className="text-[10px] text-foreground-muted dark:text-foreground-mutedDark">
                    78.2 kg (BMI 25.4)
                  </span>
                </div>
              </div>
            </Card>

            {/* Active Medications */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark flex items-center gap-2">
                Active Medications (2)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-border/70 dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground dark:text-foreground-dark">
                      Telmisartan 40mg Tablet
                    </div>
                    <div className="text-foreground-muted dark:text-foreground-mutedDark text-[11px]">
                      1 Tab Once daily (Morning after breakfast) · 30 Days supply
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-border/70 dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground dark:text-foreground-dark">
                      Metformin 500mg SR Tablet
                    </div>
                    <div className="text-foreground-muted dark:text-foreground-mutedDark text-[11px]">
                      1 Tab Twice daily (With meals) · 30 Days supply
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                    Active
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Diagnoses & Reports */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark">
                Recent Laboratory Findings
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark text-foreground-muted dark:text-foreground-mutedDark">
                      <th className="py-2">Test Name</th>
                      <th className="py-2">Result</th>
                      <th className="py-2">Reference Range</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
                    <tr>
                      <td className="py-2 font-medium">HbA1c</td>
                      <td className="py-2 font-bold text-rose-600">7.8 %</td>
                      <td className="py-2 text-foreground-muted">4.0 - 5.6 %</td>
                      <td className="py-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 rounded">
                          HIGH
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Serum Creatinine</td>
                      <td className="py-2 font-bold">1.05 mg/dL</td>
                      <td className="py-2 text-foreground-muted">0.7 - 1.3 mg/dL</td>
                      <td className="py-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded">
                          NORMAL
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Column: Financial & Insurance Snapshot (1 col) */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark">
                Billing & Account Balance
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark">
                    Total Invoiced (Lifetime)
                  </span>
                  <span className="font-semibold">₹1,48,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted dark:text-foreground-mutedDark">
                    Paid / Settled
                  </span>
                  <span className="font-semibold text-emerald-600">₹1,48,200</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border dark:border-border-dark">
                  <span className="font-bold text-foreground dark:text-foreground-dark">
                    Current Outstanding
                  </span>
                  <span className="font-bold text-emerald-600 text-sm">₹0 (Clear)</span>
                </div>
              </div>
            </Card>

            {/* Insurance Policy Card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Active TPA Insurance
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-foreground dark:text-foreground-dark">
                  Medi Assist TPA Pvt Ltd
                </div>
                <div className="text-foreground-muted dark:text-foreground-mutedDark">
                  Policy: <span className="font-mono font-medium">STAR-HLTH-8839210</span>
                </div>
                <div className="text-foreground-muted dark:text-foreground-mutedDark">
                  Sum Insured: ₹5,00,000 · Pre-auth Pre-approved: ₹1,25,000
                </div>
              </div>
            </Card>

            {/* Emergency Contacts */}
            <Card className="p-4 space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground dark:text-foreground-dark">
                Emergency Contact
              </h3>
              <div className="font-medium text-foreground dark:text-foreground-dark">
                {patient.emergency_contact_name || "Sunita Kumar (Wife)"}
              </div>
              <div className="text-foreground-muted dark:text-foreground-mutedDark font-mono">
                {patient.emergency_contact_phone || "+91 98112 45679"}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline Feed */}
      {activeTab === "timeline" && (
        <Card className="p-6">
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border dark:before:bg-border-dark">
            {timelineEntries.map((item, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-surface-dark" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-medium text-foreground-muted dark:text-foreground-mutedDark">
                      {item.date}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-primary">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                    {item.title}
                  </h4>
                  <div className="text-xs font-medium text-primary dark:text-blue-400">
                    {item.doctor}
                  </div>
                  <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Other tabs gracefully render realistic data */}
      {activeTab === "bills" && (
        <Table
          data={MOCK_INVOICES.filter((i) => i.patient_uhid === patient.uhid)}
          columns={[
            { header: "Invoice #", accessorKey: "invoice_number", className: "font-mono font-bold" },
            { header: "Services", accessorKey: "services_summary" },
            { header: "Amount", render: (i) => `₹${i.total_amount.toLocaleString()}` },
            { header: "Status", render: (i) => <StatusBadge status={i.status} /> },
            { header: "Date", accessorKey: "created_at" },
          ]}
          keyExtractor={(i) => i.id}
          pageSize={5}
        />
      )}

      {activeTab === "lab" && (
        <Table
          data={MOCK_LAB_ORDERS.filter((l) => l.patient_uhid === patient.uhid)}
          columns={[
            { header: "Order #", accessorKey: "order_number", className: "font-mono font-bold" },
            { header: "Ordered Tests", render: (l) => l.tests.map((t) => t.test_name).join(", ") },
            { header: "Sample", accessorKey: "sample_type" },
            { header: "Status", render: (l) => <StatusBadge status={l.status} /> },
            { header: "Date", accessorKey: "order_date" },
          ]}
          keyExtractor={(l) => l.id}
          pageSize={5}
        />
      )}

      {activeTab === "prescriptions" && (
        <Table
          data={MOCK_PRESCRIPTIONS.filter((rx) => rx.patient_uhid === patient.uhid)}
          columns={[
            { header: "Rx Number", accessorKey: "prescription_number", className: "font-mono font-bold" },
            { header: "Prescribed Medications", render: (rx) => rx.items.map((i) => i.medicine_name).join("; ") },
            { header: "Doctor", accessorKey: "doctor_name" },
            { header: "Status", render: (rx) => <StatusBadge status={rx.status} /> },
            { header: "Date", accessorKey: "date" },
          ]}
          keyExtractor={(rx) => rx.id}
          pageSize={5}
        />
      )}

      {activeTab === "appointments" && (
        <Table
          data={MOCK_APPOINTMENTS.filter((a) => a.patient_uhid === patient.uhid)}
          columns={[
            { header: "Time", accessorKey: "appointment_time" },
            { header: "Doctor / Department", render: (a) => `${a.doctor_name} (${a.department_name})` },
            { header: "Token", accessorKey: "token_number", className: "font-mono font-bold" },
            { header: "Status", render: (a) => <StatusBadge status={a.status} /> },
          ]}
          keyExtractor={(a) => a.id}
          pageSize={5}
        />
      )}
    </div>
  );
}
