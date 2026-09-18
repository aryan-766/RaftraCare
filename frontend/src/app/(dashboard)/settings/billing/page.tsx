"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
  Building,
  Users,
  BedDouble,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface SaaSPlan {
  id: string;
  name: string;
  tier: "STARTER" | "GROWTH" | "ENTERPRISE";
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  limits: {
    beds: number;
    staff: number;
    patients: number;
    branches: number;
  };
  features: string[];
}

const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "plan_starter",
    name: "Starter Clinic & Nursing Home",
    tier: "STARTER",
    monthlyPrice: 9999,
    annualPrice: 7999,
    description: "Designed for single-facility clinics and small nursing homes up to 50 beds.",
    limits: {
      beds: 50,
      staff: 25,
      patients: 10000,
      branches: 1,
    },
    features: [
      "Full OPD & Token Queue",
      "Digital Patient EMR & Vitals",
      "Integrated Billing & GST Receipts",
      "Standard Role-Based Access",
      "Single Facility Deployment",
    ],
  },
  {
    id: "plan_growth",
    name: "Growth Hospital Operations",
    tier: "GROWTH",
    monthlyPrice: 24999,
    annualPrice: 19999,
    description: "Comprehensive multi-department hospital operations for up to 250 beds.",
    limits: {
      beds: 250,
      staff: 150,
      patients: 100000,
      branches: 3,
    },
    features: [
      "Everything in Starter",
      "Inpatient Ward & Bed Map Management",
      "Laboratory Analyzer Integration",
      "Pharmacy POS & Inventory Batches",
      "Razorpay AutoPay & Insurance TPA",
      "Up to 3 Hospital Branches",
    ],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Health System",
    tier: "ENTERPRISE",
    monthlyPrice: 59999,
    annualPrice: 49999,
    description: "Multi-hospital groups, specialized surgical centers, and university hospitals.",
    limits: {
      beds: 1000,
      staff: 1000,
      patients: 1000000,
      branches: 10,
    },
    features: [
      "Everything in Growth",
      "Multi-Tenant Group Operations",
      "Custom SLA & Dedicated Account Manager",
      "Full Audit Log & Immutable Compliance Export",
      "PACS / DICOM Imaging Integration",
      "Custom REST Webhooks & Single Sign-On",
    ],
  },
];

