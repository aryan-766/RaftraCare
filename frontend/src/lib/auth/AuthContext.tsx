"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Hospital, UserRole } from "@/types";
import {
  authApi,
  LoginPayload,
} from "@/lib/api/auth";
import {
  getStoredToken,
  getStoredRefreshToken,
  getStoredHospitalId,
  setStoredTokens,
  clearStoredAuth,
} from "@/lib/api/client";

export interface AuthContextType {
  user: User | null;
  hospital: Hospital | null;
  availableHospitals: Hospital[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, hospitalSlug?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchHospital: (hospitalId: string) => Promise<boolean>;
  addHospital: (newFacility: Partial<Hospital>) => Hospital;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role to default permissions mapping matching backend permissions.py
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["*"],
  HOSPITAL_ADMIN: [
    "hospitals:read",
    "hospitals:update",
    "hospitals:billing",
    "subscriptions:manage",
    "staff:read",
    "staff:write",
    "staff:manage",
    "staff:delete",
    "patients:read",
    "patients:write",
    "emr:read",
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "queue:read",
    "queue:manage",
    "prescriptions:read",
    "pharmacy:read",
    "pharmacy:inventory",
    "lab:read",
    "radiology:read",
    "wards:read",
    "wards:manage",
    "admissions:read",
    "invoices:read",
    "invoices:write",
    "payments:process",
    "payments:refund",
    "reports:financial",
    "insurance:read",
    "insurance:write",
    "audit:read",
    "admin:settings",
  ],
  DOCTOR: [
    "patients:read",
    "patients:write",
    "emr:read",
    "emr:write",
    "appointments:read",
    "appointments:write",
    "queue:read",
    "queue:manage",
    "prescriptions:read",
    "prescriptions:write",
    "lab:read",
    "lab:order",
    "radiology:read",
    "radiology:order",
    "wards:read",
    "admissions:read",
    "admissions:write",
  ],
  NURSE: [
    "patients:read",
    "emr:read",
    "emr:write",
    "appointments:read",
    "queue:read",
    "prescriptions:read",
    "wards:read",
    "admissions:read",
    "admissions:write",
  ],
  RECEPTIONIST: [
    "patients:read",
    "patients:write",
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "queue:read",
    "queue:manage",
    "invoices:read",
    "invoices:write",
    "payments:process",
  ],
  PHARMACIST: [
    "patients:read",
    "prescriptions:read",
    "pharmacy:read",
    "pharmacy:dispense",
    "pharmacy:inventory",
    "invoices:read",
    "invoices:write",
    "payments:process",
  ],
  LAB_TECHNICIAN: [
    "patients:read",
    "lab:read",
    "lab:order",
    "lab:results_write",
  ],
  ACCOUNTANT: [
    "patients:read",
    "invoices:read",
    "invoices:write",
    "payments:process",
    "reports:financial",
    "insurance:read",
    "insurance:write",
  ],
  PATIENT: [
    "patients:read",
    "emr:read",
    "appointments:read",
    "appointments:write",
    "appointments:cancel",
    "prescriptions:read",
    "lab:read",
    "radiology:read",
    "invoices:read",
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [availableHospitals, setAvailableHospitals] = useState<Hospital[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    const storedToken = getStoredToken();
    const storedUserStr =
      typeof window !== "undefined"
        ? localStorage.getItem("raftracare_user_profile")
        : null;
    const storedHospStr =
      typeof window !== "undefined"
        ? localStorage.getItem("raftracare_hospital_profile")
        : null;

    if (!storedToken && !storedUserStr) {
      setUser(null);
      setToken(null);
      setHospital(null);
      setIsLoading(false);
      return;
    }

    if (storedUserStr) {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        setUser(parsedUser);
      } catch {}
    }

    if (storedHospStr) {
      try {
        const parsedHosp = JSON.parse(storedHospStr);
        setHospital(parsedHosp);
        setAvailableHospitals([parsedHosp]);
      } catch {}
    }

    if (storedToken) {
      setToken(storedToken);
      try {
        const me = await authApi.getMe();
        if (me && me.id) {
          const fullUser: User = {
            id: me.id,
            email: me.email,
            first_name: me.first_name,
            last_name: me.last_name,
            role: me.role,
            hospital_id: me.hospital_id || "",
            department_id: undefined,
            is_active: true,
          };
          setUser(fullUser);
          localStorage.setItem("raftracare_user_profile", JSON.stringify(fullUser));

          if (me.hospital) {
            const activeHosp: Hospital = {
              id: me.hospital.id,
              name: me.hospital.name,
              code: me.hospital.code,
              slug: me.hospital.slug,
              email: me.hospital.email || me.email,
              phone: me.hospital.phone || "",
              address_line: "",
              city: me.hospital.city || "",
              state: me.hospital.state || "",
              pincode: "",
              subscription_tier: "GROWTH",
              subscription_status: "ACTIVE",
              max_beds: 100,
              is_main_branch: true,
            };
            setHospital(activeHosp);
            localStorage.setItem("raftracare_hospital_profile", JSON.stringify(activeHosp));
          }

          if (me.available_facilities && Array.isArray(me.available_facilities)) {
            const mappedFacs: Hospital[] = me.available_facilities.map((f: any) => ({
              id: f.id,
              name: f.name,
              code: f.code,
              slug: f.slug,
              email: f.email || me.email,
              phone: f.phone || "",
              address_line: f.address_line1 || "",
              city: f.city || "",
              state: f.state || "",
              pincode: f.postal_code || "",
              subscription_tier: "GROWTH",
              subscription_status: "ACTIVE",
              max_beds: 100,
              is_main_branch: false,
            }));
            setAvailableHospitals(mappedFacs);
          }
        }
      } catch (err: any) {
        if (err?.status === 401) {
          clearStoredAuth();
          if (typeof window !== "undefined") {
            localStorage.removeItem("raftracare_user_profile");
            localStorage.removeItem("raftracare_hospital_profile");
          }
          setUser(null);
          setToken(null);
          setHospital(null);
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    restoreSession();

    // Listen for global unauthorized events (e.g. from apiClient on expired token)
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("raftracare:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("raftracare:unauthorized", handleUnauthorized);
    };
  }, [restoreSession]);

  const login = async (
    email: string,
    password: string,
    hospitalSlug?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Production Auth: strictly validated server-side
      const res = await authApi.login({
        email,
        password,
        hospital_slug: hospitalSlug,
      });

      if (!res.tokens?.access_token || !res.user) {
        throw new Error("Invalid authentication response received from server");
      }

      const accessToken = res.tokens.access_token;
      const refreshToken = res.tokens.refresh_token;

      const userObj: User = {
        id: res.user.id,
        email: res.user.email,
        first_name: res.user.first_name,
        last_name: res.user.last_name,
        role: res.user.role,
        hospital_id: res.user.hospital_id || "",
        is_active: true,
      };

      const activeHosp: Hospital = {
        id: res.user.hospital_id || `hosp_${res.user.id.slice(0, 8)}`,
        name: res.user.hospital_name || "Primary Medical Facility",
        code: "HOSP",
        slug: res.user.hospital_slug || hospitalSlug || "primary-facility",
        email: res.user.email,
        phone: "+91 98765 43210",
        address_line: "Healthcare Complex",
        city: "Metropolitan",
        state: "State",
        pincode: "110001",
        subscription_tier: "GROWTH",
        subscription_status: "ACTIVE",
        max_beds: 200,
        is_main_branch: true,
      };

      setStoredTokens(accessToken, refreshToken, userObj.hospital_id);
      if (typeof window !== "undefined") {
        localStorage.setItem("raftracare_user_profile", JSON.stringify(userObj));
        localStorage.setItem("raftracare_hospital_profile", JSON.stringify(activeHosp));
      }

      setToken(accessToken);
      setUser(userObj);
      setHospital(activeHosp);
      setAvailableHospitals([activeHosp]);

      // Fetch all facilities authorized for this user
      try {
        const facs = await authApi.getFacilities();
        if (facs && Array.isArray(facs) && facs.length > 0) {
          const mapped: Hospital[] = facs.map((f: any) => ({
            id: f.id,
            name: f.name,
            code: f.code,
            slug: f.slug,
            email: f.email || userObj.email,
            phone: f.phone || "",
            address_line: "",
            city: f.city || "",
            state: f.state || "",
            pincode: "",
            subscription_tier: "GROWTH",
            subscription_status: "ACTIVE",
            max_beds: 100,
            is_main_branch: false,
          }));
          setAvailableHospitals(mapped);
        }
      } catch {}

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {}

    clearStoredAuth();
    if (typeof window !== "undefined") {
      localStorage.removeItem("raftracare_user_profile");
      localStorage.removeItem("raftracare_hospital_profile");
    }
    setUser(null);
    setHospital(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const switchHospital = async (hospitalId: string): Promise<boolean> => {
    try {
      const res = await authApi.switchHospital(hospitalId);
      if (res && res.tokens?.access_token) {
        setStoredTokens(res.tokens.access_token, res.tokens.refresh_token, hospitalId);
        setToken(res.tokens.access_token);

        if (res.hospital) {
          const updatedHosp: Hospital = {
            id: res.hospital.id,
            name: res.hospital.name,
            code: res.hospital.code,
            slug: res.hospital.slug,
            email: user?.email || "",
            phone: "",
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            subscription_tier: "GROWTH",
            subscription_status: "ACTIVE",
            max_beds: 100,
            is_main_branch: false,
          };
          setHospital(updatedHosp);
          if (typeof window !== "undefined") {
            localStorage.setItem("raftracare_hospital_profile", JSON.stringify(updatedHosp));
          }
        }

        if (user && res.role) {
          const updatedUser: User = {
            ...user,
            role: res.role,
            hospital_id: hospitalId,
          };
          setUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("raftracare_user_profile", JSON.stringify(updatedUser));
          }
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("raftracare:hospital_changed", { detail: { hospitalId } })
          );
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to switch facility context:", err);
      return false;
    }
  };

  const addHospital = (newFacility: Partial<Hospital>): Hospital => {
    const created: Hospital = {
      id: newFacility.id || `hosp_${Date.now()}`,
      name: newFacility.name || "New Facility",
      code: newFacility.code || "HOSP",
      slug: newFacility.slug || "new-facility",
      email: newFacility.email || "",
      phone: newFacility.phone || "",
      address_line: newFacility.address_line || "",
      city: newFacility.city || "",
      state: newFacility.state || "",
      pincode: newFacility.pincode || "",
      subscription_tier: newFacility.subscription_tier || "GROWTH",
      subscription_status: newFacility.subscription_status || "ACTIVE",
      max_beds: newFacility.max_beds || 100,
      organization_id: newFacility.organization_id,
      organization_name: newFacility.organization_name,
      branch_name: newFacility.branch_name,
      is_main_branch: newFacility.is_main_branch ?? false,
    };
    setAvailableHospitals((prev) => [...prev, created]);
    setHospital(created);
    return created;
  };

  const hasRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      return roles.includes(user.role);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      const userPerms = ROLE_PERMISSIONS[user.role] || [];
      if (userPerms.includes("*")) return true;
      return userPerms.includes(permission);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        hospital,
        availableHospitals,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        switchHospital,
        addHospital,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
