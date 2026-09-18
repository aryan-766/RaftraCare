"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { UserRole } from "@/types";
import { ShieldCheck, Mail, User, Building2, Lock, Check } from "lucide-react";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffAdded?: (newStaff: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: "ACTIVE" | "INACTIVE";
  }) => void;
}

export function InviteStaffModal({ isOpen, onClose, onStaffAdded }: InviteStaffModalProps) {
  const { success } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Cardiology OPD");
  const [role, setRole] = useState<UserRole>("DOCTOR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleDescriptions: Record<UserRole, string> = {
    DOCTOR: "Clinical assessment, EMR patient notes, e-Prescriptions, and diagnostic orders.",
    NURSE: "Inpatient bed map, 4-hourly vitals, medication administration, and shift checklists.",
    RECEPTIONIST: "Patient registration, token issuance, queue caller, and appointment booking.",
    PHARMACIST: "Prescription dispensing queue, stock inventory, and batch expiry tracking.",
    LAB_TECHNICIAN: "Sample accessioning, test entry, analyzer sync, and critical alert flags.",
    ACCOUNTANT: "Cashless TPA claims, consolidated invoicing, cashier shift reconciliation.",
    HOSPITAL_ADMIN: "Full system administration, multi-branch settings, staff RBAC, and billing.",
    SUPER_ADMIN: "System-wide cross-tenant infrastructure and compliance governance.",
    PATIENT: "Patient portal access to lab reports and digital discharge summaries.",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newStaff = {
        id: `staff_${Date.now()}`,
        name,
        email,
        role,
        department,
        status: "ACTIVE" as const,
      };

      if (onStaffAdded) {
        onStaffAdded(newStaff);
      }

      success(
        "Staff Invitation Sent",
        `${name} invited as ${role} in ${department}. RBAC permissions granted.`
      );

      setIsSubmitting(false);
      setName("");
      setEmail("");
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Staff & Assign RBAC Role">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[11px] text-primary flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Role-Based Access Control (RBAC):</strong> Invited staff members will only access authorized clinical and operational modules based on their designated role.
          </span>
        </div>

        <Input
          label="Staff Full Name *"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dr. Priya Sengupta"
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Official Work Email *"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. priya.doctor@hospital.org"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Department *"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={[
              { value: "Cardiology OPD", label: "Cardiology OPD" },
              { value: "General Medicine", label: "General Medicine" },
              { value: "Emergency & Triage", label: "Emergency & Triage" },
              { value: "ICU & General Ward", label: "ICU & General Ward" },
              { value: "Central Pharmacy", label: "Central Pharmacy" },
              { value: "Pathology Laboratory", label: "Pathology Laboratory" },
              { value: "Billing & Cashier", label: "Billing & Cashier" },
              { value: "Front Desk Reception", label: "Front Desk Reception" },
              { value: "Hospital Administration", label: "Hospital Administration" },
            ]}
          />

          <Select
            label="Designated RBAC Role *"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: "DOCTOR", label: "Doctor (Clinician)" },
              { value: "NURSE", label: "Ward Staff Nurse" },
              { value: "RECEPTIONIST", label: "Receptionist (Front Desk)" },
              { value: "PHARMACIST", label: "Pharmacist" },
              { value: "LAB_TECHNICIAN", label: "Lab Technician (Pathologist)" },
              { value: "ACCOUNTANT", label: "Accountant (Cashier)" },
              { value: "HOSPITAL_ADMIN", label: "Hospital Administrator" },
            ]}
          />
        </div>

        {/* Dynamic RBAC Scope Box */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/70 space-y-1">
          <div className="font-bold text-[10px] text-foreground-muted uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-primary" />
            <span>Role Permissions Scope:</span>
          </div>
          <div className="text-xs text-foreground font-medium">
            {roleDescriptions[role]}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Send Invite & Grant Access
          </Button>
        </div>
      </form>
    </Modal>
  );
}
