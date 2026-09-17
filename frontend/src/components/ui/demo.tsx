'use client'

import React from "react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { 
  Stethoscope, 
  Syringe, 
  HeartPulse, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border border-slate-800 shadow-2xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-300 text-xs font-semibold w-fit mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Next-Gen 3D Clinical Intelligence</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 tracking-tight leading-tight">
            Immersive 3D <br />
            Hospital Ecosystem
          </h2>
          <p className="mt-4 text-neutral-300 max-w-lg text-sm md:text-base leading-relaxed">
            Experience real-time clinical workflows with interactive spatial telemetry. 
            Connect doctors, emergency wards, diagnostic labs, and OT suites in one unified interface.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs">
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span>OPD & Ward Telemetry</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Live ICU Monitoring</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 text-xs">
              <Syringe className="w-4 h-4 text-emerald-400" />
              <span>Smart Pharmacy Dispense</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-primary text-white text-sm font-semibold shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all"
            >
              <span>Explore Live System</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NABH & HIPAA Compliant</span>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px] md:min-h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
