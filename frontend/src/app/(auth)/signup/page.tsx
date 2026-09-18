"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth/AuthContext";
import { authApi, RegisterHospitalPayload } from "@/lib/api/auth";

export default function SignupPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Admin
    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_password: "",
    admin_phone: "",

    // Step 2: Hospital Facility
    hospital_name: "",
    hospital_slug: "",
    hospital_code: "",
    phone: "",
    email: "",

    // Step 3: Location
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",

    // Step 4: Capacity
    max_beds: 150,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (step === 1) {
      if (
        !formData.admin_first_name.trim() ||
        !formData.admin_last_name.trim() ||
        !formData.admin_email.trim() ||
        formData.admin_password.length < 8
      ) {
        setErrorMessage("Please complete all required admin fields. Password must be at least 8 characters.");
        return;
      }
      // Auto-prefill hospital email from admin email if empty
      if (!formData.email) updateField("email", formData.admin_email);
    } else if (step === 2) {
      if (!formData.hospital_name.trim()) {
        setErrorMessage("Please enter the hospital facility name.");
        return;
      }
      if (!formData.hospital_slug.trim()) {
        const slug = formData.hospital_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        updateField("hospital_slug", slug);
      }
      if (!formData.hospital_code.trim()) {
        const code = formData.hospital_name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 5);
        updateField("hospital_code", code || "HOSP");
      }
      if (!formData.phone.trim()) {
        updateField("phone", formData.admin_phone || "+91 98765 43210");
      }
    } else if (step === 3) {
      if (!formData.address_line1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postal_code.trim()) {
        setErrorMessage("Please complete all address fields.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload: RegisterHospitalPayload = {
        hospital_name: formData.hospital_name,
        hospital_slug: formData.hospital_slug || formData.hospital_name.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
        hospital_code: formData.hospital_code.toUpperCase(),
        phone: formData.phone || formData.admin_phone,
        email: formData.email || formData.admin_email,
        address_line1: formData.address_line1,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: "India",
        currency: "INR",
        admin_first_name: formData.admin_first_name,
        admin_last_name: formData.admin_last_name,
        admin_email: formData.admin_email,
        admin_password: formData.admin_password,
        admin_phone: formData.admin_phone,
      };

      await authApi.registerHospital(payload);
      success("Hospital Registered", "Facility registered successfully. Logging in...");

      // Automatically sign in to the newly registered hospital
      await login(formData.admin_email, formData.admin_password, payload.hospital_slug);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register hospital.");
      error("Registration Error", err.message || "Could not register hospital.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Administrator Profile",
    "Hospital Facility",
    "Location Details",
    "Operational Capacity",
    "Review & Launch",
  ];

  return (
    <div className="space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex justify-center mb-6">
        <Logo size="md" subtitle="Operations Platform" href="/" />
      </div>

      {/* Progress Indicators */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Step {step} of 5: {stepTitles[step - 1]}
          </span>
          <span className="text-[11px] text-foreground-muted">
            {Math.round((step / 5) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2 text-xs text-red-700 dark:text-red-300 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Step Forms */}
      <form onSubmit={step === 5 ? (e) => { e.preventDefault(); handleFinalSubmit(); } : handleNext} className="space-y-4 text-xs">
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
              Create Primary Administrator Account
            </h3>
            <p className="text-foreground-muted">
              This account will hold super-user administrative privileges for your hospital.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name *"
                required
                value={formData.admin_first_name}
                onChange={(e) => updateField("admin_first_name", e.target.value)}
                placeholder="Dr. Rajesh"
              />
              <Input
                label="Last Name *"
                required
                value={formData.admin_last_name}
                onChange={(e) => updateField("admin_last_name", e.target.value)}
                placeholder="Sharma"
              />
            </div>
            <Input
              label="Official Email *"
              type="email"
              required
              value={formData.admin_email}
              onChange={(e) => updateField("admin_email", e.target.value)}
              placeholder="admin@hospital.org"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Contact Phone *"
              type="tel"
              value={formData.admin_phone}
              onChange={(e) => updateField("admin_phone", e.target.value)}
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Security Password (min 8 characters) *"
              type="password"
              required
              value={formData.admin_password}
              onChange={(e) => updateField("admin_password", e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
              Hospital Facility Profile
            </h3>
            <p className="text-foreground-muted">
              Provide legal entity and facility identifiers.
            </p>
            <Input
              label="Hospital Name *"
              required
              value={formData.hospital_name}
              onChange={(e) => updateField("hospital_name", e.target.value)}
              placeholder="Apollo Apex Super Speciality"
              leftIcon={<Building2 className="w-4 h-4" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Facility Code (e.g. AASH) *"
                required
                value={formData.hospital_code}
                onChange={(e) => updateField("hospital_code", e.target.value.toUpperCase())}
                placeholder="AASH"
              />
              <Input
                label="URL Identifier (slug) *"
                required
                value={formData.hospital_slug}
                onChange={(e) => updateField("hospital_slug", e.target.value.toLowerCase())}
                placeholder="apollo-apex"
              />
            </div>
            <Input
              label="Facility Phone *"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+91 11 4987 6543"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Facility Public Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="contact@apolloapex.in"
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
              Hospital Location & Address
            </h3>
            <p className="text-foreground-muted">
              Required for patient invoicing, GST tax calculation, and statutory records.
            </p>
            <Input
              label="Street Address *"
              required
              value={formData.address_line1}
              onChange={(e) => updateField("address_line1", e.target.value)}
              placeholder="Plot 14, Ring Road, Sector 22"
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="City *"
                required
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="New Delhi"
              />
              <Input
                label="State *"
                required
                value={formData.state}
                onChange={(e) => updateField("state", e.target.value)}
                placeholder="Delhi"
              />
              <Input
                label="Postal Code *"
                required
                value={formData.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                placeholder="110049"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
              Operational Scope
            </h3>
            <p className="text-foreground-muted">
              Initial bed capacity and department parameters.
            </p>
            <Input
              label="Licensed Inpatient Bed Capacity"
              type="number"
              min={10}
              max={2000}
              value={formData.max_beds}
              onChange={(e) => updateField("max_beds", Number(e.target.value))}
            />
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 space-y-1.5">
              <div className="font-semibold text-foreground">Pre-configured Operational Units:</div>
              <ul className="list-disc list-inside text-foreground-muted space-y-0.5">
                <li>OPD General Medicine & Specialist Consultation Queues</li>
                <li>Emergency & Triage Room with Priority Tagging</li>
                <li>Inpatient Wards & Digital Bed Availability Map</li>
                <li>Diagnostic Laboratory & Integrated Pharmacy POS</li>
              </ul>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
              Review Configuration & Provision
            </h3>
            <p className="text-foreground-muted">
              Confirm your deployment parameters. We will provision your multi-tenant database records and initialize hospital master configuration.
            </p>
            <div className="p-3 rounded-lg border border-border dark:border-border-dark space-y-2 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Hospital:</span>
                <span className="font-bold text-foreground">{formData.hospital_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Facility Code:</span>
                <span className="font-mono font-bold text-foreground">{formData.hospital_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Administrator:</span>
                <span className="text-foreground">{formData.admin_first_name} {formData.admin_last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Admin Email:</span>
                <span className="text-foreground">{formData.admin_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Location:</span>
                <span className="text-foreground">{formData.city}, {formData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Bed Capacity:</span>
                <span className="text-foreground">{formData.max_beds} Beds</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          )}

          {step < 5 ? (
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 justify-center font-bold"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
              className="flex-1 justify-center font-bold bg-primary hover:bg-primary-600"
            >
              <span>Provision HospitalOS</span>
              <ShieldCheck className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </form>

      {/* Already registered */}
      <div className="pt-4 border-t border-border dark:border-border-dark text-center text-xs text-foreground-muted dark:text-foreground-mutedDark">
        <span>Already have an operational account? </span>
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
