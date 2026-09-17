"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { MOCK_PATIENTS, MOCK_QUEUE } from "@/lib/mock/data";
import { Patient, QueueToken } from "@/types";
import {
  Stethoscope,
  Heart,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  User,
  FileCheck,
} from "lucide-react";

export default function OPDConsultationPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const { success } = useToast();

  // Consultation Form State
  const [chiefComplaint, setChiefComplaint] = useState(
    "Exertional retrosternal discomfort since 3 days, mild shortness of breath upon climbing stairs."
  );
  const [history, setHistory] = useState(
    "Known case of Hypertension (5 years), Type 2 DM. Compliant on oral medications. No prior myocardial infarction."
  );
  const [examination, setExamination] = useState(
    "Chest: Bilateral air entry clear, no crepitations. CVS: S1 S2 heard, no murmurs. JVP normal."
  );
  const [diagnosis, setDiagnosis] = useState(
    "Atypical Angina Pectoris / Essential Hypertension"
  );
  const [prescriptions, setPrescriptions] = useState([
    { name: "Telmisartan 40mg", dosage: "1 Tab", frequency: "OD (Morning)", duration: "30 Days" },
    { name: "Metformin 500mg SR", dosage: "1 Tab", frequency: "BD (Meals)", duration: "30 Days" },
    { name: "Sorbitrate 5mg (SOS)", dosage: "1 Tab", frequency: "Sublingual PRN", duration: "As needed" },
  ]);
  const [newDrug, setNewDrug] = useState({ name: "", dosage: "1 Tab", frequency: "OD", duration: "15 Days" });
  const [followUpDate, setFollowUpDate] = useState("2026-10-15");

  // Simulated Autosave
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 15000);
    return () => clearInterval(timer);
  }, [chiefComplaint, history, diagnosis]);

  const handleAddDrug = () => {
    if (!newDrug.name) return;
    setPrescriptions([...prescriptions, newDrug]);
    setNewDrug({ name: "", dosage: "1 Tab", frequency: "OD", duration: "15 Days" });
  };

  const handleRemoveDrug = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleCompleteConsultation = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      success(
        "Consultation Completed",
        `Encounter closed for ${selectedPatient.first_name} ${selectedPatient.last_name}. Prescription and orders dispatched.`
      );
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
              OPD Doctor Workstation
            </h1>
            <div className="text-xs text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-2 mt-0.5">
              <span>Dr. Rajesh Sharma (Cardiology)</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Autosaved {lastSavedTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => success("Draft Saved", "Clinical notes draft saved.")}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            variant="primary"
            isLoading={isSaving}
            onClick={handleCompleteConsultation}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Complete & Sign Off
          </Button>
        </div>
      </div>

      {/* 3-Column Layout: Patient Queue | Consultation Form | Patient Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Today's Queue (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="p-3">
            <div className="flex items-center justify-between pb-2 border-b border-border dark:border-border-dark">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark">
                Today&apos;s Patients ({MOCK_QUEUE.length})
              </span>
              <span className="text-[10px] text-primary font-bold">Room 204</span>
            </div>

            <div className="space-y-1.5 mt-2">
              {MOCK_QUEUE.map((q, idx) => {
                const pt = MOCK_PATIENTS.find((p) => p.uhid === q.patient_uhid) || MOCK_PATIENTS[0];
                const isSelected = selectedPatient.uhid === q.patient_uhid;

                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedPatient(pt)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 dark:bg-blue-950/70 border-primary font-semibold shadow-xs"
                        : "border-border/60 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-primary text-[11px] font-bold">
                        {q.token_number}
                      </span>
                      <StatusBadge status={q.status} />
                    </div>
                    <div className="font-bold text-foreground dark:text-foreground-dark mt-1">
                      {q.patient_name}
                    </div>
                    <div className="text-[10px] text-foreground-muted dark:text-foreground-mutedDark">
                      UHID: {q.patient_uhid} · {q.checked_in_at}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Center: Consultation Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="border-b border-border dark:border-border-dark pb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
                Clinical Encounter Assessment
              </h3>
              <span className="text-xs font-mono font-semibold text-primary">
                Encounter #ENC-2026-0917
              </span>
            </div>

            {/* Chief Complaint */}
            <div className="space-y-1 text-xs">
              <label className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                Chief Complaint
              </label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-2.5 rounded-input bg-white dark:bg-surface-dark border border-border dark:border-border-dark text-xs text-foreground dark:text-foreground-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* History of Present Illness */}
            <div className="space-y-1 text-xs">
              <label className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                Clinical History & Risk Factors
              </label>
              <textarea
                rows={2}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full p-2.5 rounded-input bg-white dark:bg-surface-dark border border-border dark:border-border-dark text-xs text-foreground dark:text-foreground-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Examination Findings */}
            <div className="space-y-1 text-xs">
              <label className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                Physical Examination
              </label>
              <textarea
                rows={2}
                value={examination}
                onChange={(e) => setExamination(e.target.value)}
                className="w-full p-2.5 rounded-input bg-white dark:bg-surface-dark border border-border dark:border-border-dark text-xs text-foreground dark:text-foreground-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Working Diagnosis */}
            <div className="space-y-1 text-xs">
              <label className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                Diagnosis (ICD-10)
              </label>
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Search ICD-10 code or type diagnosis..."
              />
            </div>

            {/* Prescription Builder */}
            <div className="space-y-2 pt-2 border-t border-border dark:border-border-dark text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                  Prescription / Rx Builder ({prescriptions.length})
                </span>
              </div>

              {/* Drug table */}
              <div className="space-y-1.5">
                {prescriptions.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900 border border-border/70 dark:border-border-dark"
                  >
                    <div>
                      <div className="font-bold text-foreground dark:text-foreground-dark">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                        {p.dosage} · {p.frequency} · {p.duration}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDrug(i)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Drug Row */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="Medicine name (e.g. Aspirin 75mg)"
                  value={newDrug.name}
                  onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddDrug}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Follow-up */}
            <div className="pt-2 border-t border-border dark:border-border-dark flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground-muted">Recommended Follow-up Date:</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="h-8 px-2 rounded-input bg-white dark:bg-surface-dark border border-border dark:border-border-dark"
              />
            </div>
          </Card>
        </div>

        {/* Right: Patient Context Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-4 text-xs">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary font-mono uppercase">
                  {selectedPatient.uhid}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  OPD Visit
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground dark:text-foreground-dark mt-1">
                {selectedPatient.first_name} {selectedPatient.last_name}
              </h3>
              <p className="text-foreground-muted dark:text-foreground-mutedDark">
                {selectedPatient.age} yrs · {selectedPatient.gender} · {selectedPatient.blood_group}
              </p>
            </div>

            {/* Allergies Alert */}
            {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60">
                <div className="text-[11px] font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risk Allergies
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedPatient.allergies.map((a) => (
                    <span
                      key={a}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-rose-900 text-rose-700 dark:text-rose-200 border border-rose-300"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vitals Snapshot */}
            <div className="space-y-1.5 pt-2 border-t border-border dark:border-border-dark">
              <span className="font-bold text-[11px] text-foreground-muted uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> Latest Vitals
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">
                  <div className="text-foreground-muted">BP</div>
                  <div className="font-bold text-xs">130/84 mmHg</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">
                  <div className="text-foreground-muted">Pulse</div>
                  <div className="font-bold text-xs">76 bpm</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">
                  <div className="text-foreground-muted">SpO2</div>
                  <div className="font-bold text-xs">99%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">
                  <div className="text-foreground-muted">Temp</div>
                  <div className="font-bold text-xs">98.4 °F</div>
                </div>
              </div>
            </div>

            {/* Previous Visits */}
            <div className="space-y-1.5 pt-2 border-t border-border dark:border-border-dark">
              <span className="font-bold text-[11px] text-foreground-muted uppercase tracking-wider">
                Visit History
              </span>
              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 flex justify-between">
                  <span>12 Sep 2026</span>
                  <span className="font-semibold text-primary">Dr. Sharma (Cardio)</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 flex justify-between">
                  <span>10 Aug 2026</span>
                  <span className="font-semibold text-primary">Dr. Sharma (Cardio)</span>
                </div>
              </div>
            </div>

            <a
              href={`/patients/${selectedPatient.id}`}
              className="block text-center py-1.5 rounded-lg border border-primary text-primary font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              Open Full Patient 360° Record →
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
