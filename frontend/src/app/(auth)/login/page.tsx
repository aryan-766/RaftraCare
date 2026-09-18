"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      setErrorMsg("Your session has expired. Please sign in again to continue.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      success("Authenticated", "Signed in successfully. Loading hospital workspace...");
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err.status === 401) {
        setErrorMsg("Invalid credentials. Please verify your email and password.");
      } else if (err.status === 0 || err.code === "NETWORK_ERROR") {
        setErrorMsg("Unable to connect to hospital server. Please verify backend service availability.");
      } else {
        setErrorMsg(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Logo */}
      <div className="lg:hidden flex justify-center mb-6">
        <Logo size="md" subtitle="Operations Platform" href="/" />
      </div>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-primary border border-blue-200 dark:border-blue-800 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Hospital Operations Sign In</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Welcome back
        </h2>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-1">
          Sign in to your hospital operating workspace to manage patient care, clinical orders, and revenue.
        </p>
      </div>

      {/* Quick 1-Click Demo Accounts */}
      <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-primary dark:text-blue-400">
          <span>⚡ Fast Demo Access</span>
          <span className="text-[10px] font-normal text-foreground-muted">Tap to prefill</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail("admin@citycare.in");
              setPassword("Admin@123456");
            }}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-border dark:border-border-dark text-left hover:border-primary transition-colors text-[11px]"
          >
            <div className="font-bold text-foreground">Hospital Admin</div>
            <div className="text-slate-400 text-[10px] truncate">admin@citycare.in</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("doctor@citycare.in");
              setPassword("Doctor@123456");
            }}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-border dark:border-border-dark text-left hover:border-primary transition-colors text-[11px]"
          >
            <div className="font-bold text-foreground">Lead Doctor</div>
            <div className="text-slate-400 text-[10px] truncate">doctor@citycare.in</div>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Hospital Email Address *"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@hospital.org"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="space-y-1">
          <Input
            label="Password *"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground-muted hover:text-foreground focus:outline-none"
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
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>Remember this device</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center text-xs font-bold mt-2"
          isLoading={isLoading}
        >
          <span>Sign In to HospitalOS</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      {/* Register Organization Link */}
      <div className="pt-4 border-t border-border dark:border-border-dark text-center text-xs text-foreground-muted dark:text-foreground-mutedDark">
        <span>Need to deploy RaftraCare for a new facility? </span>
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Register Hospital
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-foreground-muted">Loading sign in...</span>
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
