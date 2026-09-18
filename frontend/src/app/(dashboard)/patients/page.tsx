"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Table, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { patientsApi, PatientListItem } from "@/lib/api/patients";
import { UserPlus, RotateCw, AlertCircle, ArrowRight, Search } from "lucide-react";

export default function PatientsDirectoryPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPatients = useCallback(async (search?: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const list = await patientsApi.list({ search, limit: 50 });
      setPatients(list);
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Failed to connect to patient records server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPatients(searchQuery.trim() || undefined);
  };

  const columns: Column<PatientListItem>[] = [
    {
      header: "UHID",
      render: (p) => (
        <span className="font-mono font-bold text-primary dark:text-blue-400">
          {p.uhid}
        </span>
      ),
      sortable: true,
      accessorKey: "uhid",
    },
    {
      header: "Patient Name",
      render: (p) => (
        <div>
          <div className="font-semibold text-foreground dark:text-foreground-dark">
            {p.name}
          </div>
          <div className="text-[11px] text-foreground-muted">
            {p.gender} · {p.blood_group || "—"}
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: "name",
    },
    {
      header: "Contact",
      render: (p) => (
        <div className="text-foreground text-xs">
          <div>{p.phone || "—"}</div>
          <div className="text-[11px] text-foreground-muted">
            DOB: {p.date_of_birth}
          </div>
        </div>
      ),
    },
    {
      header: "Action",
      render: (p) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/patients/${p.id}`)}
          className="flex items-center gap-1 text-xs"
        >
          <span>Patient 360°</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Patients Master Directory
          </h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            Longitudinal patient database, verified UHID registry, and clinical history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPatients(searchQuery)}
            isLoading={isLoading}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => router.push("/front-desk")}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Patient</span>
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, UHID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button type="submit" size="sm" variant="primary">
          Search
        </Button>
      </form>

      {/* Main Table or Offline/Error State */}
      {isError ? (
        <Card className="p-12 text-center space-y-4 border-dashed border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Unable to load patient records</h3>
            <p className="text-xs text-foreground-muted max-w-md mx-auto">
              {errorMessage || "We couldn't connect to the hospital patient server. Please ensure the backend service is running."}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => loadPatients()} className="font-semibold">
            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
            Retry Connection
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table<PatientListItem>
            data={patients}
            columns={columns}
            keyExtractor={(p) => p.id}
            searchable={false}
            emptyTitle="No patient records found"
            emptyDescription="No patient records found in database."
          />
        </Card>
      )}
    </div>
  );
}
