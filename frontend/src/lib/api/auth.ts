import { http } from "./client";
import { UserRole } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
  hospital_slug?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in?: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  hospital_id?: string;
  hospital_name?: string;
  hospital_slug?: string;
  hospital?: {
    id: string;
    name: string;
    slug: string;
    code: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    currency?: string;
  };
  staff_id?: string;
  available_facilities?: any[];
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUserResponse;
}

export interface RegisterHospitalPayload {
  hospital_name: string;
  hospital_slug: string;
  hospital_code: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  currency?: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_password: string;
  admin_phone?: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return http.post<LoginResponse>("/auth/login", payload);
  },

  async registerHospital(payload: RegisterHospitalPayload): Promise<any> {
    return http.post("/auth/register-hospital", payload);
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return http.post<AuthTokens>("/auth/refresh", { refresh_token: refreshToken });
  },

  async getMe(): Promise<AuthUserResponse> {
    return http.get<AuthUserResponse>("/auth/me");
  },

  async getFacilities(): Promise<any[]> {
    return http.get<any[]>("/auth/facilities");
  },

  async switchHospital(hospitalId: string): Promise<any> {
    return http.post("/auth/switch-hospital", { hospital_id: hospitalId });
  },

  async logout(refreshToken?: string): Promise<any> {
    return http.post("/auth/logout", { refresh_token: refreshToken });
  },
};
