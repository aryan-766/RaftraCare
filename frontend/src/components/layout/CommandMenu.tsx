"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Calendar, FileText, Pill, Activity, ArrowRight, X } from "lucide-react";
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_INVOICES, MOCK_MEDICINES } from "@/lib/mock/data";

export function CommandMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  // Matched items
  const matchedPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.uhid.toLowerCase().includes(q) ||
      p.phone.includes(q)
  ).slice(0, 3);

  const matchedAppointments = MOCK_APPOINTMENTS.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(q) ||
      a.doctor_name.toLowerCase().includes(q) ||
      a.department_name.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedInvoices = MOCK_INVOICES.filter(
    (inv) =>
      inv.patient_name.toLowerCase().includes(q) ||
      inv.invoice_number.toLowerCase().includes(q)
  ).slice(0, 2);

  const matchedMeds = MOCK_MEDICINES.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.generic_name.toLowerCase().includes(q)
  ).slice(0, 2);

  const navigate = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark rounded-modal shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-3.5 border-b border-border dark:border-border-dark flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, appointments, bills, doctors, medicines..."
            className="flex-1 bg-transparent text-sm text-foreground dark:text-foreground-dark placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-foreground-muted hover:text-foreground dark:text-foreground-mutedDark dark:hover:text-foreground-dark"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Patients Section */}
          {matchedPatients.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Patients
              </div>
              <div className="space-y-1">
                {matchedPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/patients/${p.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground dark:text-foreground-dark">
                        {p.first_name} {p.last_name}
                      </div>
                      <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                        UHID: {p.uhid} · {p.age} yrs, {p.gender} · {p.phone}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-foreground-muted dark:text-foreground-mutedDark" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {matchedAppointments.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Appointments
              </div>
              <div className="space-y-1">
                {matchedAppointments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => navigate("/appointments")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground dark:text-foreground-dark">
                        {a.patient_name} — {a.department_name}
                      </div>
                      <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                        {a.doctor_name} · {a.appointment_time} · Token: {a.token_number}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-primary font-medium">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bills / Invoices Section */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Invoices & Bills
              </div>
              <div className="space-y-1">
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => navigate("/billing")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground dark:text-foreground-dark">
                        {inv.invoice_number} · {inv.patient_name}
                      </div>
                      <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                        {inv.services_summary}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground dark:text-foreground-dark">
                        ₹{inv.total_amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-medium text-emerald-600">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medicines Section */}
          {matchedMeds.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" /> Pharmacy Stock
              </div>
              <div className="space-y-1">
                {matchedMeds.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate("/pharmacy/inventory")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground dark:text-foreground-dark">
                        {m.name} ({m.strength})
                      </div>
                      <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
                        Stock: {m.current_stock} units · Batch: {m.batch_number}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-primary">
                      ₹{m.unit_price}/unit
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedPatients.length === 0 &&
            matchedAppointments.length === 0 &&
            matchedInvoices.length === 0 &&
            matchedMeds.length === 0 && (
              <div className="py-8 text-center text-foreground-muted dark:text-foreground-mutedDark">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
                <p>No matches found for &quot;{query}&quot;</p>
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
          <span>Navigate with ↵ or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
