"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  CalendarCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  CreditCard,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  department: string;
  patient: string;
  uhid: string;
  detail: string;
  icon: React.ElementType;
  status: "active" | "completed" | "pending";
}

const WORKFLOW_STEPS: Step[] = [
  {
    id: "reg",
    title: "1. Patient Registration",
    department: "Front Desk Reception",
    patient: "Aarav Sharma (38/M)",
    uhid: "UHID-10824",
    detail: "Demographics recorded, digital consent signed, biometric token issued",
    icon: UserPlus,
    status: "completed",
  },
  {
    id: "appt",
    title: "2. Walk-in & Token Queue",
    department: "Central Triage",
    patient: "Aarav Sharma (38/M)",
    uhid: "Token #24",
    detail: "Vitals taken: BP 124/82 mmHg, HR 74 bpm, Room 204 assigned",
    icon: CalendarCheck,
    status: "completed",
  },
  {
    id: "consult",
    title: "3. Clinical Consultation",
    department: "OPD Cardiology",
    patient: "Dr. R. K. Mukherjee",
    uhid: "Room 204",
    detail: "Chief complaint: Chest discomfort. ECG ordered, preliminary care plan set",
    icon: Stethoscope,
    status: "active",
  },
  {
    id: "diag",
    title: "4. Laboratory & Diagnostics",
    department: "Pathology Wing",
    patient: "Stat Troponin & Lipid",
    uhid: "Lab #9421",
    detail: "Sample verified, automated analyzer sync, critical values flagged",
    icon: FlaskConical,
    status: "pending",
  },
  {
    id: "pharm",
    title: "5. Pharmacy Dispensing",
    department: "Main Dispensary",
    patient: "Prescription Hand-off",
    uhid: "Rx-308",
    detail: "Barcode verified batch, stock deducted, dosage instructions labeled",
    icon: Pill,
    status: "pending",
  },
  {
    id: "bill",
    title: "6. Billing & Settlement",
    department: "Revenue Operations",
    patient: "Insurance / TPA & Self",
    uhid: "Inv #9012",
    detail: "Itemized services calculated, GST auto-applied, digital receipt printed",
    icon: CreditCard,
    status: "pending",
  },
];

export function AuthWorkflowVisual() {
  const [activeStepIndex, setActiveStepIndex] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15 backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Live Hospital Operations System</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          One connected system for your entire hospital.
        </h2>
        <p className="text-sm text-blue-100/80 leading-relaxed">
          Connect front desk, clinical workflows, diagnostics, pharmacy, revenue, and administration
          around one unified patient record.
        </p>
      </div>

      {/* Workflow Stream UI */}
      <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-400 before:via-blue-500/50 before:to-transparent">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isPast = idx < activeStepIndex;
          const Icon = step.icon as any;

          return (
            <div
              key={step.id}
              className={`relative transition-all duration-500 rounded-xl p-3.5 border text-xs ${
                isCurrent
                  ? "bg-white/15 border-blue-400/50 shadow-lg shadow-blue-500/10 scale-[1.02] backdrop-blur-md"
                  : isPast
                  ? "bg-white/5 border-white/10 opacity-75"
                  : "bg-black/20 border-white/5 opacity-50"
              }`}
            >
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? "bg-blue-400 border-white ring-4 ring-blue-500/30 scale-110"
                    : isPast
                    ? "bg-emerald-400 border-white"
                    : "bg-slate-700 border-slate-500"
                }`}
              />

              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon className={`w-4 h-4 ${isCurrent ? "text-blue-300" : "text-blue-200"}`} />
                  <span>{step.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/30 text-blue-200">
                    {step.uhid}
                  </span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-blue-200/90 font-medium mb-1">
                <span>{step.department}</span>
                <span className="text-white/80">{step.patient}</span>
              </div>

              <p className="text-[11px] text-blue-100/70 leading-relaxed">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
