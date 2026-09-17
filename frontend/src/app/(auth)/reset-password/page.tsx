"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { success } = useToast();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    success("Password Updated", "Your password has been changed. Please sign in.");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Choose New Password
        </h2>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-1">
          Set a secure alphanumeric password for your HospitalOS account
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded bg-red-50 text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4 text-xs">
        <Input
          label="New Password *"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Input
          label="Confirm New Password *"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Button type="submit" size="lg" className="w-full mt-2">
          Update Password & Login
        </Button>
      </form>
    </div>
  );
}
