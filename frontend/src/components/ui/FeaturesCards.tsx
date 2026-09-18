"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Warp = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Warp),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-slate-900/50 animate-pulse" />
    ),
  }
);

interface Feature {
  title: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Elegant Design",
    badge: "Clinical UX",
    description:
      "Beautiful shader effects and unified clinical interfaces that enhance your hospital operations without overwhelming clinicians. Intuitive for doctors and nurses.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "High Performance",
    badge: "0-Latency Telemetry",
    description:
      "Optimized WebGL shaders and sub-second EMR workflows that run smoothly across hospital desktop monitors, ward tablets, and nurse stations.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
    ),
  },
  {
    title: "Easy Integration",
    badge: "FHIR / HL7 R4",
    description:
      "Simple plug-and-play modules connecting front desk, pharmacy dispensing, LIS lab analyzers, and cashless TPA billing with minimal configuration required.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    title: "Customizable",
    badge: "Multi-Facility",
    description:
      "Extensive customization options to match your hospital branding, departmental workflows, clinical doctor order sets, and formulary rules perfectly.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Responsive",
    badge: "Ward Tablets & Mobile",
    description:
      "Fully responsive design that looks great on OPD doctor monitors, ICU bedside displays, nursing station workstations, and mobile devices of all sizes.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 4V3h10v1H7zM7 18V6h10v12H7z" />
      </svg>
    ),
  },
  {
    title: "Modern Tech",
    badge: "ABDM M1-M3 & WebGL",
    description:
      "Built with the latest web standards including Next.js 14, React, TypeScript, WebGL shaders, and Ayushman Bharat Digital Mission (ABDM) architecture.",
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
];

export function FeaturesCards() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getShaderConfig = (index: number) => {
    const configs = [
      {
        proportion: 0.3,
        softness: 0.8,
        distortion: 0.15,
        swirl: 0.6,
        swirlIterations: 8,
        shape: "checks" as const,
        shapeScale: 0.08,
        colors: ["hsl(215, 100%, 25%)", "hsl(190, 100%, 55%)", "hsl(230, 90%, 35%)", "hsl(200, 100%, 65%)"],
      },
      {
        proportion: 0.4,
        softness: 1.2,
        distortion: 0.2,
        swirl: 0.9,
        swirlIterations: 12,
        shape: "stripes" as const,
        shapeScale: 0.12,
        colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
      },
      {
        proportion: 0.35,
        softness: 0.9,
        distortion: 0.18,
        swirl: 0.7,
        swirlIterations: 10,
        shape: "checks" as const,
        shapeScale: 0.1,
        colors: ["hsl(170, 100%, 25%)", "hsl(150, 100%, 60%)", "hsl(180, 90%, 30%)", "hsl(160, 100%, 70%)"],
      },
      {
        proportion: 0.45,
        softness: 1.1,
        distortion: 0.22,
        swirl: 0.8,
        swirlIterations: 15,
        shape: "stripes" as const,
        shapeScale: 0.09,
        colors: ["hsl(220, 100%, 30%)", "hsl(240, 100%, 65%)", "hsl(210, 90%, 40%)", "hsl(230, 100%, 75%)"],
      },
      {
        proportion: 0.38,
        softness: 0.95,
        distortion: 0.16,
        swirl: 0.85,
        swirlIterations: 11,
        shape: "checks" as const,
        shapeScale: 0.11,
        colors: ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"],
      },
      {
        proportion: 0.42,
        softness: 1.0,
        distortion: 0.19,
        swirl: 0.75,
        swirlIterations: 9,
        shape: "stripes" as const,
        shapeScale: 0.13,
        colors: ["hsl(195, 100%, 30%)", "hsl(215, 100%, 60%)", "hsl(185, 90%, 35%)", "hsl(205, 100%, 75%)"],
      },
    ];
    return configs[index % configs.length];
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <span>WebGL Shader Architecture</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground dark:text-foreground-dark tracking-tight">
          Powerful Healthcare Features
        </h2>
        <p className="text-sm md:text-base text-foreground-muted dark:text-foreground-mutedDark max-w-2xl mx-auto leading-relaxed">
          Everything your hospital needs to coordinate clinical care, patient flow, diagnostics, and revenue with next-generation visual intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const shaderConfig = getShaderConfig(index);
          return (
            <div key={index} className="relative h-84 rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-white/10 group transition-all duration-300 hover:-translate-y-1">
              {/* Dynamic WebGL Shader Background */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                {isMounted && (
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={shaderConfig.proportion}
                    softness={shaderConfig.softness}
                    distortion={shaderConfig.distortion}
                    swirl={shaderConfig.swirl}
                    swirlIterations={shaderConfig.swirlIterations}
                    shape={shaderConfig.shape}
                    shapeScale={shaderConfig.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.7}
                    colors={shaderConfig.colors}
                  />
                )}
              </div>

              {/* Glassmorphic Content Card Overlay */}
              <div className="relative z-10 p-7 rounded-3xl h-full flex flex-col justify-between bg-slate-950/75 hover:bg-slate-950/70 backdrop-blur-md transition-colors border border-white/10 text-white">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-sky-200 border border-white/20">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2.5 tracking-tight text-white group-hover:text-sky-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-200 group-hover:text-white transition-colors">
                  <a href="/signup" className="flex items-center gap-1.5 hover:underline">
                    <span>Explore in 2-Day Trial</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  <span className="text-[10px] text-slate-400 font-mono">Live WebGL</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default FeaturesCards;
