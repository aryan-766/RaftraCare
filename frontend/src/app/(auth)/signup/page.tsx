"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    // Step 1: Account
    adminName: "",
    email: "",
    password: "",
    // Step 2: Organization
    orgName: "",
    orgType: "PRIVATE_HOSPITAL",
    // Step 3: Hospital Facility
    hospitalName: "",
    code: "",
    city: "",
    state: "Haryana",
    beds: "100",
    // Step 4: Review
    plan: "GROWTH",
  });

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
    else {
      success("Hospital Provisioned", "Organization and facilities initialized. Launching dashboard.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex justify-center mb-6">
        <Logo size="md" subtitle="Operations Platform" href="/" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? "Account" : step === 2 ? "Organization" : step === 3 ? "Hospital Facility" : "Confirmation"}</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark mt-4">
          {step === 1 && "Create Admin Account"}
          {step === 2 && "Organization Details"}
          {step === 3 && "Hospital Facility Setup"}
          {step === 4 && "Review & Launch"}
        </h2>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          {step === 1 && "Set up primary super-administrator credentials."}
          {step === 2 && "Enter your legal corporate healthcare entity."}
          {step === 3 && "Define bed capacity, facility code, and location."}
          {step === 4 && "Confirm details and initialize tenant database."}
        </p>
      </div>

      <form onSubmit={nextStep} className="space-y-4 text-xs">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <Input
              label="Full Name *"
              required
              value={formData.adminName}
              onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
              placeholder="e.g. Dr. Arvind Srivastava"
            />
            <Input
              label="Official Hospital Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@hospital.org"
            />
            <Input
              label="Security Password *"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Input
              label="Legal Organization Name *"
              required
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              placeholder="e.g. Metro Healthcare Trust Pvt Ltd"
            />
            <Select
              label="Healthcare Entity Type"
              value={formData.orgType}
              onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
            >
              <option value="PRIVATE_HOSPITAL">Private Multi-Specialty Hospital</option>
              <option value="TRUST">Charitable Trust / NGO Hospital</option>
              <option value="CLINIC_CHAIN">Day Care & Clinic Network</option>
              <option value="GOVERNMENT">Government / Municipal Medical College</option>
            </Select>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Hospital Unit Name *"
                required
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                placeholder="e.g. Metro General Hospital"
              />
              <Input
                label="Facility UHID Code *"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. MGH"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City *"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Gurugram"
              />
              <Input
                label="Bed Capacity *"
                type="number"
                required
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                placeholder="e.g. 240"
              />
            </div>
          </>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border dark:border-border-dark space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Admin Account:</span>
              <span className="font-bold">{formData.adminName || "Dr. Arvind Srivastava"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Email:</span>
              <span className="font-mono">{formData.email || "admin@metrogeneral.org"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Facility:</span>
              <span className="font-bold">{formData.hospitalName || "Metro General Hospital"} ({formData.code || "MGH"})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Beds Licensed:</span>
              <span>{formData.beds || "240"} Beds</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-foreground-muted">Selected SaaS Tier:</span>
              <span className="font-bold text-primary">Growth Tier (14-Day Free Trial)</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(step - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {step === 4 ? "Initialize RaftraCare" : "Continue"}
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-foreground-muted">
        Already registered?{" "}
        <a href="/login" className="font-bold text-primary hover:underline">
          Sign In →
        </a>
      </div>
    </div>
  );
}
