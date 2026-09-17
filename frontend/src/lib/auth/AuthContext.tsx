"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Hospital, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  hospital: Hospital | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, roleOverride?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const DEFAULT_HOSPITAL: Hospital = {
  id: "hosp_metro_01",
  name: "Metro General Hospital",
  code: "MGH",
  slug: "metro-general",
  email: "admin@metrogeneral.org",
  phone: "+91 98765 43210",
  address_line: "Plot 42, Healthcare Avenue, Sector 18",
  city: "Gurugram",
  state: "Haryana",
  pincode: "122002",
  subscription_tier: "GROWTH",
  subscription_status: "ACTIVE",
  max_beds: 240,
};

const DEFAULT_USERS_BY_ROLE: Record<UserRole, User> = {
  SUPER_ADMIN: {
    id: "usr_super_01",
    email: "superadmin@hospitalos.io",
    first_name: "Vikram",
    last_name: "Mehta",
    role: "SUPER_ADMIN",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  HOSPITAL_ADMIN: {
    id: "usr_admin_01",
    email: "admin@metrogeneral.org",
    first_name: "Dr. Arvind",
    last_name: "Srivastava",
    role: "HOSPITAL_ADMIN",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  DOCTOR: {
    id: "usr_doc_01",
    email: "dr.sharma@metrogeneral.org",
    first_name: "Dr. Rajesh",
    last_name: "Sharma",
    role: "DOCTOR",
    hospital_id: "hosp_metro_01",
    department_id: "dept_cardio_01",
    is_active: true,
  },
  NURSE: {
    id: "usr_nurse_01",
    email: "ananya.nurse@metrogeneral.org",
    first_name: "Ananya",
    last_name: "Iyer",
    role: "NURSE",
    hospital_id: "hosp_metro_01",
    department_id: "dept_gen_ward",
    is_active: true,
  },
  RECEPTIONIST: {
    id: "usr_front_01",
    email: "priya.frontdesk@metrogeneral.org",
    first_name: "Priya",
    last_name: "Verma",
    role: "RECEPTIONIST",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  PHARMACIST: {
    id: "usr_pharm_01",
    email: "sunil.pharm@metrogeneral.org",
    first_name: "Sunil",
    last_name: "Nair",
    role: "PHARMACIST",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  LAB_TECHNICIAN: {
    id: "usr_lab_01",
    email: "manoj.lab@metrogeneral.org",
    first_name: "Manoj",
    last_name: "Patel",
    role: "LAB_TECHNICIAN",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  ACCOUNTANT: {
    id: "usr_acc_01",
    email: "deepak.accounts@metrogeneral.org",
    first_name: "Deepak",
    last_name: "Jain",
    role: "ACCOUNTANT",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
  PATIENT: {
    id: "usr_patient_01",
    email: "raj.kumar@example.com",
    first_name: "Raj",
    last_name: "Kumar",
    role: "PATIENT",
    hospital_id: "hosp_metro_01",
    is_active: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(DEFAULT_HOSPITAL);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on boot
    const storedUser = localStorage.getItem("hospitalos-user");
    const storedToken = localStorage.getItem("hospitalos-token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // Fallback default admin
        setUser(DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN);
        setToken("mock_jwt_token_hospital_admin");
      }
    } else {
      // Default to Hospital Admin for seamless instant workspace access
      const defaultUser = DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN;
      setUser(defaultUser);
      setToken("mock_jwt_token_hospital_admin");
      localStorage.setItem("hospitalos-user", JSON.stringify(defaultUser));
      localStorage.setItem("hospitalos-token", "mock_jwt_token_hospital_admin");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string, roleOverride?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Smooth realistic latency

    const targetRole = roleOverride || "HOSPITAL_ADMIN";
    const loggedUser = DEFAULT_USERS_BY_ROLE[targetRole] || DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN;
    
    // Customize email if user typed one
    const userToSave = { ...loggedUser, email: email || loggedUser.email };
    const mockToken = `jwt_token_${targetRole.toLowerCase()}_${Date.now()}`;

    setUser(userToSave);
    setToken(mockToken);
    localStorage.setItem("hospitalos-user", JSON.stringify(userToSave));
    localStorage.setItem("hospitalos-token", mockToken);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hospitalos-user");
    localStorage.removeItem("hospitalos-token");
  };

  const switchRole = (newRole: UserRole) => {
    const newUser = DEFAULT_USERS_BY_ROLE[newRole];
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("hospitalos-user", JSON.stringify(newUser));
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === "SUPER_ADMIN" || user.role === "HOSPITAL_ADMIN") return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        hospital,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
