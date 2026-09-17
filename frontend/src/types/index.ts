// HospitalOS Core Data Types & Enums

export type UserRole =
  | "SUPER_ADMIN"
  | "HOSPITAL_ADMIN"
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "ACCOUNTANT"
  | "PATIENT";

export type SubscriptionTier = "FREE_TRIAL" | "STARTER" | "GROWTH" | "ENTERPRISE";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELLED"
  | "EXPIRED";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type QueueStatus =
  | "BOOKED"
  | "CHECKED_IN"
  | "WAITING"
  | "CALLED"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "SKIPPED"
  | "CANCELLED"
  | "NO_SHOW";

export type EncounterType = "OPD" | "IPD" | "EMERGENCY";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Priority = "NORMAL" | "URGENT" | "EMERGENCY" | "VIP";

export type WardType =
  | "GENERAL"
  | "SEMI_PRIVATE"
  | "PRIVATE"
  | "ICU"
  | "NICU"
  | "EMERGENCY"
  | "RECOVERY";

export type BedStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "RESERVED"
  | "CLEANING";

export type LabOrderStatus =
  | "ORDERED"
  | "SAMPLE_PENDING"
  | "COLLECTED"
  | "PROCESSING"
  | "RESULT_ENTERED"
  | "VERIFIED"
  | "PUBLISHED"
  | "CANCELLED";

export type InvoiceStatus =
  | "DRAFT"
  | "GENERATED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "ONLINE"
  | "INSURANCE"
  | "RAZORPAY";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "REFUNDED";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  hospital_id: string;
  department_id?: string;
  is_active: boolean;
  phone?: string;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  max_beds: number;
}

export interface Patient {
  id: string;
  hospital_id: string;
  uhid: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  dob: string;
  age: number;
  phone: string;
  email?: string;
  address?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  created_at: string;
  last_visit_date?: string;
  last_doctor_name?: string;
}

export interface Appointment {
  id: string;
  hospital_id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  patient_name: string;
  patient_uhid: string;
  doctor_name: string;
  department_name: string;
  appointment_date: string;
  appointment_time: string;
  token_number?: string;
  status: AppointmentStatus;
  reason_for_visit?: string;
  priority: Priority;
  is_teleconsult: boolean;
}

export interface QueueToken {
  id: string;
  token_number: string;
  patient_id: string;
  patient_name: string;
  patient_uhid: string;
  patient_age: number;
  patient_gender: Gender;
  doctor_id: string;
  doctor_name: string;
  department_id: string;
  department_name: string;
  room_number: string;
  status: QueueStatus;
  priority: Priority;
  estimated_wait_minutes: number;
  checked_in_at: string;
}

export interface Bed {
  id: string;
  ward_id: string;
  ward_name: string;
  ward_type: WardType;
  floor: string;
  bed_number: string;
  status: BedStatus;
  daily_charge: number;
  current_patient_id?: string;
  current_patient_name?: string;
  current_patient_uhid?: string;
  admitted_at?: string;
  expected_discharge?: string;
}

export interface Ward {
  id: string;
  name: string;
  type: WardType;
  floor: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
}

export interface PrescriptionItem {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  dispensed: boolean;
}

export interface Prescription {
  id: string;
  prescription_number: string;
  patient_id: string;
  patient_name: string;
  patient_uhid: string;
  doctor_name: string;
  encounter_id: string;
  date: string;
  status: "ACTIVE" | "DISPENSED" | "PARTIALLY_DISPENSED" | "CANCELLED";
  items: PrescriptionItem[];
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  form: string;
  strength: string;
  batch_number: string;
  expiry_date: string;
  current_stock: number;
  reserved_stock: number;
  reorder_level: number;
  unit_price: number;
  supplier: string;
}

export interface LabOrder {
  id: string;
  order_number: string;
  patient_id: string;
  patient_name: string;
  patient_uhid: string;
  doctor_name: string;
  tests: {
    test_name: string;
    result?: string;
    unit?: string;
    reference_range?: string;
    flag?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
    verified_by?: string;
    verified_at?: string;
  }[];
  order_date: string;
  status: LabOrderStatus;
  priority: Priority;
  sample_type: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  patient_name: string;
  patient_uhid: string;
  services_summary: string;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: InvoiceStatus;
  created_at: string;
  due_date: string;
  items: InvoiceItem[];
}

export interface InsuranceClaim {
  id: string;
  claim_number: string;
  patient_id: string;
  patient_name: string;
  patient_uhid: string;
  tpa_name: string;
  policy_number: string;
  estimated_cost: number;
  approved_amount: number;
  status:
    | "PRE_AUTH_PENDING"
    | "PRE_AUTH_APPROVED"
    | "CLAIM_SUBMITTED"
    | "QUERY_RAISED"
    | "SETTLED"
    | "REJECTED";
  query_note?: string;
  submitted_date: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  details: string;
}
