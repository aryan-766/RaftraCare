"use client";

import React, { useState } from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/lib/auth/AuthContext";
import { AddFacilityModal } from "@/components/modals/AddFacilityModal";
import {
  Sparkles,
  Check,
  CreditCard,
  Download,
  AlertCircle,
  Building2,
  GitBranch,
  BedDouble,
  Users,
  ShieldCheck,
  Zap,
  Plus,
  ArrowRight,
  Receipt,
  FileCheck2,
} from "lucide-react";

export default function PlansBillingPage() {
  const { hospital, availableHospitals, switchHospital } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>(hospital?.subscription_tier || "GROWTH");
  const [annualBilling, setAnnualBilling] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "branches" | "invoices" | "payment">("plans");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [addFacilityOpen, setAddFacilityOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { success } = useToast();

  const plans = [
    {
      id: "STARTER",
      name: "Starter Clinic",
      monthly: 4999,
      annual: 3999,
      desc: "For small nursing homes and independent outpatient clinics.",
      beds: "Up to 30 Beds",
      branches: "1 Facility",
      features: [
        "1 Hospital Facility Location",
        "Up to 30 Hospital Beds",
        "Front Desk & Token Queue",
        "OPD Doctor Workstation",
        "Pharmacy Counter & Dispensing",
        "Cash & UPI Payment Invoicing",
        "Standard Staff Permissions",
      ],
      current: hospital?.subscription_tier === "STARTER",
    },
    {
      id: "GROWTH",
      name: "Growth Hospital",
      monthly: 14999,
      annual: 11999,
      desc: "For multi-ward tertiary care hospitals scaling their clinical operations.",
      beds: "Up to 250 Beds",
      branches: "Up to 3 Branches Included",
      features: [
        "Up to 3 Connected Hospital Branches",
        "Up to 250 Hospital Beds with Live Map",
        "Complete Inpatient (IPD) Admissions",
        "Emergency Triage & Resuscitation Bay",
        "Laboratory (LIS) & Radiology System",
        "TPA & Cashless Insurance Pre-Auth",
        "Unlimited Staff & Biometric Roster",
        "Priority 24/7 Enterprise Support",
      ],
      current: hospital?.subscription_tier === "GROWTH" || !hospital?.subscription_tier,
      popular: true,
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise Multi-Hospital",
      monthly: 39999,
      annual: 31999,
      desc: "For multi-city healthcare chains, medical colleges, and hospital groups.",
      beds: "500+ Licensed Beds",
      branches: "Unlimited Hospital Branches",
      features: [
        "Unlimited Hospital Branches & Campuses",
        "500+ Licensed Inpatient Beds",
        "Multi-Tenant Consolidated Analytics",
        "ASTM / HL7 Bidirectional LIS Bridges",
        "PACS / DICOM Imaging Viewer Bridge",
        "Dedicated Customer Success Manager",
        "Custom SLAs & Database Isolation",
        "On-Premises or Private Cloud Option",
      ],
      current: hospital?.subscription_tier === "ENTERPRISE",
    },
  ];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setCheckoutModalOpen(false);
        setPaymentSuccess(false);
        if (hospital) {
          hospital.subscription_tier = selectedPlan as any;
        }
        success("Subscription Active", `RaftraCare upgraded to ${selectedPlan} tier via Razorpay.`);
      }, 1200);
    }, 1500);
  };

  const invoices = [
    {
      id: "INV-2026-0901",
      date: "01 Sep 2026",
      desc: "RaftraCare HospitalOS — Growth Tier (Multi-Tenant)",
      amount: "₹17,698",
      tax: "₹2,699 (18% GST)",
      status: "PAID",
      mode: "Razorpay Auto-Debit (HDFC •••• 4242)",
    },
    {
      id: "INV-2026-0801",
      date: "01 Aug 2026",
      desc: "RaftraCare HospitalOS — Growth Tier (Multi-Tenant)",
      amount: "₹17,698",
      tax: "₹2,699 (18% GST)",
      status: "PAID",
      mode: "Razorpay Auto-Debit (HDFC •••• 4242)",
    },
    {
      id: "INV-2026-0701",
      date: "01 Jul 2026",
      desc: "RaftraCare HospitalOS — Growth Tier (Multi-Tenant)",
      amount: "₹17,698",
      tax: "₹2,699 (18% GST)",
      status: "PAID",
      mode: "Razorpay Auto-Debit (HDFC •••• 4242)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              SaaS Plans & Multi-Tenancy
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              Active Subscription
            </span>
          </div>
          <p className="text-xs text-foreground-muted mt-1">
            Manage your hospital SaaS tier, multi-branch allocations, bed capacity, and B2B GST billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddFacilityOpen(true)}
            leftIcon={<GitBranch className="w-4 h-4" />}
          >
            + Add Branch / Hospital
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedPlan("GROWTH");
              setCheckoutModalOpen(true);
            }}
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Change SaaS Plan
          </Button>
        </div>
      </div>

      {/* 2. Key Multi-Tenant Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active SaaS Tier"
          value={`${hospital?.subscription_tier || "GROWTH"} Plan`}
          subtitle={annualBilling ? "Annual Billing (Save 20%)" : "Monthly Billing"}
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          title="Multi-Tenant Branches"
          value={`${availableHospitals.length} / 3 Connected`}
          subtitle="Hospital & clinic locations"
          icon={<Building2 className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Bed Capacity Allocated"
          value={`${availableHospitals.reduce((acc, h) => acc + (h.max_beds || 0), 0)} Beds`}
          subtitle={`Across ${availableHospitals.length} facilities`}
          icon={<BedDouble className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Next Renewal Date"
          value="01 Oct 2026"
          subtitle="Auto-renew via Razorpay"
          icon={<CreditCard className="w-4 h-4 text-blue-600" />}
        />
      </div>

      {/* 3. Main Navigation Tabs */}
      <div className="border-b border-border dark:border-border-dark flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("plans")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "plans"
              ? "border-primary text-primary"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Available Plans & Upgrade
        </button>
        <button
          onClick={() => setActiveTab("branches")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "branches"
              ? "border-primary text-primary"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Multi-Tenant Branches ({availableHospitals.length})
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "invoices"
              ? "border-primary text-primary"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <Receipt className="w-4 h-4" />
          GST Invoices & History
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "payment"
              ? "border-primary text-primary"
              : "border-transparent text-foreground-muted hover:text-foreground"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Razorpay Payment Method
        </button>
      </div>

      {/* 4. Tab 1: Available Plans */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          {/* Billing Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border">
            <div>
              <div className="font-bold text-sm text-foreground">Select Billing Cycle</div>
              <div className="text-xs text-foreground-muted">Save 20% by choosing annual hospital billing.</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${!annualBilling ? "text-primary font-bold" : "text-foreground-muted"}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-11 h-6 rounded-full bg-slate-200 dark:bg-slate-700 p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-primary shadow-xs transition-transform ${
                    annualBilling ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold flex items-center gap-1 ${annualBilling ? "text-primary font-bold" : "text-foreground-muted"}`}>
                Annual
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  -20%
                </span>
              </span>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((p) => {
              const price = annualBilling ? p.annual : p.monthly;
              const isCurrent = (hospital?.subscription_tier || "GROWTH") === p.id;

              return (
                <Card
                  key={p.id}
                  className={`p-6 flex flex-col justify-between relative transition-all ${
                    isCurrent
                      ? "border-2 border-primary ring-4 ring-blue-500/10 shadow-lg"
                      : "hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                      Current Active Plan
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark">{p.name}</h3>
                    <p className="text-xs text-foreground-muted mt-1 min-h-[32px]">{p.desc}</p>

                    <div className="my-5 pb-5 border-b border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-foreground-muted">/ facility / month</span>
                      </div>
                      <div className="text-[10px] text-foreground-muted mt-0.5">
                        {annualBilling ? "Billed annually" : "Billed monthly"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-border text-xs">
                      <div>
                        <span className="text-[10px] text-foreground-muted uppercase font-bold">Beds</span>
                        <div className="font-bold text-foreground">{p.beds}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-foreground-muted uppercase font-bold">Tenancy</span>
                        <div className="font-bold text-foreground">{p.branches}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-bold text-foreground uppercase tracking-wider">Includes:</div>
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-foreground-muted">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={isCurrent ? "outline" : "primary"}
                    disabled={isCurrent}
                    onClick={() => {
                      setSelectedPlan(p.id);
                      setCheckoutModalOpen(true);
                    }}
                    className="w-full text-xs font-bold"
                  >
                    {isCurrent ? "Active on this Facility" : `Switch to ${p.name}`}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Multi-Tenant Branch Management */}
      {activeTab === "branches" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <div>
              <h3 className="font-bold text-sm text-foreground">Multi-Tenant Hospital Network</h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                Switch active hospital branch to manage localized patient queues, ward beds, or doctor schedules.
              </p>
            </div>
            <Button size="sm" onClick={() => setAddFacilityOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add Branch Location
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableHospitals.map((h) => {
              const isActive = hospital?.id === h.id;
              return (
                <Card
                  key={h.id}
                  className={`p-5 space-y-4 transition-all ${
                    isActive
                      ? "border-2 border-primary bg-blue-50/30 dark:bg-blue-950/20 shadow-sm"
                      : "hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{h.name}</h4>
                        {h.is_main_branch && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Headquarters
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground-muted mt-0.5 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-primary" />
                        <span>{h.branch_name || "Main Campus"}</span>
                        <span>·</span>
                        <span>{h.city}, {h.state}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-foreground">
                      {h.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-border text-xs">
                    <div>
                      <div className="text-[10px] text-foreground-muted uppercase">Licensed Beds</div>
                      <div className="font-bold text-foreground mt-0.5">{h.max_beds} Beds</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-foreground-muted uppercase">Organization</div>
                      <div className="font-bold text-foreground mt-0.5 truncate">{h.organization_name || h.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-foreground-muted uppercase">Status</div>
                      <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Operational
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[11px] text-foreground-muted">
                      {isActive ? "Currently viewing this facility" : "Switch active context"}
                    </span>
                    <Button
                      size="sm"
                      variant={isActive ? "secondary" : "primary"}
                      onClick={() => {
                        switchHospital(h.id);
                        success("Hospital Switched", `Active context changed to ${h.name} (${h.branch_name}).`);
                      }}
                    >
                      {isActive ? "Active Facility ✓" : "Switch to this Hospital"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Tab 3: GST Invoices */}
      {activeTab === "invoices" && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-sm text-foreground">B2B Tax Invoices & GST Receipts</h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                SAC Code 998313 (Software as a Service). Includes 18% GST input credit details.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 bg-blue-50 dark:bg-blue-950 rounded">
              GSTIN: 07AABCR8492C1Z4
            </span>
          </div>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <span>{inv.id}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-foreground-muted text-[11px] mt-0.5">
                    {inv.desc} · {inv.date}
                  </div>
                  <div className="text-foreground-muted text-[10px] mt-0.5">{inv.mode}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-sm text-foreground">{inv.amount}</div>
                    <div className="text-[10px] text-foreground-muted">{inv.tax}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => success("Invoice Downloaded", `Saved ${inv.id}.pdf for accounting.`)}
                  >
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. Tab 4: Razorpay Payment Method */}
      {activeTab === "payment" && (
        <Card className="p-6 space-y-6 max-w-2xl">
          <div>
            <h3 className="font-bold text-sm text-foreground">Authorized Payment Method</h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Automated recurring billing is powered by Razorpay Subscriptions (RBI e-mandate compliant).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                VISA
              </div>
              <div>
                <div className="font-bold text-xs text-foreground">HDFC Corporate Credit Card ·••• 4242</div>
                <div className="text-[11px] text-foreground-muted">Expires 09/2028 · Standing instruction enabled</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Primary
            </span>
          </div>

          <div className="space-y-3 text-xs border-t border-border pt-4">
            <div className="font-bold text-foreground">Hospital Billing Address:</div>
            <div className="text-foreground-muted leading-relaxed">
              {hospital?.name} ({hospital?.branch_name})<br />
              {hospital?.address_line}, {hospital?.city}, {hospital?.state} - {hospital?.pincode}<br />
              Billing Email: {hospital?.email}
            </div>
          </div>
        </Card>
      )}

      {/* Razorpay Simulated Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => !isProcessing && setCheckoutModalOpen(false)}
        title="Razorpay Healthcare SaaS Checkout"
        subtitle={`Upgrading ${hospital?.name} to ${selectedPlan} Tier`}
        size="md"
      >
        <div className="space-y-4 text-xs">
          {paymentSuccess ? (
            <div className="p-6 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Payment Successful!</h3>
              <p className="text-foreground-muted">
                Your hospital operating system has been upgraded to <strong>{selectedPlan}</strong>. All branch limits
                unlocked.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border space-y-2">
                <div className="flex justify-between font-bold">
                  <span>RaftraCare {selectedPlan} Plan ({annualBilling ? "Annual" : "Monthly"})</span>
                  <span>{selectedPlan === "ENTERPRISE" ? "₹31,999/mo" : "₹11,999/mo"}</span>
                </div>
                <div className="flex justify-between text-foreground-muted text-[11px]">
                  <span>18% GST (Input Tax Credit)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Select Payment Method:
                </div>
                <div className="space-y-1.5 text-xs text-foreground-muted">
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="payMethod" defaultChecked />
                    <span>HDFC Corporate Card (Visa •••• 4242)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="payMethod" />
                    <span>Corporate UPI (hospital@okhdfcbank)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="payMethod" />
                    <span>NEFT / RTGS Corporate Bank Transfer</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSimulatePayment} disabled={isProcessing}>
                  {isProcessing ? "Authorizing Razorpay..." : "Authorize Payment via Razorpay"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Add Facility / Branch Modal */}
      <AddFacilityModal
        isOpen={addFacilityOpen}
        onClose={() => setAddFacilityOpen(false)}
      />
    </div>
  );
}
