import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Heart, Layers, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Operating software built for real hospitals.
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
          RaftraCare was engineered from a simple operational observation: hospital systems fail
          not because they lack features, but because departments are disconnected.
        </p>
      </div>

      {/* Why RaftraCare */}
      <section className="space-y-4 text-xs">
        <h2 className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Why RaftraCare
        </h2>
        <Card className="p-6 space-y-3 leading-relaxed text-foreground-muted dark:text-foreground-mutedDark">
          <p>
            Modern hospitals are among the most complex operational environments on earth. At any
            given minute, emergency patients are arriving at triage, pharmacists are dispensing
            restricted drugs, nurses are charting 4-hourly vitals, surgeons are scheduling emergency
            OT suites, and cashiers are settling cashless insurance claims.
          </p>
          <p>
            When these functions run on separate software databases, medical errors increase, wait
            times lengthen, and billable procedures fall through the cracks. RaftraCare replaces
            departmental silos with a single unified operating platform centered around the
            longitudinal patient record.
          </p>
        </Card>
      </section>

      {/* Our Mission & Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <Card className="p-6 space-y-2.5">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" /> Our Mission
          </h3>
          <p className="text-foreground-muted leading-relaxed">
            To provide healthcare institutions with reliable, high-speed, and secure operating
            infrastructure that eliminates paper friction, prevents revenue leakage, and lets
            clinicians focus on patient care.
          </p>
        </Card>

        <Card className="p-6 space-y-2.5">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Product Philosophy
          </h3>
          <p className="text-foreground-muted leading-relaxed">
            Healthcare UI must reduce cognitive load, not add to it. We prioritize fast keyboard
            shortcuts, scannable tables, contextual patient drawers, and zero artificial delays over
            decorative animations.
          </p>
        </Card>
      </section>

      {/* Security & Trust */}
      <section className="space-y-4 text-xs">
        <h2 className="text-lg font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" /> Security & Trust
        </h2>
        <Card className="p-6 space-y-3 leading-relaxed text-foreground-muted dark:text-foreground-mutedDark">
          <p>
            Patient health data demands the highest standard of custodial protection. HospitalOS
            enforces strict role-based access control (RBAC), multi-tenant cryptographic isolation,
            immutable compliance logging, and compliance with the Ayushman Bharat Digital Mission
            (ABDM) guidelines.
          </p>
          <div className="pt-2 border-t border-border dark:border-border-dark flex flex-wrap gap-4 text-foreground font-semibold">
            <span>✓ AES-256 Bit Encryption at Rest</span>
            <span>✓ TLS 1.3 in Transit</span>
            <span>✓ ABDM M1-M3 Architecture</span>
            <span>✓ Immutable Audit Trails</span>
          </div>
        </Card>
      </section>
    </div>
  );
}
