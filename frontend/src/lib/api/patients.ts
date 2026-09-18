import { http } from "./client";
import { Gender } from "@/types";

export interface RegisterPatientPayload {
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  blood_group?: string;
  phone: string;
  email?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  abha_id?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  notes?: string;
}

export interface PatientListItem {
  id: string;
  uhid: string;
  name: string;
  gender: Gender;
  phone: string;
  date_of_birth: string;
  blood_group?: string;
}

export interface PatientDetail {
  id: string;
  uhid: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  blood_group?: string;
  phone: string;
  email?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  abha_id?: string;
  notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface PatientsListResponse {
  patients: PatientListItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const patientsApi = {
  async list(params?: { search?: string; page?: number; limit?: number }): Promise<PatientListItem[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const endpoint = `/patients/${qs ? `?${qs}` : ""}`;
    const res = await http.get<any>(endpoint);
    // res can be an array directly or { patients: [...], meta: ... }
    if (Array.isArray(res)) return res;
    if (res?.patients && Array.isArray(res.patients)) return res.patients;
    return [];
  },

  async getById(id: string): Promise<PatientDetail> {
    return http.get<PatientDetail>(`/patients/${id}`);
  },

  async register(payload: RegisterPatientPayload): Promise<{ id: string; uhid: string; name: string }> {
    return http.post<{ id: string; uhid: string; name: string }>("/patients/", payload);
  },

  async recordVitals(patientId: string, payload: any): Promise<any> {
    return http.post(`/patients/${patientId}/vitals`, payload);
  },

  async createEncounter(payload: any): Promise<any> {
    return http.post("/patients/encounters", payload);
  },
};
