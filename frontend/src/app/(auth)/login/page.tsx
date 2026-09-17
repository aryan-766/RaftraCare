"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@metrogeneral.org");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();

  const handleLogin = async (e: React.FormEvent, roleOverride?: UserRole) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide your hospital email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const ok = await login(email, password, roleOverride);
      if (ok) {
        success("Signed In", "Welcome back to HospitalOS operations.");
        router.push("/dashboard");
      }
    } catch {
      setErrorMsg("Invalid credentials. Please verify your email and password.");
      error("Authentication Failed", "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoRoles: { label: string; role: UserRole; email: string }[] = [
    { label: "Admin", role: "HOSPITAL_ADMIN", email: "admin@metrogeneral.org" },
    { label: "Doctor", role: "DOCTOR", email: "dr.sharma@metrogeneral.org" },
    { label: "Receptionist", role: "RECEPTIONIST", email: "priya.frontdesk@metrogeneral.org" },
    { label: "Nurse", role: "NURSE", email: "ananya.nurse@metrogeneral.org" },
    { label: "Pharmacist", role: "PHARMACIST", email: "sunil.pharm@metrogeneral.org" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Welcome back
        </h2>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-1">
          Enter your authorized medical facility credentials to sign in
        </p>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
        <Input
          label="Hospital Email Address *"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@hospital.org"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="space-y-1">
          <Input
            label="Security Password *"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-foreground-muted dark:text-foreground-mutedDark">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
            Remember this terminal
          </label>

          <a
            href="/forgot-password"
            className="font-semibold text-primary hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Sign In to Workspace
        </Button>
      </form>

      {/* Demo Role Fast-Switcher */}
      <div className="pt-4 border-t border-border dark:border-border-dark space-y-2">
        <div className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider text-center">
          Instant Demo Sign-in As:
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {demoRoles.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={(e) => {
                setEmail(d.email);
                handleLogin(e, d.role);
              }}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-foreground dark:text-foreground-dark hover:text-primary transition-colors border border-border/80 dark:border-border-dark"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-foreground-muted">
        Don&apos;t have a hospital registered?{" "}
        <a href="/signup" className="font-bold text-primary hover:underline">
          Register Organization →
        </a>
      </div>
    </div>
  );
}
