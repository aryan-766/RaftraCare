"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  FlaskConical,
  HeartPulse,
  Layers,
  Lock,
  Pill,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Building2,
  Calendar,
} from "lucide-react";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(2); // 2 = Waiting
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const journeyStages = [
    {
      name: "Registration",
      time: "08:45 AM",
      actor: "Receptionist",
      desc: "Patient Raj Kumar registered via mobile. UHID HOS-001284 generated and assigned in 40 seconds.",
      kpi: "Avg 45s per registration",
    },
    {
      name: "Check-in",
      time: "08:50 AM",
      actor: "Front Desk",
      desc: "Token A-102 generated for Cardiology OPD (Dr. Sharma, Room 204). Scheduled 09:00 AM.",
      kpi: "Queue token issued",
    },
    {
      name: "Waiting",
      time: "08:55 AM",
      actor: "Queue Display",
      desc: "Real-time waiting room display announces Room 204. Estimated wait time: 10 mins.",
      kpi: "Live display sync",
    },
    {
      name: "Consultation",
      time: "09:15 AM",
      actor: "Dr. Sharma",
      desc: "Doctor opens single-screen EMR, reviews vitals, documents chief complaint, and orders 12-lead ECG and HbA1c.",
      kpi: "Zero paper handover",
    },
    {
      name: "Diagnostics",
      time: "09:40 AM",
      actor: "Laboratory",
      desc: "Blood sample collected at pathology counter. Digital barcode accessioned directly into analyzer.",
      kpi: "45 min turnaround",
    },
    {
      name: "Pharmacy",
      time: "10:15 AM",
      actor: "Pharmacist",
      desc: "Prescription arrives automatically in pharmacy dispensing queue. Telmisartan 40mg dispensed with batch tracking.",
      kpi: "FEFO batch validated",
    },
    {
      name: "Billing",
      time: "10:30 AM",
      actor: "Cashier",
      desc: "Single unified invoice consolidating consult, lab tests, and pharmacy medicines. Settled via UPI QR.",
      kpi: "₹3,200 collected",
    },
    {
      name: "Discharge / Next Visit",
      time: "10:35 AM",
      actor: "Patient WhatsApp",
      desc: "Complete digital prescription and digital tax receipt delivered automatically to patient's WhatsApp.",
      kpi: "Digital copy sent",
    },
  ];

  const modules = [
    {
      icon: Users,
      title: "Front Desk & Queue",
      desc: "Fast patient lookup by UHID, mobile, or name. Real-time multi-department token caller and TV room displays.",
    },
    {
      icon: Stethoscope,
      title: "OPD Doctor Workstation",
      desc: "Single-screen clinical assessment with autosave. Chief complaints, vitals, ICD-10 diagnosis, and integrated Rx builder.",
    },
    {
      icon: Layers,
      title: "IPD & Visual Bed Map",
      desc: "Ward capacity management across General, ICU, and Private wings. Color-coded status for occupied, cleaning, and reserved beds.",
    },
    {
      icon: FlaskConical,
      title: "Laboratory Information (LIS)",
      desc: "Sample accessioning, analyzer integration, two-tier pathologist verification, and abnormal value critical flags.",
    },
    {
      icon: Radio,
      title: "Radiology & DICOM PACS",
      desc: "Digital X-Ray, CT, MRI, and USG imaging workflow. Study scheduling, radiologist reporting, and browser PACS viewer.",
    },
    {
      icon: Pill,
      title: "Pharmacy & Stock Inventory",
      desc: "Point-of-sale prescription dispensing, batch number tracking, expiry warnings, and automatic purchase reorder levels.",
    },
    {
      icon: CreditCard,
      title: "Revenue & Cashless Billing",
      desc: "Unified GST-compliant invoicing, cashless TPA insurance pre-authorizations, daily cashier settlement, and receipts.",
    },
    {
      icon: ShieldCheck,
      title: "ABDM & Clinical Governance",
      desc: "Ayushman Bharat Digital Mission (M1-M3) compliant, 9-role granular RBAC matrix, and immutable compliance audit trails.",
    },
  ];

  const faqs = [
    {
      q: "What is RaftraCare?",
      a: "RaftraCare is a modern, unified hospital operating system designed to manage front desk, OPD, IPD, laboratory, radiology, pharmacy, billing, and clinical administration on a single connected platform.",
    },
    {
      q: "Who is RaftraCare built for?",
      a: "It is built for modern multi-specialty hospitals, nursing homes, and clinic networks ranging from 20 to 500+ beds looking to replace fragmented legacy ERPs with a modern, connected workflow.",
    },
    {
      q: "Can multiple departments coordinate in real time?",
      a: "Yes. When a doctor orders a lab test or issues a prescription, it appears instantly in the respective laboratory and pharmacy queues without phone calls or manual paper movement.",
    },
    {
      q: "Can hospitals operate multiple branches?",
      a: "Yes. RaftraCare supports multi-facility enterprise tenancy. Hospital administrators can switch between facilities or view consolidated cross-branch operational analytics.",
    },
    {
      q: "Does it support fine-grained role-based access control (RBAC)?",
      a: "Yes. RaftraCare enforces a 9-role matrix (Hospital Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician, Accountant, etc.) where each role only accesses strictly authorized medical modules.",
    },
    {
      q: "Can we connect existing lab analyzers and diagnostic machines?",
      a: "Yes. RaftraCare supports standard laboratory bidirectional interfaces (ASTM / HL7) and DICOM imaging bridges for digital X-Ray and CT workstations.",
    },
    {
      q: "Does it support billing and insurance TPA pre-authorization?",
      a: "Yes. Full support for Cash, UPI, Card, Corporate schemes, and TPA cashless insurance workflows from pre-auth requests to final dossier settlement.",
    },
    {
      q: "Can we integrate automated WhatsApp reminders?",
      a: "Yes. Integrated WhatsApp Business API automatically delivers appointment confirmations, lab report PDFs, and digital discharge receipts to patient phones.",
    },
    {
      q: "Is RaftraCare ABDM (Ayushman Bharat Digital Mission) compliant?",
      a: "Yes. The architecture is engineered around the National Health Authority ABDM standards for ABHA ID creation, health locker linkage, and M1-M3 certification.",
    },
    {
      q: "Is AI mandatory to operate RaftraCare?",
      a: "No. All operational and clinical workflows are 100% deterministic and complete without AI. Practical smart assistance (smart search, document extraction) is subtle and keeps the human clinician in full control.",
    },
    {
      q: "How does patient data access and privacy work?",
      a: "Patient health information is encrypted at rest (AES-256) and in transit (TLS 1.3). Every clinical view, edit, and export is recorded in an immutable compliance audit trail.",
    },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-primary border border-blue-200 dark:border-blue-800">
          <img src="/logo.png" alt="RaftraCare" className="w-4 h-4 object-contain" />
          <span>RaftraCare — Enterprise Healthcare Operations Platform</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark leading-tight">
            One connected system for your entire hospital.
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted dark:text-foreground-mutedDark max-w-2xl mx-auto leading-relaxed">
            Connect front desk, OPD, IPD, diagnostics, pharmacy, billing, and administration
            around one single, longitudinal patient record.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/dashboard"
            className="h-11 px-6 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center shadow-sm transition-colors gap-2"
          >
            Explore Live Dashboard <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/pricing"
            className="h-11 px-6 rounded-btn bg-white dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-primary font-bold text-sm inline-flex items-center justify-center transition-colors gap-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Plans & Pricing
          </a>
          <a
            href="/signup"
            className="h-11 px-5 rounded-btn hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground text-sm font-semibold inline-flex items-center justify-center transition-colors"
          >
            Register Facility
          </a>
        </div>

        {/* Hero Visual: Realistic RaftraCare Dashboard Preview */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark shadow-2xl overflow-hidden text-left text-xs">
            {/* Window title bar */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-border dark:border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-foreground-muted ml-2">
                  app.raftracare.io/dashboard · Metro General Hospital
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Live System Connected
              </span>
            </div>

            {/* Dashboard UI Preview Content */}
            <div className="p-6 space-y-6">
              {/* Mini KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium">Today&apos;s OPD</div>
                  <div className="text-xl font-bold mt-1">428</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+8.4% this week</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium">Waiting Queue</div>
                  <div className="text-xl font-bold mt-1">37 Patients</div>
                  <div className="text-[10px] text-foreground-muted">Avg wait 14 mins</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium">Bed Occupancy</div>
                  <div className="text-xl font-bold mt-1">182 / 240</div>
                  <div className="text-[10px] text-primary font-semibold">75.8% Occupied</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium">Today&apos;s Collection</div>
                  <div className="text-xl font-bold mt-1 text-emerald-600 font-mono">₹4,82,000</div>
                  <div className="text-[10px] text-foreground-muted">186 receipts issued</div>
                </div>
              </div>

              {/* Patient Flow Snippet */}
              <div className="p-3.5 rounded-lg border border-border dark:border-border-dark bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground-muted">
                  Live Patient Flow:
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium">Registration: <strong>12</strong></span>
                  <span className="text-slate-300">→</span>
                  <span className="font-medium text-primary">Waiting: <strong>37</strong></span>
                  <span className="text-slate-300">→</span>
                  <span className="font-medium">Consultation: <strong>21</strong></span>
                  <span className="text-slate-300">→</span>
                  <span className="font-medium">Diagnostics: <strong>18</strong></span>
                  <span className="text-slate-300">→</span>
                  <span className="font-medium">Discharge: <strong>11</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Hospitals don&apos;t need more software. They need connected operations.
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
            Legacy hospitals run on 5 disconnected tools: one for reception, one for lab, an old ERP
            for billing, and paper charts for doctors. The result is duplicated data and revenue leakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 space-y-2 border-t-4 border-t-rose-500">
            <h3 className="font-bold text-sm text-foreground">Fragmented Records</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              When a patient moves from Front Desk to Doctor to Lab to Pharmacy, their demographics,
              allergies, and bills are re-entered four separate times.
            </p>
          </Card>
          <Card className="p-5 space-y-2 border-t-4 border-t-amber-500">
            <h3 className="font-bold text-sm text-foreground">Unbilled Procedures</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Discharge summaries take hours because nurses must manually collect paper chits from
              OT, ICU, radiology, and pharmacy before final cashier billing.
            </p>
          </Card>
          <Card className="p-5 space-y-2 border-t-4 border-t-primary">
            <h3 className="font-bold text-sm text-foreground">The RaftraCare Solution</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Enter information once. One single patient record carries through registration,
              consultation, orders, pharmacy dispensing, and insurance claim settlement.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. INTERACTIVE PATIENT JOURNEY */}
      <section id="journey" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            The Interactive Patient Journey
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Click each operational milestone to inspect how data seamlessly flows without manual re-entry.
          </p>
        </div>

        {/* Stage Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {journeyStages.map((stage, idx) => (
            <button
              key={stage.name}
              onClick={() => setActiveStage(idx)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeStage === idx
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white dark:bg-surface-dark border-border dark:border-border-dark hover:border-primary text-foreground"
              }`}
            >
              <div className="text-[10px] font-mono opacity-80">{stage.time}</div>
              <div className="text-xs font-bold mt-1 truncate">{stage.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Card */}
        <Card className="p-6 max-w-3xl mx-auto space-y-3 border-l-4 border-l-primary">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-primary uppercase tracking-wider">
              Stage {activeStage + 1} of 8 · {journeyStages[activeStage].actor}
            </span>
            <span className="font-mono text-foreground-muted bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {journeyStages[activeStage].kpi}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark">
            {journeyStages[activeStage].name}
          </h3>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
            {journeyStages[activeStage].desc}
          </p>
        </Card>
      </section>

      {/* 4. PRODUCT MODULES */}
      <section id="modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Comprehensive RaftraCare Modules
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Engineered for tertiary care operations. No missing departments or generic templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.title} className="p-5 space-y-3 hover:shadow-card transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-soft dark:bg-slate-800 text-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                  {m.title}
                </h3>
                <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
                  {m.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. PATIENT 360 SHOWCASE */}
      <section id="patient360" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Patient 360: Enter information once. Use it everywhere.
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            A single longitudinal patient view combining demographics, vitals, active medications,
            drug allergies, lab reports, and outstanding bills.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-6 space-y-6 border-l-4 border-l-primary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border dark:border-border-dark pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Raj Kumar</h3>
                <span className="font-mono text-xs font-bold text-primary bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  UHID: HOS-001284
                </span>
              </div>
              <p className="text-xs text-foreground-muted mt-0.5">
                46 yrs · Male · Blood Group B+ · Phone: +91 98112 45678
              </p>
            </div>
            <div className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded">
              Allergies: Penicillin, Sulfa Drugs
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="font-bold text-foreground-muted uppercase text-[10px]">Active Meds</span>
              <div className="font-semibold">Telmisartan 40mg (OD)</div>
              <div className="font-semibold">Metformin 500mg SR (BD)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="font-bold text-foreground-muted uppercase text-[10px]">Latest Vitals</span>
              <div className="font-semibold">BP 130/84 mmHg · HR 76</div>
              <div className="font-semibold">SpO2 99% · 98.4 °F</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="font-bold text-foreground-muted uppercase text-[10px]">Financials</span>
              <div className="font-semibold text-emerald-600">Balance: ₹0.00 (Paid)</div>
              <div className="text-foreground-muted">TPA: Medi Assist Approved</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. ROLE-BASED WORKFLOWS */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Tailored For Every Hospital Team
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            The sidebar and workspace automatically adjust based on clinical permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Card className="p-5 space-y-2">
            <div className="font-bold text-sm text-primary">Front Desk Staff</div>
            <p className="text-foreground-muted leading-relaxed">
              40-second patient registrations, walk-in token issuance, doctor appointment scheduling,
              and queue monitoring.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="font-bold text-sm text-primary">Clinicians & Doctors</div>
            <p className="text-foreground-muted leading-relaxed">
              Single-screen consultation assessment with autosave, rapid prescription drafting, and
              instant lab order tracking.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="font-bold text-sm text-primary">Ward Staff Nurses</div>
            <p className="text-foreground-muted leading-relaxed">
              Task-oriented shift checklists, medication administration timings, 4-hourly vitals, and
              inpatient doctor orders.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="font-bold text-sm text-primary">Finance & Cashiers</div>
            <p className="text-foreground-muted leading-relaxed">
              Consolidated billing with tax items, UPI QR and POS terminal card collections, shift
              reconciliation, and TPA pre-auths.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. SECURITY & TRUST */}
      <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-primary" /> Enterprise Security & Compliance
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Engineered for high-security hospital environments holding sensitive health data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <Card className="p-5 space-y-2">
            <h3 className="font-bold text-sm">Role-Based Access (RBAC)</h3>
            <p className="text-foreground-muted leading-relaxed">
              Receptionists cannot view clinical assessment notes. Pharmacists only see dispensing
              queues. Strict separation of medical duties.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-bold text-sm">Immutable Audit Logs</h3>
            <p className="text-foreground-muted leading-relaxed">
              Every patient lookup, clinical note modification, and data export is cryptographically
              logged with timestamp, user ID, and IP address.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <h3 className="font-bold text-sm">ABDM M1-M3 Architecture</h3>
            <p className="text-foreground-muted leading-relaxed">
              Built to comply with the National Health Authority guidelines for ABHA creation,
              consent managers, and health data exchange.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. FAQ SECTION (11 Questions) */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Factual architecture, deployment, and operational details about RaftraCare.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <Card key={idx} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left font-bold text-foreground dark:text-foreground-dark flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-foreground-muted shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 text-foreground-muted dark:text-foreground-mutedDark leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-deep via-primary-900 to-slate-950 text-white space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to unify your hospital operations?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto leading-relaxed">
            Deploy RaftraCare in your hospital. Connect front desk, OPD, IPD, lab, pharmacy, and
            billing on a single proven architecture.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/dashboard"
              className="h-11 px-6 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center shadow-md transition-colors"
            >
              Launch Live Workspace
            </a>
            <a
              href="/signup"
              className="h-11 px-6 rounded-btn bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
            >
              Register Organization
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
