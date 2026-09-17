"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sparkles,
  Check,
  CreditCard,
  Download,
  AlertCircle,
  Building,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function SaaSBillingPage() {
  const { hospital } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("GROWTH");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { success } = useToast();

  const plans = [
    {
      id: "STARTER",
      name: "Starter Clinic",
      price: "₹4,999",
      period: "/ month",
      desc: "For small nursing homes and independent multi-specialty clinics.",
      features: [
        "Up to 30 Hospital Beds",
        "Front Desk & Appointments",
        "OPD Doctor Workstation",
        "Basic Pharmacy Counter",
        "Standard Role Permissions",
      ],
      current: hospital?.subscription_tier === "STARTER",
    },
    {
      id: "GROWTH",
      name: "Growth Hospital",
      price: "₹14,999",
      period: "/ month",
      desc: "For multi-ward tertiary care hospitals scaling their clinical operations.",
      features: [
        "Up to 250 Hospital Beds",
        "Complete Inpatient (IPD) & Bed Map",
        "Emergency Triage & Resuscitation Bay",
        "Diagnostic Labs (LIS) & Radiology",
        "TPA & Cashless Insurance Pre-auth",
        "Unlimited Staff & Biometric Roster",
        "Priority 24/7 Enterprise Support",
      ],
      current: hospital?.subscription_tier === "GROWTH",
      popular: true,
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise Multi-Branch",
      price: "Custom",
      period: "per facility",
      desc: "For hospital chains, medical colleges, and government trusts.",
      features: [
        "Unlimited Beds & Branches",
        "Custom ABDM / NDHM M1-M3 Integration",
        "PACS & DICOM Imaging Bridge",
        "SAP & Oracle Financial Connectors",
        "Dedicated Clinical Implementation Lead",
        "99.99% Guaranteed SLA",
      ],
      current: hospital?.subscription_tier === "ENTERPRISE",
    },
  ];

  const handleInitiatePayment = (planId: string) => {
    setSelectedPlan(planId);
    setCheckoutModalOpen(true);
    setPaymentSuccess(false);
  };

  const handleSimulateRazorpay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      success("Subscription Active", `RaftraCare upgraded to ${selectedPlan} tier via Razorpay.`);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Subscription & RaftraCare SaaS Plan
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Facility licensing, active bed quota, Razorpay auto-billing, and tax invoices
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
          ● Subscription Active (Renewal: 17 Oct 2026)
        </span>
      </div>

      {/* Current Plan Card & Usage Quotas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 md:col-span-2 space-y-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Current Active Tier
              </span>
              <h3 className="text-2xl font-extrabold text-foreground dark:text-foreground-dark mt-0.5">
                RaftraCare Growth Plan
              </h3>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold font-mono text-foreground dark:text-foreground-dark">
                ₹14,999
              </div>
              <div className="text-[11px] text-foreground-muted">Monthly billing</div>
            </div>
          </div>

          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark leading-relaxed">
            Your facility is licensed for up to <strong>250 beds</strong>, complete clinical EMR,
            laboratory LIS, pharmacy dispensing, and insurance pre-authorization.
          </p>

          <div className="pt-2 border-t border-border dark:border-border-dark grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-foreground-muted">Licensed Beds:</span>
              <div className="font-bold text-base mt-0.5">240 / 250</div>
              <div className="text-[10px] text-emerald-600 font-medium">96% utilized</div>
            </div>
            <div>
              <span className="text-foreground-muted">Active Staff:</span>
              <div className="font-bold text-base mt-0.5">48 Users</div>
              <div className="text-[10px] text-primary font-medium">Unlimited tier</div>
            </div>
            <div>
              <span className="text-foreground-muted">Next Invoice:</span>
              <div className="font-bold text-base mt-0.5 font-mono">17 Oct 2026</div>
              <div className="text-[10px] text-foreground-muted">Auto-pay enabled</div>
            </div>
          </div>
        </Card>

        {/* Payment Method on file */}
        <Card className="p-5 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">
              Payment Method
            </span>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-7 rounded bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center">
                VISA
              </div>
              <div>
                <div className="font-mono font-bold text-xs">•••• •••• •••• 4092</div>
                <div className="text-[11px] text-foreground-muted">Expires 08/28 · HDFC Bank</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border dark:border-border-dark flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">Razorpay Verified</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => success("Payment Method", "Card update form opened.")}
            >
              Update Card
            </Button>
          </div>
        </Card>
      </div>

      {/* Plan Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
          Available RaftraCare Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={`p-6 flex flex-col justify-between space-y-6 relative ${
                p.popular ? "border-2 border-primary shadow-md" : ""
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white uppercase tracking-wider shadow-sm">
                  Most Popular For Hospitals
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-foreground dark:text-foreground-dark">
                    {p.name}
                  </h4>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-foreground dark:text-foreground-dark">
                    {p.price}
                  </span>
                  <span className="text-xs text-foreground-muted">{p.period}</span>
                </div>

                <ul className="space-y-2 text-xs">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-foreground dark:text-foreground-dark">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {p.current ? (
                  <Button variant="outline" size="md" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleInitiatePayment(p.id)}
                  >
                    Upgrade to {p.name}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SaaS Invoice History Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground dark:text-foreground-dark">
          RaftraCare Billing Invoices
        </h3>
        <Card className="divide-y divide-border dark:divide-border-dark text-xs">
          {[
            { id: "INV-HOS-9011", date: "17 Aug 2026", amount: "₹14,999", plan: "Growth Plan" },
            { id: "INV-HOS-8420", date: "17 Jul 2026", amount: "₹14,999", plan: "Growth Plan" },
            { id: "INV-HOS-7822", date: "17 Jun 2026", amount: "₹14,999", plan: "Growth Plan" },
          ].map((inv) => (
            <div key={inv.id} className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-primary">{inv.id}</span>
                <span className="text-foreground-muted">{inv.date}</span>
                <span className="font-medium text-foreground dark:text-foreground-dark">
                  {inv.plan}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold">{inv.amount}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  PAID
                </span>
                <button
                  onClick={() => success("Download Started", `Receipt ${inv.id}.pdf downloading.`)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground-muted hover:text-foreground"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Razorpay Simulated Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Razorpay Secure Subscription Checkout"
        description="Encrypted 256-bit automated hospital billing gateway"
      >
        <div className="space-y-4 text-xs">
          {paymentSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-foreground">
                Subscription Upgraded Successfully!
              </h4>
              <p className="text-foreground-muted">
                Your hospital operations tier has been upgraded to{" "}
                <strong>{selectedPlan}</strong>. All new capacity features are immediately
                unlocked.
              </p>
              <Button onClick={() => setCheckoutModalOpen(false)} className="mt-2">
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Selected Tier:</span>
                  <span className="font-bold">{selectedPlan} Plan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Hospital:</span>
                  <span>{hospital?.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border text-sm font-bold">
                  <span>Due Today:</span>
                  <span className="text-primary font-mono">
                    {selectedPlan === "ENTERPRISE" ? "Custom Quote" : "₹14,999.00"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-foreground-muted">Payment Method:</div>
                <div className="p-3 rounded border border-primary/50 bg-blue-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-mono font-medium">HDFC Card (•••• 4092)</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">Auto-Renew</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isProcessing}
                  onClick={handleSimulateRazorpay}
                >
                  Confirm & Pay via Razorpay
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
