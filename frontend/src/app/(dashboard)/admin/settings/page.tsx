"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sliders, Building, Check, Globe } from "lucide-react";

export default function HospitalSettingsPage() {
  const { hospital } = useAuth();
  const { success } = useToast();

  const [form, setForm] = useState({
    name: hospital?.name || "Metro General Hospital",
    code: hospital?.code || "MGH",
    phone: hospital?.phone || "+91 98765 43210",
    email: hospital?.email || "admin@metrogeneral.org",
    city: hospital?.city || "Gurugram",
    state: hospital?.state || "Haryana",
    pincode: hospital?.pincode || "122002",
    gstin: "06AABCM1234F1Z8",
    abdmEnabled: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success("Settings Saved", "Hospital organization profile updated.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border/70 dark:border-border-dark pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary" /> Hospital Profile & System Settings
        </h1>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          Facility identity, letterhead branding, ABDM sandbox keys, and clinical configs
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark border-b border-border pb-2">
            Facility Identification
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hospital Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Facility Code (UHID Prefix) *"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Official Contact Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Helpline Phone *"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <Input
              label="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </div>

          <Input
            label="GSTIN Identification Number"
            value={form.gstin}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
          />
        </Card>

        {/* Government ABDM / NDHM Integration */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Ayushman Bharat Digital Mission (ABDM)
              </h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                ABHA creation, health locker linkage, and milestone 1-3 ABDM gateway
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
              M1-M3 COMPLIANT
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
            <div className="font-semibold text-foreground">Facility Registry ID: IN061000189</div>
            <div className="text-foreground-muted">HIP/HIU Client ID: SBX_HOSPITALOS_METRO_01</div>
          </div>
        </Card>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" size="md">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
