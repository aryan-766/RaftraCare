"use client";

import React, { useState } from "react";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { MOCK_QUEUE } from "@/lib/mock/data";
import { QueueToken } from "@/types";
import { Volume2, ChevronRight, SkipForward, CheckCircle, Clock } from "lucide-react";

export default function QueuePage() {
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [queue, setQueue] = useState<QueueToken[]>(MOCK_QUEUE);
  const { success } = useToast();

  const deptTokens = queue.filter(
    (q) => selectedDept === "ALL" || q.department_name === selectedDept
  );

  const nowServing = deptTokens.find(
    (q) => q.status === "IN_CONSULTATION" || q.status === "CALLED"
  ) || deptTokens[0];

  const upNextTokens = deptTokens.filter(
    (q) => q.id !== nowServing?.id && q.status === "WAITING"
  );

  const updateStatus = (tokenId: string, status: QueueToken["status"], patientName: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === tokenId ? { ...item, status } : item))
    );
    success("Queue Transition", `${patientName} (${status})`);
  };

  const columns: Column<QueueToken>[] = [
    {
      header: "Token",
      render: (q) => (
        <span className="font-mono font-bold text-xs bg-blue-50 dark:bg-blue-950 text-primary px-2 py-0.5 rounded">
          {q.token_number}
        </span>
      ),
      sortable: true,
      accessorKey: "token_number",
    },
    {
      header: "Patient Name",
      render: (q) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {q.patient_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark">
            {q.patient_age} yrs · {q.patient_gender} · UHID: {q.patient_uhid}
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: "patient_name",
    },
    {
      header: "Doctor / Room",
      render: (q) => (
        <div>
          <div className="font-medium text-foreground dark:text-foreground-dark">
            {q.doctor_name}
          </div>
          <div className="text-[11px] text-foreground-muted dark:text-foreground-mutedDark font-mono">
            {q.room_number}
          </div>
        </div>
      ),
    },
    {
      header: "Priority",
      render: (q) => (
        <Badge variant={q.priority === "URGENT" ? "danger" : "default"}>
          {q.priority}
        </Badge>
      ),
    },
    {
      header: "Check-in",
      accessorKey: "checked_in_at",
      className: "font-mono text-xs",
    },
    {
      header: "Est. Wait",
      render: (q) => (
        <span className="font-medium">
          {q.estimated_wait_minutes > 0 ? `${q.estimated_wait_minutes} mins` : "Now"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (q) => <StatusBadge status={q.status} />,
    },
    {
      header: "Quick Actions",
      render: (q) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {q.status === "WAITING" && (
            <Button
              size="sm"
              variant="soft"
              onClick={() => updateStatus(q.id, "CALLED", q.patient_name)}
            >
              Call
            </Button>
          )}
          {q.status === "CALLED" && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => updateStatus(q.id, "IN_CONSULTATION", q.patient_name)}
            >
              Start
            </Button>
          )}
          {q.status === "IN_CONSULTATION" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus(q.id, "COMPLETED", q.patient_name)}
            >
              Finish
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateStatus(q.id, "SKIPPED", q.patient_name)}
          >
            Skip
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 dark:border-border-dark pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark">
            Queue & Token Caller
          </h1>
          <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
            Real-time OPD token announcement display and consulting room triage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 text-xs w-48 font-semibold"
          >
            <option value="Cardiology">Cardiology OPD</option>
            <option value="Orthopedics">Orthopedics OPD</option>
            <option value="General Medicine">General Medicine</option>
            <option value="ALL">All Departments</option>
          </Select>
        </div>
      </div>

      {/* Real-time Display Board (Like a hospital TV display) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Now Serving Highlight Card */}
        <Card className="p-6 md:col-span-2 bg-gradient-to-br from-white to-blue-50/40 dark:from-surface-dark dark:to-blue-950/20 border-2 border-primary/40 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 animate-pulse" /> Now Serving
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-border dark:border-border-dark font-mono">
              {nowServing?.room_number || "Room 204"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-5xl font-extrabold font-mono text-primary dark:text-blue-400 tracking-tight">
                {nowServing?.token_number || "A-102"}
              </div>
              <div className="text-base font-bold text-foreground dark:text-foreground-dark mt-1">
                {nowServing?.patient_name || "Raj Kumar"}
              </div>
              <div className="text-xs text-foreground-muted dark:text-foreground-mutedDark">
                UHID: {nowServing?.patient_uhid} · {nowServing?.doctor_name}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 sm:pt-0">
              <Button
                variant="primary"
                onClick={() => {
                  success("Voice Announcement Triggered", `Token ${nowServing?.token_number} called to ${nowServing?.room_number}`);
                }}
                leftIcon={<Volume2 className="w-4 h-4" />}
              >
                Announce Token
              </Button>
              <Button
                variant="soft"
                onClick={() => {
                  if (nowServing) updateStatus(nowServing.id, "COMPLETED", nowServing.patient_name);
                }}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Done
              </Button>
            </div>
          </div>
        </Card>

        {/* Up Next Queue Preview */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border dark:border-border-dark pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted dark:text-foreground-mutedDark">
              Up Next
            </span>
            <span className="text-xs font-semibold text-primary">
              {upNextTokens.length} waiting
            </span>
          </div>

          <div className="space-y-2">
            {upNextTokens.slice(0, 3).map((token) => (
              <div
                key={token.id}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-border/70 dark:border-border-dark flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-sm text-foreground dark:text-foreground-dark">
                    {token.token_number}
                  </div>
                  <div className="text-xs text-foreground-muted dark:text-foreground-mutedDark truncate max-w-[140px]">
                    {token.patient_name}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-foreground-muted">
                  ~{token.estimated_wait_minutes}m wait
                </span>
              </div>
            ))}
            {upNextTokens.length === 0 && (
              <div className="text-xs text-foreground-muted text-center py-6">
                No more waiting tokens in this queue.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Queue Table */}
      <Table
        data={deptTokens}
        columns={columns}
        keyExtractor={(q) => q.id}
        pageSize={8}
        searchPlaceholder="Filter tokens by patient or token number..."
      />
    </div>
  );
}
