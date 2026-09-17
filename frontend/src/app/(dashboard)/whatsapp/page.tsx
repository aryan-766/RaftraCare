"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function CommunicationsPage() {
  const { success } = useToast();

  const messages = [
    {
      patient: "Raj Kumar (HOS-001284)",
      channel: "WhatsApp Business API",
      message: "Dear Raj, your appointment with Dr. Rajesh Sharma (Cardiology) is confirmed for today at 09:00 AM (Token A-102).",
      status: "DELIVERED",
      time: "08:15 AM",
    },
    {
      patient: "Neha Singh (HOS-001285)",
      channel: "SMS Gateway",
      message: "Metro General Hospital: Your knee X-Ray investigation report is ready to view on the patient portal.",
      status: "SENT",
      time: "10:12 AM",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> WhatsApp & SMS Patient Communication
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Automated appointment reminders, lab report delivery, OTPs, and teleconsultation links
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => success("Broadcast Dispatched", "Patient OPD alert broadcast triggered.")}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Send Bulk Notification
        </Button>
      </div>

      <div className="space-y-3">
        {messages.map((m, idx) => (
          <Card key={idx} className="p-4 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground dark:text-foreground-dark">{m.patient}</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-primary">
                  {m.channel}
                </span>
              </div>
              <p className="text-foreground-muted dark:text-foreground-mutedDark">{m.message}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {m.status}
              </span>
              <div className="text-[10px] text-foreground-muted mt-1 font-mono">{m.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
