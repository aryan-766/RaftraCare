"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FeaturesCards } from "@/components/ui/FeaturesCards";

const Warp = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Warp),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-950/40 via-slate-950/60 to-slate-900/80 animate-pulse" />
    ),
  }
);

const Beams = dynamic(
  () => import("@/components/ui/Beams").then((mod) => mod.Beams),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#030712] animate-pulse" />
    ),
  }
);
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
  Syringe,
  Scissors,
  Check,
  Zap,
  Microscope,
  Thermometer,
  Eye,
  FileCheck,
} from "lucide-react";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState(2); // 2 = Waiting
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [selectedToolTab, setSelectedToolTab] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const moduleShaderConfigs = [
    {
      proportion: 0.35,
      softness: 0.9,
      distortion: 0.18,
      swirl: 0.7,
      swirlIterations: 8,
      shape: "checks" as const,
      shapeScale: 0.08,
      colors: ["hsl(210, 100%, 25%)", "hsl(190, 100%, 60%)", "hsl(220, 90%, 35%)", "hsl(200, 100%, 70%)"],
    },
    {
      proportion: 0.4,
      softness: 1.1,
      distortion: 0.2,
      swirl: 0.85,
      swirlIterations: 10,
      shape: "stripes" as const,
      shapeScale: 0.1,
      colors: ["hsl(195, 100%, 25%)", "hsl(175, 100%, 55%)", "hsl(215, 90%, 30%)", "hsl(185, 100%, 65%)"],
    },
    {
      proportion: 0.38,
      softness: 1.0,
      distortion: 0.16,
      swirl: 0.75,
      swirlIterations: 9,
      shape: "checks" as const,
      shapeScale: 0.09,
      colors: ["hsl(230, 100%, 30%)", "hsl(250, 100%, 65%)", "hsl(220, 90%, 40%)", "hsl(240, 100%, 70%)"],
    },
    {
      proportion: 0.42,
      softness: 1.2,
      distortion: 0.22,
      swirl: 0.9,
      swirlIterations: 12,
      shape: "stripes" as const,
      shapeScale: 0.12,
      colors: ["hsl(270, 100%, 30%)", "hsl(290, 100%, 60%)", "hsl(260, 90%, 35%)", "hsl(280, 100%, 65%)"],
    },
    {
      proportion: 0.36,
      softness: 0.85,
      distortion: 0.17,
      swirl: 0.8,
      swirlIterations: 8,
      shape: "checks" as const,
      shapeScale: 0.1,
      colors: ["hsl(180, 100%, 25%)", "hsl(160, 100%, 55%)", "hsl(190, 90%, 35%)", "hsl(170, 100%, 65%)"],
    },
    {
      proportion: 0.44,
      softness: 1.15,
      distortion: 0.21,
      swirl: 0.78,
      swirlIterations: 11,
      shape: "stripes" as const,
      shapeScale: 0.11,
      colors: ["hsl(150, 100%, 25%)", "hsl(130, 100%, 55%)", "hsl(160, 90%, 35%)", "hsl(140, 100%, 65%)"],
    },
    {
      proportion: 0.37,
      softness: 0.95,
      distortion: 0.19,
      swirl: 0.82,
      swirlIterations: 10,
      shape: "checks" as const,
      shapeScale: 0.09,
      colors: ["hsl(35, 100%, 30%)", "hsl(50, 100%, 60%)", "hsl(25, 90%, 35%)", "hsl(45, 100%, 65%)"],
    },
    {
      proportion: 0.4,
      softness: 1.05,
      distortion: 0.18,
      swirl: 0.88,
      swirlIterations: 12,
      shape: "stripes" as const,
      shapeScale: 0.1,
      colors: ["hsl(220, 100%, 30%)", "hsl(200, 100%, 65%)", "hsl(240, 90%, 35%)", "hsl(210, 100%, 75%)"],
    },
  ];

  const clinicalTools = [
    {
      id: "stethoscope",
      title: "Littmann Diagnostic Stethoscope",
      category: "Cardiovascular & Respiratory Telemetry",
      badge: "Real-Time Telemetry",
      image: "/images/doctor-workspace.jpg",
      description:
        "High-fidelity acoustic and digital frequency amplification. Acoustic signals translate into waveform rhythm strips directly in the doctor's EMR consultation view.",
      specs: [
        { label: "Acoustic Frequency Range", value: "20 Hz – 2000 Hz" },
        { label: "EMR Waveform Sync", value: "Instant 0-Latency" },
        { label: "Clinical Precision", value: "Lead II Rhythm Audio & ECG Correlation" },
        { label: "Integration Standard", value: "FHIR DiagnosticReport / IEEE 11073" },
      ],
      points: [
        "Auscultation notes automatically populate in Dr. Consultation assessment tab",
        "Acoustic phonocardiogram recorded alongside patient vitals with 1-click review",
        "Abnormal murmur or wheeze alerts flagged for senior physician consultation",
      ],
    },
    {
      id: "surgical-tray",
      title: "Sterile OT Prep & Surgical Tray",
      category: "Infection Control & Instrument RFID Tracking",
      badge: "Sterilization Validated",
      image: "/images/surgical-tray.png",
      description:
        "Standardized medical preparation tray containing surgical hemostatic clamps, precision syringes, sterile latex-free gloves, gauze, and alcohol prep swabs. Linked to central sterile supply department (CSSD).",
      specs: [
        { label: "Sterilization Protocol", value: "Autoclave Class B 134°C" },
        { label: "Lot & Batch Audit", value: "Barcode & RFID Scanned #OT-9842" },
        { label: "Surgical Safety Checklist", value: "WHO 3-Phase Sign-In/Out Sync" },
        { label: "Traceability", value: "Logged to Patient OT Dossier" },
      ],
      points: [
        "Pre-op surgical kit verification with auto-depletion from hospital CSSD inventory",
        "Expiry alerts prevent usage of unsterilized or outdated prep packs in OT",
        "Seamless billing integration: procedure consumables added to bill without manual chits",
      ],
    },
    {
      id: "clinical-workstation",
      title: "Doctor's Bedside Consultation Station",
      category: "Ambulatory & Inpatient EMR Workstation",
      badge: "Single-Screen Interface",
      image: "/images/clinical-hero-bg.jpg",
      description:
        "Bedside clinical tablet and high-resolution ICU monitor integration. Synchronizes 12-lead ECG, blood pressure, oxygen saturation (SpO2), and core body temperature directly into the chart.",
      specs: [
        { label: "Monitor Telemetry", value: "HR 78 bpm · SpO2 99% · BP 120/80" },
        { label: "Critical Alarm Matrix", value: "Automated Ward Nursing Notification" },
        { label: "Input Speed", value: "Single-click order sets & voice typing" },
        { label: "Compliance", value: "HL7 FHIR R4 & ABDM M2 Compliant" },
      ],
      points: [
        "Eliminates nurse clipboard charting with direct medical hardware data pipelines",
        "Early Warning Score (MEWS) auto-calculated from live vitals every 15 minutes",
        "Doctors review bedside telemetry remotely from anywhere within the facility",
      ],
    },
    {
      id: "syringe-prep",
      title: "Precision Medication & Syringe Kits",
      category: "Pharmacy Dispense & High-Alert Drug Safety",
      badge: "Closed-Loop Barcode Admin",
      image: "/images/doctor-workspace.jpg",
      description:
        "Unit-dose syringes, pre-filled ampoules, and medication blister packs verified with 5-Rights bedside barcode scanning (Right Patient, Right Drug, Right Dose, Right Route, Right Time).",
      specs: [
        { label: "Safety Verification", value: "BCMA 5-Rights Barcode Validation" },
        { label: "Allergy Interlocking", value: "Cross-checked against EHR allergy profile" },
        { label: "Double Sign-off", value: "Enforced for Insulin, Heparin & Narcotics" },
        { label: "Pharmacy Link", value: "Real-time stock deduction with FEFO rotation" },
      ],
      points: [
        "Nurse scans patient wristband UHID and syringe barcode before administration",
        "Prevents medication errors and double doses across nursing shift handovers",
        "Instant ledger entry for pharmacy revenue with zero unaccounted wastage",
      ],
    },
  ];

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

  const currentTool = clinicalTools[selectedToolTab];

  return (
    <div className="space-y-20 pb-12 md:pb-20 overflow-hidden">
      {/* 1. HERO SECTION WITH 3D ETHEREAL BEAMS BACKDROP */}
      <section className="relative w-full overflow-hidden bg-[#030712] text-white pt-8 md:pt-12 pb-16 -mt-6">
        {/* 3D Ethereal Light Beams Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Beams
            beamWidth={2.8}
            beamHeight={22}
            beamNumber={11}
            lightColor="#e0f2fe"
            diffuseColor="#060d1f"
            speed={1.6}
            noiseIntensity={1.7}
            scale={0.18}
            rotation={36}
            transparentBackground={false}
          />
        </div>

        {/* Central Contrast Shield: Keeps text 100% crisp, readable, and glare-free */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(3,7,18,0.85)_0%,_rgba(3,7,18,0.55)_55%,_rgba(3,7,18,0.25)_80%,_transparent_100%)] pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/50 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background dark:from-background-dark to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Clinical Telemetry Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 text-white border border-white/20 shadow-xl backdrop-blur-md mb-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="RaftraCare" className="w-4 h-4 object-contain brightness-200" />
              <span className="font-bold text-white tracking-wide">RaftraCare</span>
              <span className="text-white/40">|</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-[11px]">OT Telemetry Live</span>
            </div>
            <span className="text-white/40 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-200 font-mono text-[11px]">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>ECG 78 bpm · SpO2 99%</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-5">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
              One connected system for your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-200">
                entire hospital
              </span>
              .
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Connect front desk, OPD, IPD, doctor workstations, surgical trays, diagnostics, pharmacy,
              and cashless billing around one single, longitudinal patient record.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <a
              href="/signup"
              className="h-11 px-6 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center shadow-lg shadow-primary/40 hover:shadow-xl transition-all gap-2"
            >
              Explore Live System <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/signup"
              className="h-11 px-5 rounded-btn border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold inline-flex items-center justify-center backdrop-blur-md transition-colors"
            >
              Register Facility
            </a>
          </div>

        {/* Hero Visual: Realistic RaftraCare Dashboard & Clinical Vitals Strip */}
        <div className="pt-10 max-w-5xl mx-auto relative">
          {/* Subtle Glow behind Card */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500/20 via-primary/25 to-blue-600/20 rounded-2xl blur-xl opacity-75 dark:opacity-50 -z-10" />

          <div className="rounded-xl border border-border dark:border-border-dark bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden text-left text-xs">
            {/* Window title bar */}
            <div className="px-4 py-3 bg-slate-50/90 dark:bg-slate-900/90 border-b border-border dark:border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-mono text-[11px] text-foreground-muted ml-2">
                  app.raftracare.io/dashboard · Metro General Hospital
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                  <Stethoscope className="w-3 h-3" /> OPD Room 204 Active
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Live System Connected
                </span>
              </div>
            </div>

            {/* Dashboard UI Preview Content */}
            <div className="p-6 space-y-6">
              {/* Mini KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium flex items-center justify-between">
                    <span>Today&apos;s OPD</span>
                    <Stethoscope className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="text-xl font-bold mt-1">428</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+8.4% this week</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium flex items-center justify-between">
                    <span>Waiting Queue</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold mt-1">37 Patients</div>
                  <div className="text-[10px] text-foreground-muted">Avg wait 14 mins</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium flex items-center justify-between">
                    <span>Bed Occupancy</span>
                    <Layers className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div className="text-xl font-bold mt-1">182 / 240</div>
                  <div className="text-[10px] text-primary font-semibold">75.8% Occupied</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70">
                  <div className="text-[11px] text-foreground-muted font-medium flex items-center justify-between">
                    <span>Today&apos;s Collection</span>
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl font-bold mt-1 text-emerald-600 font-mono">₹4,82,000</div>
                  <div className="text-[10px] text-foreground-muted">186 receipts issued</div>
                </div>
              </div>

              {/* Patient Flow Snippet */}
              <div className="p-3.5 rounded-lg border border-border dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Live Patient Flow:
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
      </div>
    </section>

      {/* 2. DEDICATED CLINICAL TOOLS & DOCTOR OPERATING ENVIRONMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Instrumentation & OT Integration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground dark:text-foreground-dark tracking-tight">
            Built for the doctor&apos;s physical & digital toolkit.
          </h2>
          <p className="text-sm sm:text-base text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
            From the Littmann stethoscope at the doctor&apos;s desk to sterile surgical trays in the OT,
            RaftraCare bridges physical clinical instruments directly into the patient chart.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border dark:border-border-dark max-w-full overflow-x-auto">
            {clinicalTools.map((tool, idx) => (
              <button
                key={tool.id}
                onClick={() => setSelectedToolTab(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedToolTab === idx
                    ? "bg-white dark:bg-surface-dark text-primary shadow-sm border border-border/50"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                {idx === 0 && <Stethoscope className="w-3.5 h-3.5 text-primary" />}
                {idx === 1 && <Scissors className="w-3.5 h-3.5 text-sky-500" />}
                {idx === 2 && <Activity className="w-3.5 h-3.5 text-rose-500" />}
                {idx === 3 && <Syringe className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{tool.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tool Showcase Card */}
        <Card className="p-6 md:p-8 overflow-hidden border border-border dark:border-border-dark shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {currentTool.badge}
                  </span>
                  <span className="text-xs text-foreground-muted font-medium">
                    {currentTool.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                  {currentTool.title}
                </h3>
                <p className="text-sm text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
                  {currentTool.description}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {currentTool.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-border/60"
                  >
                    <div className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">
                      {spec.label}
                    </div>
                    <div className="text-xs font-semibold text-foreground dark:text-foreground-dark mt-0.5">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Clinical Workflow Bullets */}
              <div className="space-y-2 pt-1">
                {currentTool.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href="/signup"
                  className="px-4 py-2 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Start 2-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] text-foreground-muted">
                  Zero manual data re-entry guaranteed
                </span>
              </div>
            </div>

            {/* Right: Realistic Clinical Imagery Frame with Live Hotspots */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border dark:border-border-dark shadow-2xl group">
                <img
                  src={currentTool.image}
                  alt={currentTool.title}
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Status Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Telemetry Stream</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md text-white border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">
                      Hardware Bridge ID
                    </div>
                    <div className="text-xs font-mono font-semibold">
                      MED-DEV-{selectedToolTab + 1}04-SECURE
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    HL7 / FHIR R4
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Clinical Equipment Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-primary flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground dark:text-foreground-dark">
              OPD Auscultation & Audio Capture
            </h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Eliminate paper scribble. Heart sounds and murmur annotations feed directly into
              the doctor&apos;s digital prescription sheet with one tap.
            </p>
            <div className="text-[11px] font-mono text-primary font-semibold">
              Dr. Workstation · Zero Paper
            </div>
          </Card>

          <Card className="p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground dark:text-foreground-dark">
              CSSD Surgical Tray Sterilization
            </h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Every surgical clamp, scalpel, and sterile drape pack is barcoded. No surgical kit
              enters the operating room without verified autoclave cycle certification.
            </p>
            <div className="text-[11px] font-mono text-emerald-600 font-semibold">
              WHO Surgical Checklist · 100% Audit
            </div>
          </Card>

          <Card className="p-5 space-y-3 relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Syringe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground dark:text-foreground-dark">
              Closed-Loop Injection & Drug Safety
            </h4>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Ward nurses scan syringe unit-dose barcodes and patient UHID wristbands to prevent
              medication administration errors and wrong patient mix-ups.
            </p>
            <div className="text-[11px] font-mono text-purple-600 font-semibold">
              5-Rights Validation · BCMA Verified
            </div>
          </Card>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
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

      {/* 4. INTERACTIVE PATIENT JOURNEY */}
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
                  : "bg-white dark:bg-surface-dark border-border dark:border-border-dark hover:border-primary text-foreground dark:text-foreground-dark"
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

      {/* 5. PRODUCT MODULES */}
      <section id="modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Comprehensive RaftraCare Modules
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Engineered for tertiary care operations. No missing departments or generic templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const config = moduleShaderConfigs[idx % moduleShaderConfigs.length];
            return (
              <div
                key={m.title}
                className="relative h-72 rounded-2xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10 group transition-all duration-300 hover:-translate-y-1"
              >
                {/* Dynamic WebGL Shader Background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  {isMounted && (
                    <Warp
                      style={{ height: "100%", width: "100%" }}
                      proportion={config.proportion}
                      softness={config.softness}
                      distortion={config.distortion}
                      swirl={config.swirl}
                      swirlIterations={config.swirlIterations}
                      shape={config.shape}
                      shapeScale={config.shapeScale}
                      scale={1}
                      rotation={0}
                      speed={0.6}
                      colors={config.colors}
                    />
                  )}
                </div>

                {/* Frosted Glassmorphism Content Overlay */}
                <div className="relative z-10 p-5 rounded-2xl h-full flex flex-col justify-between bg-slate-950/80 hover:bg-slate-950/75 backdrop-blur-md transition-colors border border-white/10 text-white">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-sky-300 flex items-center justify-center shadow-inner">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                        MOD-0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold mb-2 text-white group-hover:text-sky-300 transition-colors">
                      {m.title}
                    </h3>

                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {m.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">
                    <a href="/signup" className="flex items-center gap-1 hover:underline">
                      <span>Launch in Trial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5.1 WEBGL SHADER WARP FEATURES CARDS */}
      <FeaturesCards />

      {/* 6. PATIENT 360 SHOWCASE */}
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

      {/* 7. ROLE-BASED WORKFLOWS */}
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

      {/* 8. SECURITY & TRUST */}
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

      {/* 9. FAQ SECTION (11 Questions) */}
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

      {/* 10. FINAL CALL TO ACTION */}
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
              href="/signup"
              className="h-11 px-6 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold inline-flex items-center justify-center shadow-md transition-colors"
            >
              Start 2-Day Free Trial
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
