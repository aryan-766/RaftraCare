"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SplineSceneBasic } from "@/components/ui/demo";
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
  Syringe,
  Thermometer,
  Microscope,
  Users,
  Building2,
  Calendar,
  FileHeart,
  Hospital,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(3); // Consultation by default
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [selectedTool, setSelectedTool] = useState<string>("stethoscope");

  const clinicalTools = [
    {
      id: "stethoscope",
      name: "Stethoscope & Vitals",
      icon: Stethoscope,
      category: "OPD & Clinical Auscultation",
      metric: "72 BPM · S1/S2 Normal",
      color: "from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-500",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      description: "Digital heart & lung phonocardiograms auto-transcribed into single-screen EMR notes with zero paper charts.",
      specs: ["Auscultation Audio Recording", "ICD-10 Clinical Suggestions", "40-Second Consult Speed"],
    },
    {
      id: "syringe",
      name: "Syringes & IV Infusions",
      icon: Syringe,
      category: "Nursing & Medication Administration",
      metric: "50 mL/hr Normal Saline",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      description: "Barcode-scanned 5-Rights medication safety: right patient, drug, dose, route, and time with zero double-dosing errors.",
      specs: ["IV Infusion Rate Calculator", "Adverse Drug Reaction Alerts", "e-MAR Shift Handover"],
    },
    {
      id: "microscope",
      name: "Pathology Microscope",
      icon: Microscope,
      category: "Laboratory Information (LIS)",
      metric: "HbA1c 6.2% · CBC Verified",
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-500",
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      description: "Bidirectional ASTM/HL7 analyzer sync with automatic critical panic value flags delivered to the doctor's screen instantly.",
      specs: ["Barcode Specimen Accessioning", "Pathologist Dual-Verification", "45-Min Routine Turnaround"],
    },
    {
      id: "thermometer",
      name: "Telemetry & Thermometry",
      icon: Thermometer,
      category: "Continuous Vital Tracking",
      metric: "98.4 °F · SpO2 99%",
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      description: "Continuous Bluetooth and wired monitor integration for multi-para ICU beds, fever charts, and early warning scores (NEWS2).",
      specs: ["NEWS2 Deterioration Warnings", "Bluetooth Thermometer Sync", "4-Hour Charting Reminders"],
    },
    {
      id: "ecg",
      name: "12-Lead ECG & Rhythm",
      icon: HeartPulse,
      category: "Cardiology & Emergency Care",
      metric: "Sinus Rhythm · QT 390ms",
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-500",
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      description: "Instant DICOM waveform viewer with STEMI critical alerts routed directly to the on-call cardiologist within 15 seconds.",
      specs: ["STEMI Code Blue Alerts", "Full DICOM Waveform Storage", "Cross-Branch Specialist Consult"],
    },
    {
      id: "pill",
      name: "Pharmacy & FEFO Dispensary",
      icon: Pill,
      category: "Formulary & Stock Inventory",
      metric: "Telmisartan 40mg (OD)",
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-500",
      iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      description: "Smart point-of-sale dispensing queue with First-Expiry-First-Out (FEFO) batch control, re-order alerts, and GST billing.",
      specs: ["Expiry Batch Control (FEFO)", "Automated Generic Substitution", "Real-Time Stock Depletion"],
    },
  ];

  const journeyStages = [
    {
      name: "Registration",
      time: "08:45 AM",
      actor: "Receptionist",
      icon: Users,
      desc: "Patient Raj Kumar registered via mobile. UHID HOS-001284 generated and assigned in 40 seconds.",
      kpi: "Avg 45s per registration",
      toolBadge: "UHID Barcode Generator",
    },
    {
      name: "Check-in",
      time: "08:50 AM",
      actor: "Front Desk",
      icon: Calendar,
      desc: "Token A-102 generated for Cardiology OPD (Dr. Sharma, Room 204). Scheduled 09:00 AM.",
      kpi: "Queue token issued",
      toolBadge: "Multi-Zone Token Caller",
    },
    {
      name: "Waiting",
      time: "08:55 AM",
      actor: "Queue Display",
      icon: Clock,
      desc: "Real-time waiting room TV display announces Room 204. Estimated wait time: 10 mins.",
      kpi: "Live display sync",
      toolBadge: "Waiting Room TV Screen",
    },
    {
      name: "Consultation",
      time: "09:15 AM",
      actor: "Dr. Sharma (Cardiology)",
      icon: Stethoscope,
      desc: "Doctor performs auscultation with digital stethoscope, documents chief complaint, and orders 12-lead ECG and HbA1c.",
      kpi: "Zero paper handover",
      toolBadge: "Digital Stethoscope & EMR",
    },
    {
      name: "Diagnostics",
      time: "09:40 AM",
      actor: "Laboratory & LIS",
      icon: Microscope,
      desc: "Blood sample collected at pathology counter. Digital barcode accessioned directly into automated blood analyzer.",
      kpi: "45 min turnaround",
      toolBadge: "Pathology Analyzer LIS",
    },
    {
      name: "Medication",
      time: "10:15 AM",
      actor: "Ward / Pharmacy",
      icon: Syringe,
      desc: "Prescription arrives automatically in pharmacy dispensing queue. IV saline and Telmisartan 40mg dispensed with batch tracking.",
      kpi: "FEFO batch validated",
      toolBadge: "Sterile Syringe & IV Infusion",
    },
    {
      name: "Billing",
      time: "10:30 AM",
      actor: "Cashier",
      icon: CreditCard,
      desc: "Single unified invoice consolidating consult, lab tests, and pharmacy medicines. Settled via UPI QR.",
      kpi: "₹3,200 collected",
      toolBadge: "GST & TPA Cashless Terminal",
    },
    {
      name: "Discharge / Next Visit",
      time: "10:35 AM",
      actor: "Patient WhatsApp",
      icon: FileHeart,
      desc: "Complete digital prescription and digital tax receipt delivered automatically to patient's WhatsApp.",
      kpi: "Digital copy sent",
      toolBadge: "ABDM Health Locker & WhatsApp",
    },
  ];

  const modules = [
    {
      icon: Users,
      toolIcon: Stethoscope,
      title: "Front Desk & Queue",
      desc: "Fast patient lookup by UHID, mobile, or name. Real-time multi-department token caller and TV room displays.",
      toolName: "Token Display & UHID Scanner",
    },
    {
      icon: Stethoscope,
      toolIcon: HeartPulse,
      title: "OPD Doctor Workstation",
      desc: "Single-screen clinical assessment with autosave. Chief complaints, vitals, ICD-10 diagnosis, and integrated Rx builder.",
      toolName: "Electronic Stethoscope EMR",
    },
    {
      icon: Layers,
      toolIcon: Thermometer,
      title: "IPD & Visual Bed Map",
      desc: "Ward capacity management across General, ICU, and Private wings. Color-coded status for occupied, cleaning, and reserved beds.",
      toolName: "Multi-Para Bedside Telemetry",
    },
    {
      icon: Microscope,
      toolIcon: FlaskConical,
      title: "Laboratory Information (LIS)",
      desc: "Sample accessioning, analyzer integration, two-tier pathologist verification, and abnormal value critical flags.",
      toolName: "Digital Pathology Analyzer",
    },
    {
      icon: Radio,
      toolIcon: Activity,
      title: "Radiology & DICOM PACS",
      desc: "Digital X-Ray, CT, MRI, and USG imaging workflow. Study scheduling, radiologist reporting, and browser PACS viewer.",
      toolName: "Full-Res DICOM Viewer",
    },
    {
      icon: Pill,
      toolIcon: Syringe,
      title: "Pharmacy & Stock Inventory",
      desc: "Point-of-sale prescription dispensing, batch number tracking, expiry warnings, and automatic purchase reorder levels.",
      toolName: "FEFO Barcode Dispensing",
    },
    {
      icon: CreditCard,
      toolIcon: ShieldCheck,
      title: "Revenue & Cashless Billing",
      desc: "Unified GST-compliant invoicing, cashless TPA insurance pre-authorizations, daily cashier settlement, and receipts.",
      toolName: "Cashless TPA Gateway",
    },
    {
      icon: ShieldCheck,
      toolIcon: FileHeart,
      title: "ABDM & Clinical Governance",
      desc: "Ayushman Bharat Digital Mission (M1-M3) compliant, 9-role granular RBAC matrix, and immutable compliance audit trails.",
      toolName: "ABHA ID & Consent Protocol",
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
    <div className="space-y-24 py-12 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-400/10 via-sky-300/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
        {/* Floating Doctor Tool Badges (Desktop decoration) */}
        <div className="hidden lg:block absolute -top-4 left-6 animate-pulse">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-blue-900/50 shadow-md backdrop-blur-sm text-xs font-medium text-slate-700 dark:text-slate-200">
            <Stethoscope className="w-4 h-4 text-blue-500" />
            <span>Cardiology Auscultation · 72 BPM</span>
          </div>
        </div>

        <div className="hidden lg:block absolute -top-4 right-6 animate-pulse delay-700">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-900/50 shadow-md backdrop-blur-sm text-xs font-medium text-slate-700 dark:text-slate-200">
            <Syringe className="w-4 h-4 text-emerald-500" />
            <span>Sterile Injections & IV Infusion</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-primary border border-blue-200 dark:border-blue-800 shadow-2xs">
          <img src="/logo.png" alt="RaftraCare" className="w-4 h-4 object-contain" />
          <span>RaftraCare — Enterprise Healthcare Operations Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
        </div>

        <div className="max-w-4xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark leading-[1.12]">
            One connected system for your entire hospital.
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted dark:text-foreground-mutedDark max-w-2xl mx-auto leading-relaxed">
            Connect front desk, OPD, IPD, diagnostics, pharmacy, billing, and administration
            around one single, longitudinal patient record.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/demo"
            className="h-11 px-6 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center shadow-md shadow-primary/20 transition-all gap-2"
          >
            Explore Live Dashboard <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/pricing"
            className="h-11 px-6 rounded-btn bg-white dark:bg-surface-dark border border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-primary font-bold text-sm inline-flex items-center justify-center transition-all gap-2 shadow-2xs"
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

        {/* CLINICAL INSTRUMENTS & DOCTOR TOOLS STRIP */}
        <div className="pt-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-blue-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">Stethoscope</div>
                <div className="text-[9px] text-foreground-muted truncate">OPD Auscultation</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-emerald-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Syringe className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">Syringe & IV</div>
                <div className="text-[9px] text-foreground-muted truncate">Infusion Timers</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-purple-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Microscope className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">Microscope</div>
                <div className="text-[9px] text-foreground-muted truncate">LIS Analyzer Sync</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-amber-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Thermometer className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">Thermometer</div>
                <div className="text-[9px] text-foreground-muted truncate">Vital Telemetry</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-rose-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">ECG Rhythm</div>
                <div className="text-[9px] text-foreground-muted truncate">12-Lead DICOM</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-border dark:border-border-dark shadow-2xs flex items-center gap-2.5 hover:border-cyan-400 transition-colors">
              <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <Pill className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-bold text-foreground">FEFO Pharmacy</div>
                <div className="text-[9px] text-foreground-muted truncate">Batch Barcodes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual: Realistic RaftraCare Dashboard Preview */}
        <div className="pt-4 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border dark:border-border-dark bg-white dark:bg-surface-dark shadow-2xl overflow-hidden text-left text-xs">
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live System Connected
                </span>
              </div>
            </div>

            {/* Dashboard UI Preview Content */}
            <div className="p-6 space-y-6">
              {/* Mini KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground-muted font-medium">Today&apos;s OPD</div>
                    <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold mt-1">428</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+8.4% this week</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground-muted font-medium">Waiting Queue</div>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold mt-1">37 Patients</div>
                  <div className="text-[10px] text-foreground-muted">Avg wait 14 mins</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground-muted font-medium">Bed Occupancy</div>
                    <Activity className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="text-xl font-bold mt-1">182 / 240</div>
                  <div className="text-[10px] text-primary font-semibold">75.8% Occupied</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-foreground-muted font-medium">Today&apos;s Collection</div>
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl font-bold mt-1 text-emerald-600 font-mono">₹4,82,000</div>
                  <div className="text-[10px] text-foreground-muted">186 receipts issued</div>
                </div>
              </div>

              {/* Patient Flow Snippet */}
              <div className="p-3.5 rounded-xl border border-border dark:border-border-dark bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" />
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

      {/* 2. INTERACTIVE 3D SPLINE HOSPITAL COMMAND CENTER (USER COMPONENT INTEGRATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Interactive 3D Hospital Command Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground dark:text-foreground-dark">
            Next-Generation Spatial Healthcare OS
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Drag, tilt, and interact directly with the 3D clinical model below to inspect connected hospital nodes in real time.
          </p>
        </div>

        {/* 3D Spline Scene with Spotlight & Card */}
        <SplineSceneBasic />
      </section>

      {/* 3. CLINICAL INSTRUMENTS & DOCTOR WORKSTATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Tooling & Instrumentation Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            From Physical Instruments to Seamless Software
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Doctors and nurses shouldn&apos;t adapt to clunky ERPs. RaftraCare digitizes the tools clinicians already rely on every minute.
          </p>
        </div>

        {/* Clinical Tool Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {clinicalTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-white dark:bg-surface-dark border-border dark:border-border-dark hover:border-primary/50 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-white/20 text-white" : tool.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-foreground-muted"}`}>
                    Active
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug">{tool.name}</div>
                <div className={`text-[10px] mt-1 truncate ${isSelected ? "text-blue-100" : "text-foreground-muted"}`}>
                  {tool.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Clinical Tool Deep Dive Card */}
        {(() => {
          const current = clinicalTools.find((t) => t.id === selectedTool) || clinicalTools[0];
          const Icon = current.icon;
          return (
            <Card className="p-6 md:p-8 max-w-4xl mx-auto border-l-4 border-l-primary bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 dark:from-surface-dark dark:via-surface-dark dark:to-slate-900 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border dark:border-border-dark">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${current.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark">
                      {current.name}
                    </h3>
                    <p className="text-xs text-foreground-muted">{current.category}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {current.metric}
                </div>
              </div>

              <div className="py-4 space-y-4">
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {current.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {current.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-border dark:border-border-dark flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })()}
      </section>

      {/* 4. THE PROBLEM SECTION */}
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
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-foreground">Fragmented Records</h3>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              When a patient moves from Front Desk to Doctor to Lab to Pharmacy, their demographics,
              allergies, and bills are re-entered four separate times.
            </p>
          </Card>
          <Card className="p-5 space-y-2 border-t-4 border-t-amber-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-foreground">Unbilled Procedures</h3>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Discharge summaries take hours because nurses must manually collect paper chits from
              OT, ICU, radiology, and pharmacy before final cashier billing.
            </p>
          </Card>
          <Card className="p-5 space-y-2 border-t-4 border-t-primary">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">The RaftraCare Solution</h3>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Enter information once. One single patient record carries through registration,
              consultation, orders, pharmacy dispensing, and insurance claim settlement.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. INTERACTIVE PATIENT JOURNEY */}
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
          {journeyStages.map((stage, idx) => {
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.name}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeStage === idx
                    ? "bg-primary text-white border-primary shadow-sm scale-105"
                    : "bg-white dark:bg-surface-dark border-border dark:border-border-dark hover:border-primary text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono opacity-80">{stage.time}</span>
                  <StageIcon className="w-3.5 h-3.5 opacity-90" />
                </div>
                <div className="text-xs font-bold mt-1.5 truncate">{stage.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <Card className="p-6 max-w-3xl mx-auto space-y-3 border-l-4 border-l-primary shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Stage {activeStage + 1} of 8 · {journeyStages[activeStage].actor}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary font-semibold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                {journeyStages[activeStage].toolBadge}
              </span>
              <span className="font-mono text-foreground-muted bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {journeyStages[activeStage].kpi}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark">
            {journeyStages[activeStage].name}
          </h3>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
            {journeyStages[activeStage].desc}
          </p>
        </Card>
      </section>

      {/* 6. PRODUCT MODULES */}
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
            const ToolIcon = m.toolIcon;
            return (
              <Card key={m.title} className="p-5 space-y-3 hover:shadow-card transition-shadow relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-soft dark:bg-slate-800 text-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    <ToolIcon className="w-3 h-3 text-primary" />
                    {m.toolName.split(" ")[0]}
                  </span>
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

      {/* 7. PATIENT 360 SHOWCASE */}
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

        <Card className="max-w-4xl mx-auto p-6 space-y-6 border-l-4 border-l-primary shadow-xl">
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
            <div className="text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Allergies: Penicillin, Sulfa Drugs
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-1 border border-border/60">
              <span className="font-bold text-foreground-muted uppercase text-[10px] flex items-center gap-1">
                <Pill className="w-3 h-3 text-cyan-500" />
                Active Meds
              </span>
              <div className="font-semibold">Telmisartan 40mg (OD)</div>
              <div className="font-semibold">Metformin 500mg SR (BD)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-1 border border-border/60">
              <span className="font-bold text-foreground-muted uppercase text-[10px] flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-rose-500" />
                Latest Vitals
              </span>
              <div className="font-semibold">BP 130/84 mmHg · HR 76</div>
              <div className="font-semibold">SpO2 99% · 98.4 °F</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-1 border border-border/60">
              <span className="font-bold text-foreground-muted uppercase text-[10px] flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-emerald-500" />
                Financials
              </span>
              <div className="font-semibold text-emerald-600">Balance: ₹0.00 (Paid)</div>
              <div className="text-foreground-muted">TPA: Medi Assist Approved</div>
            </div>
          </div>
        </Card>
      </section>

      {/* 8. ROLE-BASED WORKFLOWS */}
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
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Front Desk Staff</span>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              40-second patient registrations, walk-in token issuance, doctor appointment scheduling,
              and queue monitoring.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Stethoscope className="w-4 h-4" />
              <span>Clinicians & Doctors</span>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              Single-screen consultation assessment with autosave, rapid prescription drafting, and
              instant lab order tracking.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Syringe className="w-4 h-4" />
              <span>Ward Staff Nurses</span>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              Task-oriented shift checklists, medication administration timings, 4-hourly vitals, and
              inpatient doctor orders.
            </p>
          </Card>
          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>Finance & Cashiers</span>
            </div>
            <p className="text-foreground-muted leading-relaxed">
              Consolidated billing with tax items, UPI QR and POS terminal card collections, shift
              reconciliation, and TPA pre-auths.
            </p>
          </Card>
        </div>
      </section>

      {/* 9. SECURITY & TRUST */}
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

      {/* 10. FAQ SECTION (11 Questions) */}
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

      {/* 11. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-deep via-primary-900 to-slate-950 text-white space-y-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Stethoscope className="w-48 h-48 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to unify your hospital operations?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto leading-relaxed">
            Deploy RaftraCare in your hospital. Connect front desk, OPD, IPD, lab, pharmacy, and
            billing on a single proven architecture.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <a
              href="/demo"
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
