"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Building2, GitBranch, BedDouble, MapPin, Mail, Phone, Check } from "lucide-react";

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFacilityModal({ isOpen, onClose }: AddFacilityModalProps) {
  const { hospital, addHospital, availableHospitals } = useAuth();
  const { success } = useToast();

  const [mode, setMode] = useState<"branch" | "hospital">("branch");
  const [formData, setFormData] = useState({
    name: "",
    branch_name: "",
    code: "",
    city: "Gurugram",
    state: "Haryana",
    max_beds: 60,
    phone: "+91 98765 00000",
    email: "",
    address_line: "",
  });

  // Unique org names from existing hospitals
  const existingOrgs = Array.from(
    new Set(availableHospitals.map((h) => h.organization_name || h.name))
  );

  const [selectedOrg, setSelectedOrg] = useState(
    hospital?.organization_name || existingOrgs[0] || "Metro Health Systems"
  );
  const [newOrgName, setNewOrgName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNewHospital = mode === "hospital";
    const orgName = isNewHospital ? newOrgName || formData.name : selectedOrg;
    const hospitalName = isNewHospital ? formData.name : (hospital?.name || "Metro General Hospital");
    const branchName = isNewHospital
      ? formData.branch_name || "Main Flagship Campus"
      : formData.branch_name || "New City Branch";

    const newFacility = addHospital({
      name: hospitalName,
      branch_name: branchName,
      organization_name: orgName,
      organization_id: `org_${orgName.toLowerCase().replace(/\s+/g, "_")}`,
      code: formData.code || (isNewHospital ? "HOSP-NEW" : `${hospital?.code || "MGH"}-${branchName.slice(0, 2).toUpperCase()}`),
      city: formData.city,
      state: formData.state,
      address_line: formData.address_line || "Healthcare Hub Sector 21",
      max_beds: Number(formData.max_beds) || 50,
      phone: formData.phone,
      email: formData.email || `admin@${hospitalName.toLowerCase().replace(/\s+/g, "")}.org`,
      subscription_tier: hospital?.subscription_tier || "GROWTH",
      is_main_branch: isNewHospital,
    });

    success(
      isNewHospital ? "Hospital Tenant Created" : "Branch Facility Added",
      `Switched context to ${newFacility.name} (${newFacility.branch_name}). Multi-tenancy active.`
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Provision Multi-Tenant Healthcare Facility"
      subtitle="Add a new branch location or register an independent hospital tenant"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Toggle Mode: Branch vs New Hospital */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-border dark:border-border-dark">
          <button
            type="button"
            onClick={() => setMode("branch")}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "branch"
                ? "bg-white dark:bg-slate-900 text-primary shadow-xs"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Add Branch to Current Hospital
          </button>
          <button
            type="button"
            onClick={() => setMode("hospital")}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "hospital"
                ? "bg-white dark:bg-slate-900 text-primary shadow-xs"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Register Separate Hospital Tenant
          </button>
        </div>

        {/* Dynamic Context banner */}
        <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-800 dark:text-blue-300">
          {mode === "branch" ? (
            <span>
              Adding an additional operational branch under <strong>{hospital?.organization_name || hospital?.name}</strong>.
              Patient UHIDs, doctor directories, and SaaS subscription limits are shared across branches.
            </span>
          ) : (
            <span>
              Creating an isolated, independent hospital tenant with separate compliance records,
              billing account, and administrative permissions.
            </span>
          )}
        </div>

        {/* Organization Selection (for hospital mode) */}
        {mode === "hospital" ? (
          <div className="space-y-3">
            <Input
              label="Organization / Healthcare Group Name *"
              required
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="e.g. Fortis Healthcare Network or Max Care Group"
            />
            <Input
              label="Hospital Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Max Super Speciality Hospital"
            />
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-between">
            <div>
              <div className="text-[10px] text-foreground-muted uppercase font-semibold">Current Parent Hospital</div>
              <div className="text-xs font-bold text-foreground mt-0.5">{hospital?.name}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Active Tenant
            </span>
          </div>
        )}

        {/* Branch / Facility Details */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Branch / Campus Name *"
            required
            value={formData.branch_name}
            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
            placeholder={mode === "branch" ? "e.g. South Extension Daycare Clinic" : "e.g. Flagship Campus"}
          />
          <Input
            label="Facility Code (Prefix) *"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g. MGH-SE or ASSH-02"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="City *"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Gurugram"
          />
          <Input
            label="State *"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="e.g. Haryana"
          />
          <Input
            label="Licensed Bed Capacity *"
            type="number"
            min="5"
            max="1500"
            required
            value={formData.max_beds}
            onChange={(e) => setFormData({ ...formData, max_beds: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Official Contact Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Facility Admin Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="branch.admin@hospital.org"
          />
        </div>

        <Input
          label="Street Address / Location"
          value={formData.address_line}
          onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
          placeholder="e.g. Sector 29, Near City Center Metro Station"
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Check className="w-4 h-4 mr-1.5" />
            {mode === "branch" ? "Provision Hospital Branch" : "Create Hospital Tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
