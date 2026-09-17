"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, BookOpen, Clock, ArrowRight } from "lucide-react";

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const articles = [
    {
      id: "art_1",
      title: "How Connected Hospital Operations Reduce Patient Discharge TAT from 4 Hours to 45 Minutes",
      category: "Case Studies",
      readTime: "6 min read",
      date: "12 Sep 2026",
      summary:
        "An analysis of how eliminating paper chit handoffs between nursing, pharmacy, and cashier reduces discharge delay and frees beds for elective admissions.",
    },
    {
      id: "art_2",
      title: "Architecting ABDM M1-M3 Integration in Tertiary Care Hospitals",
      category: "Guides",
      readTime: "8 min read",
      date: "05 Sep 2026",
      summary:
        "A practical guide to connecting National Health Authority ABHA IDs, consent managers, and diagnostic health lockers with internal hospital EMRs.",
    },
    {
      id: "art_3",
      title: "Optimizing Outpatient Queue Flow and Preventing Doctor Burnout in OPD Clinics",
      category: "Operations",
      readTime: "5 min read",
      date: "28 Aug 2026",
      summary:
        "Best practices for digital token room caller displays, walk-in triage, and single-screen consultation ergonomics.",
    },
    {
      id: "art_4",
      title: "HospitalOS Release 2.4: Bidirectional Lab Analyzer LIS Interfaces and Automated WhatsApp Reports",
      category: "Product Updates",
      readTime: "4 min read",
      date: "15 Aug 2026",
      summary:
        "Overview of ASTM analyzer support, instant WhatsApp delivery of verified PDF reports, and Razorpay auto-billing.",
    },
  ];

  const categories = ["ALL", "Case Studies", "Guides", "Operations", "Product Updates"];

  const filtered = articles.filter(
    (a) => selectedCategory === "ALL" || a.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Hospital Operations Guides & Insights
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
          Operational blueprints, clinical workflows, and technology implementation guides for
          healthcare leadership.
        </p>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-4 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === c
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-foreground-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article Card */}
      <Card className="p-8 border-l-4 border-l-primary space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <Badge variant="primary">{articles[0].category}</Badge>
          <span className="text-foreground-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {articles[0].readTime}
          </span>
          <span className="text-foreground-muted">· {articles[0].date}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-foreground-dark leading-snug">
          {articles[0].title}
        </h2>
        <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed max-w-3xl">
          {articles[0].summary}
        </p>
        <div className="pt-2">
          <a
            href="/dashboard"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
          >
            Read Complete Case Study <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.slice(1).map((art) => (
          <Card key={art.id} className="p-5 flex flex-col justify-between space-y-4 hover:shadow-card transition-shadow">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <Badge variant="default">{art.category}</Badge>
                <span className="text-foreground-muted">{art.readTime}</span>
              </div>
              <h3 className="font-bold text-sm text-foreground dark:text-foreground-dark leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-2 border-t border-border/60 text-xs text-foreground-muted">
              {art.date}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
