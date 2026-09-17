import React from "react";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background dark:bg-background-dark">
      {/* Left Column: Premium Healthcare SaaS Visual & Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-deep via-primary-900 to-slate-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10">
          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 inline-flex items-center shadow-lg">
            <Logo size="md" subtitle="Healthcare Operations Platform" href="/" />
          </div>
        </div>

        {/* Center UI Preview Card (Mocking the real product) */}
        <div className="relative z-10 space-y-4 my-auto">
          <div className="max-w-md space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              One connected system for your entire hospital.
            </h2>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Connect front desk, OPD, IPD, diagnostics, pharmacy, billing, and administration
              around one longitudinal patient record.
            </p>
          </div>

          {/* Realistic Product Mini Preview */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/20 backdrop-blur-md shadow-2xl space-y-3 max-w-sm">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-mono text-blue-300 font-bold">HOS-001284 · Raj Kumar</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Serving (Room 204)
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-slate-300">OPD Cardiology Consultation · Dr. Rajesh Sharma</div>
              <div className="text-[11px] text-slate-400">Vitals: BP 130/84 mmHg · HR 76 bpm · Troponin Negative</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200/60 flex items-center justify-between">
          <span>Enterprise Grade · ABDM Compliant · 256-Bit TLS</span>
          <span>© 2026 RaftraCare</span>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
