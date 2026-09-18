"use client";

import React, { useState, useEffect } from "react";
import { Monitor, Laptop, ArrowLeft, LogOut, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth/AuthContext";

export function DesktopLock() {
  const { user, hospital, logout } = useAuth();
  const [currentWidth, setCurrentWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#070D18] text-white p-6 overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.15)_0%,_rgba(7,13,24,0.8)_60%,_transparent_100%)] pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <Logo size="sm" subtitle="Clinical Operations OS" />
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <ShieldAlert className="w-3 h-3" />
          <span>Workstation Locked</span>
        </div>
      </div>

      {/* Main Lock Content */}
      <div className="relative z-10 my-auto py-8 text-center max-w-sm mx-auto space-y-6">
        {/* Animated Workstation Icon Container */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/20 to-sky-500/10 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
          <Monitor className="w-10 h-10 text-sky-400" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center">
            <Laptop className="w-4 h-4 text-blue-300" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#070D18] animate-ping" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Desktop or Tablet Required
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            RaftraCare clinical workflows, OT telemetry, and patient EHR charts are engineered strictly for larger screens to prevent clinical charting errors and maintain HIPAA/NABH compliance.
          </p>
        </div>

        {/* Viewport Diagnostic Card */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Current Device Width</span>
            <span className="font-mono text-amber-400 font-bold">{currentWidth}px</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Minimum Required Width</span>
            <span className="font-mono text-emerald-400 font-bold">1024px (Desktop)</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentWidth / 1024) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center pt-1">
            💡 Tip: If using a tablet, rotate to landscape mode.
          </p>
        </div>

        {/* User Session Info */}
        {user && (
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/30 text-xs text-left">
            <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
              Authenticated Session
            </div>
            <div className="font-semibold text-white truncate mt-0.5">{user.first_name} {user.last_name}</div>
            <div className="text-[11px] text-slate-300 truncate">
              {user.role} · {hospital?.name || "RaftraCare Hospital"}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href="/"
            className="w-full h-10 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home & Products
          </a>
          <button
            onClick={() => logout()}
            className="w-full h-10 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Securely
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-[10px] text-slate-300 border-t border-white/10 pt-3">
        RaftraCare Hospital Operations Platform · Clinical Workstation Safety Enforcement
      </div>
    </div>
  );
}

export default DesktopLock;
