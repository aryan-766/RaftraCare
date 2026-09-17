"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Logo } from "@/components/ui/Logo";

export default function DemoLauncherPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    async function launchDemo() {
      // Clear any previous logged-out flags
      if (typeof window !== "undefined") {
        localStorage.removeItem("raftracare-logged-out");
      }
      // Authenticate directly into live hospital workspace as Admin
      await login("admin@metrogeneral.org", "password123", "HOSPITAL_ADMIN");
      router.push("/dashboard");
    }

    launchDemo();
  }, [login, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background-dark p-4">
      <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark shadow-xl text-center space-y-4 max-w-sm w-full animate-in zoom-in-95">
        <Logo size="lg" subtitle="Live Hospital Environment" />
        <div className="pt-4 space-y-2">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-bold text-sm text-foreground dark:text-foreground-dark">
            Launching Live Workspace
          </h3>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark">
            Connecting clinical workstations, inpatient beds, and live queue displays...
          </p>
        </div>
      </div>
    </div>
  );
}
