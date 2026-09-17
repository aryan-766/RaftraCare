"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    success("Recovery Link Dispatched", `Password reset instructions sent to ${email}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </a>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
          Reset Password
        </h2>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-1">
          Enter your registered hospital email to receive password recovery instructions
        </p>
      </div>

      {sent ? (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Check Your Inbox
          </div>
          <p>
            We have sent a time-sensitive password reset link to <strong>{email}</strong>. Please
            check your email and click the link to proceed.
          </p>
          <a
            href="/reset-password"
            className="inline-block pt-2 font-bold text-primary underline"
          >
            Simulate Reset Link Click →
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Hospital Email Address *"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@hospital.org"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Button type="submit" size="lg" className="w-full mt-2">
            Send Reset Instructions
          </Button>
        </form>
      )}
    </div>
  );
}
