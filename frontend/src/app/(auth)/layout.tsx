import React from "react";
import { Logo } from "@/components/ui/Logo";
import { AuthWorkflowVisual } from "@/components/auth/AuthWorkflowVisual";
import { Shield, Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background dark:bg-background-dark">
      {/* Left Column: Premium Healthcare SaaS Visual & Real Patient Journey */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#173B73] via-[#0F284E] to-[#0A1A33] p-10 text-white flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 inline-flex items-center shadow-lg">
            <Logo size="md" subtitle="Hospital Operations Platform" href="/" />
          </div>
        </div>

        {/* Center: Live Hospital Workflow Visualization */}
        <div className="relative z-10 my-auto py-6">
          <AuthWorkflowVisual />
        </div>

        {/* Bottom Trust & Compliance Footer */}
        <div className="relative z-10 text-xs text-blue-200/75 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Role-Based Access Control
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              256-Bit TLS Encryption
            </span>
          </div>
          <span>Audit-Ready Architecture</span>
        </div>
      </div>

      {/* Right Column: Clean Responsive Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