export default function SaaSSubscriptionBillingPage() {
  const { hospital } = useAuth();
  const { success } = useToast();

  const [annualBilling, setAnnualBilling] = useState(true);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SaaSPlan | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  const currentTier = hospital?.subscription_tier || "GROWTH";

  // Mock SaaS tax invoices for this hospital tenant
  const saasInvoices = [
    {
      id: "inv_saas_003",
      number: "RC-INV-2026-03",
      date: "01 Mar 2026",
      plan: "Growth Hospital Operations",
      amount: annualBilling ? 239988 : 24999,
      status: "PAID",
    },
    {
      id: "inv_saas_002",
      number: "RC-INV-2026-02",
      date: "01 Feb 2026",
      plan: "Growth Hospital Operations",
      amount: 24999,
      status: "PAID",
    },
    {
      id: "inv_saas_001",
      number: "RC-INV-2026-01",
      date: "01 Jan 2026",
      plan: "Starter Clinic",
      amount: 9999,
      status: "PAID",
    },
  ];

  const handleConfirmUpgrade = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsProcessingUpgrade(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      success(
        "Subscription Updated",
        `Hospital subscription upgraded to ${selectedPlanForUpgrade.name}. Razorpay recurring mandate registered.`
      );
      setSelectedPlanForUpgrade(null);
    } finally {
      setIsProcessingUpgrade(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-primary border border-blue-200 dark:border-blue-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RaftraCare Platform Subscription</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          SaaS Billing & Subscription
        </h1>
        <p className="text-xs text-foreground-muted mt-1 max-w-2xl">
          Manage your hospital's platform tier, operational resource limits, Razorpay payment methods,
          and B2B GST tax invoices for RaftraCare HospitalOS.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <Card className="p-6 border-primary/30 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/10 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Active Hospital Plan
              </span>
              <StatusBadge status={hospital?.subscription_status || "ACTIVE"} />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {currentTier === "GROWTH"
                ? "Growth Hospital Operations"
                : currentTier === "ENTERPRISE"
                ? "Enterprise Health System"
                : "Starter Clinic"}
            </h2>
            <p className="text-xs text-foreground-muted">
              Next automatic renewal on <strong>01 April 2026</strong> via Razorpay e-mandate.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-extrabold text-foreground">
              ₹{currentTier === "GROWTH" ? "24,999" : currentTier === "ENTERPRISE" ? "59,999" : "9,999"}
              <span className="text-xs font-normal text-foreground-muted"> / month + GST</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Billed Annually · GST Credit Available
            </span>
          </div>
        </div>

        {/* Quota Usage Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-primary" />
                Licensed Beds
              </span>
              <span className="font-bold text-foreground">185 / 250</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "74%" }} />
            </div>
            <span className="text-[10px] text-foreground-muted">74% capacity utilized</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Staff Accounts
              </span>
              <span className="font-bold text-foreground">62 / 150</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "41%" }} />
            </div>
            <span className="text-[10px] text-foreground-muted">41% quota utilized</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-primary" />
                Hospital Branches
              </span>
              <span className="font-bold text-foreground">2 / 3</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "66%" }} />
            </div>
            <span className="text-[10px] text-foreground-muted">1 branch slot available</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                API & Sync Quota
              </span>
              <span className="font-bold text-foreground">Unlimited</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
            </div>
            <span className="text-[10px] text-foreground-muted">Dedicated tenant pool</span>
          </div>
        </div>
      </Card>

      {/* Available Plans Comparison & Upgrade */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Compare Plans & Scale Capacity</h3>
            <p className="text-xs text-foreground-muted">
              Instantly upgrade your facility bed limits, branches, and specialized department integrations.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border self-start">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                !annualBilling
                  ? "bg-white dark:bg-slate-700 text-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1 ${
                annualBilling
                  ? "bg-white dark:bg-slate-700 text-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAAS_PLANS.map((plan) => {
            const isCurrent = plan.tier === currentTier;
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;

            return (
              <Card
                key={plan.id}
                className={`p-6 space-y-5 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-foreground">{plan.name}</h4>
                      <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <span className="font-mono text-3xl font-extrabold text-foreground">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-foreground-muted"> / month</span>
                  </div>

                  {/* Quota specs */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1 border border-border">
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Max Beds:</span>
                      <span className="font-bold text-foreground">{plan.limits.beds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Staff Logins:</span>
                      <span className="font-bold text-foreground">{plan.limits.staff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground-muted">Branches:</span>
                      <span className="font-bold text-foreground">{plan.limits.branches} Facility</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                      Included Modules
                    </span>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  {isCurrent ? (
                    <Button variant="outline" size="md" disabled className="w-full justify-center">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setSelectedPlanForUpgrade(plan)}
                      className="w-full justify-center font-bold"
                    >
                      <span>Select {plan.tier === "ENTERPRISE" ? "Enterprise" : "Plan"}</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Invoices Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>SaaS Payment Method</span>
            </h4>
            <Button variant="outline" size="sm">
              Update Method
            </Button>
          </div>
          <p className="text-xs text-foreground-muted">
            Recurring monthly platform license fees are charged automatically via Razorpay e-mandate.
          </p>
          <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                VISA
              </div>
              <div>
                <div className="font-bold text-xs text-foreground font-mono">•••• •••• •••• 4242</div>
                <div className="text-[11px] text-foreground-muted">Expires 08/29 · Primary Mandate</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>
        </Card>

        {/* SaaS Platform Invoices */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Platform Tax Invoices</span>
            </h4>
            <span className="text-xs text-foreground-muted">GST Registered B2B</span>
          </div>
          <p className="text-xs text-foreground-muted">
            Download GST-compliant monthly invoices for your hospital's accounting records.
          </p>

          <div className="space-y-2">
            {saasInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-lg border border-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-foreground">{inv.number}</div>
                  <div className="text-[11px] text-foreground-muted">{inv.date} · {inv.plan}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-foreground">
                    ₹{inv.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => success("Downloading Invoice", `Tax Invoice ${inv.number} PDF generated.`)}
                    className="p-1.5 rounded-lg border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Plan Upgrade Confirmation Modal */}
      <Modal
        isOpen={!!selectedPlanForUpgrade}
        onClose={() => setSelectedPlanForUpgrade(null)}
        title={`Upgrade to ${selectedPlanForUpgrade?.name || ""}`}
      >
        {selectedPlanForUpgrade && (
          <div className="space-y-4 text-xs">
            <p className="text-foreground-muted">
              You are selecting the <strong>{selectedPlanForUpgrade.name}</strong> tier. Your new limits will apply immediately.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Billing Cycle:</span>
                <span className="font-bold text-foreground">{annualBilling ? "Annual (Save 20%)" : "Monthly"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Bed Quota:</span>
                <span className="font-bold text-foreground">{selectedPlanForUpgrade.limits.beds} Beds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Branch Allocations:</span>
                <span className="font-bold text-foreground">{selectedPlanForUpgrade.limits.branches} Facilities</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-bold">
                <span className="text-foreground">Subscription Fee:</span>
                <span className="font-mono text-primary text-sm">
                  ₹{(annualBilling ? selectedPlanForUpgrade.annualPrice : selectedPlanForUpgrade.monthlyPrice).toLocaleString()} / month + GST
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlanForUpgrade(null)}
                disabled={isProcessingUpgrade}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmUpgrade}
                isLoading={isProcessingUpgrade}
                className="font-bold"
              >
                Confirm Razorpay Mandate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
