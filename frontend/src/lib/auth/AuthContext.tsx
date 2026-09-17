"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Hospital, UserRole } from "@/types";

export interface AuthContextType {
  user: User | null;
  hospital: Hospital | null;
  availableHospitals: Hospital[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, roleOverride?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  switchHospital: (hospitalId: string) => void;
  addHospital: (newFacility: Partial<Hospital>) => Hospital;
  hasRole: (roles: UserRole[]) => boolean;
}

export const DEFAULT_HOSPITALS: Hospital[] = [
  {
    id: "hosp_metro_01",
    name: "Metro General Hospital",
    branch_name: "Downtown Main Campus (Flagship)",
    organization_id: "org_metro",
    organization_name: "Metro Health Systems",
    code: "MGH-DT",
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
    is_main_branch: true,
    total_branches: 2,
  },
  {
    id: "hosp_metro_02",
    name: "Metro Care Clinic",
    branch_name: "West Wing Outpatient Center",
    organization_id: "org_metro",
    organization_name: "Metro Health Systems",
    code: "MGH-WW",
    slug: "metro-care-west",
    email: "westwing@metrogeneral.org",
    phone: "+91 98765 43211",
    address_line: "Ground Floor, City Galleria, Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122009",
    subscription_tier: "GROWTH",
    subscription_status: "ACTIVE",
    max_beds: 45,
    is_main_branch: false,
    total_branches: 2,
  },
  {
    id: "hosp_apex_01",
    name: "Apex Super Speciality Hospital",
    branch_name: "South Extension Flagship",
    organization_id: "org_apex",
    organization_name: "Apex Healthcare Group",
    code: "ASSH-DEL",
    slug: "apex-south-delhi",
    email: "contact@apexhealthcare.in",
    phone: "+91 11 4987 6543",
    address_line: "Ring Road, South Extension Part II",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110049",
    subscription_tier: "ENTERPRISE",
    subscription_status: "ACTIVE",
    max_beds: 450,
    is_main_branch: true,
    total_branches: 1,
  },
];

const DEFAULT_USERS_BY_ROLE: Record<UserRole, User> = {
  SUPER_ADMIN: {
    id: "usr_super_01",
    email: "superadmin@raftracare.io",
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
  const [availableHospitals, setAvailableHospitals] = useState<Hospital[]>(DEFAULT_HOSPITALS);
  const [hospital, setHospital] = useState<Hospital | null>(DEFAULT_HOSPITALS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on boot
    const isLoggedOut = localStorage.getItem("raftracare-logged-out") === "true";
    const storedUser = localStorage.getItem("raftracare-user") || localStorage.getItem("hospitalos-user");
    const storedToken = localStorage.getItem("raftracare-token") || localStorage.getItem("hospitalos-token");
    const storedHospitalId = localStorage.getItem("raftracare-active-hospital-id");

    // Load saved hospitals or default
    const savedHospitals = localStorage.getItem("raftracare-hospitals");
    let allHospitals = DEFAULT_HOSPITALS;
    if (savedHospitals) {
      try {
        allHospitals = JSON.parse(savedHospitals);
        setAvailableHospitals(allHospitals);
      } catch {
        // use defaults
      }
    }

    if (storedHospitalId) {
      const matched = allHospitals.find((h) => h.id === storedHospitalId);
      if (matched) setHospital(matched);
    }

    if (isLoggedOut) {
      setUser(null);
      setToken(null);
    } else if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        const defaultUser = DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN;
        setUser(defaultUser);
        setToken("mock_jwt_token_hospital_admin");
      }
    } else {
      // Default initial session for immediate exploration
      const defaultUser = DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN;
      setUser(defaultUser);
      setToken("mock_jwt_token_hospital_admin");
      localStorage.setItem("raftracare-user", JSON.stringify(defaultUser));
      localStorage.setItem("raftracare-token", "mock_jwt_token_hospital_admin");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string, roleOverride?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Smooth realistic latency

    localStorage.removeItem("raftracare-logged-out");

    const targetRole = roleOverride || "HOSPITAL_ADMIN";
    const loggedUser = DEFAULT_USERS_BY_ROLE[targetRole] || DEFAULT_USERS_BY_ROLE.HOSPITAL_ADMIN;
    
    // Customize email if user typed one
    const userToSave = { ...loggedUser, email: email || loggedUser.email };
    const mockToken = `jwt_token_${targetRole.toLowerCase()}_${Date.now()}`;

    setUser(userToSave);
    setToken(mockToken);
    localStorage.setItem("raftracare-user", JSON.stringify(userToSave));
    localStorage.setItem("raftracare-token", mockToken);
    localStorage.setItem("hospitalos-user", JSON.stringify(userToSave));
    localStorage.setItem("hospitalos-token", mockToken);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("raftracare-logged-out", "true");
    localStorage.removeItem("raftracare-user");
    localStorage.removeItem("raftracare-token");
    localStorage.removeItem("hospitalos-user");
    localStorage.removeItem("hospitalos-token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const switchRole = (newRole: UserRole) => {
    const newUser = DEFAULT_USERS_BY_ROLE[newRole];
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("raftracare-user", JSON.stringify(newUser));
      localStorage.setItem("hospitalos-user", JSON.stringify(newUser));
    }
  };

  const switchHospital = (hospitalId: string) => {
    const target = availableHospitals.find((h) => h.id === hospitalId);
    if (target) {
      setHospital(target);
      localStorage.setItem("raftracare-active-hospital-id", target.id);
    }
  };

  const addHospital = (newFacility: Partial<Hospital>): Hospital => {
    const generatedId = `hosp_${Date.now()}`;
    const facility: Hospital = {
      id: generatedId,
      name: newFacility.name || "New Hospital Facility",
      branch_name: newFacility.branch_name || "Main Branch",
      organization_id: newFacility.organization_id || "org_custom",
      organization_name: newFacility.organization_name || newFacility.name || "Independent Health Org",
      code: newFacility.code || `FAC-${Math.floor(100 + Math.random() * 900)}`,
      slug: (newFacility.name || "new-facility").toLowerCase().replace(/\s+/g, "-"),
      email: newFacility.email || "info@hospital.org",
      phone: newFacility.phone || "+91 90000 00000",
      address_line: newFacility.address_line || "Healthcare District",
      city: newFacility.city || "New Delhi",
      state: newFacility.state || "Delhi",
      pincode: newFacility.pincode || "110001",
      subscription_tier: (newFacility.subscription_tier as any) || "GROWTH",
      subscription_status: "ACTIVE",
      max_beds: newFacility.max_beds || 100,
      is_main_branch: false,
      total_branches: 1,
    };

    const updated = [...availableHospitals, facility];
    setAvailableHospitals(updated);
    setHospital(facility);
    localStorage.setItem("raftracare-hospitals", JSON.stringify(updated));
    localStorage.setItem("raftracare-active-hospital-id", facility.id);
    return facility;
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
        availableHospitals,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        switchHospital,
        addHospital,
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
