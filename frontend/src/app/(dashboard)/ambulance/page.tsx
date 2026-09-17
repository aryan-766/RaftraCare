"use client";

import React from "react";
import { Card, StatCard } from "@/components/ui/Card";
import { Table, Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Ambulance as AmbulanceIcon, PhoneCall } from "lucide-react";

interface AmbulanceFleet {
  id: string;
  vehicleNo: string;
  type: "ADVANCED_LIFE_SUPPORT" | "BASIC_LIFE_SUPPORT";
  driver: string;
  driverPhone: string;
  paramedic: string;
  status: "AVAILABLE" | "DISPATCHED" | "MAINTENANCE";
  currentLocation: string;
}

export default function AmbulanceFleetPage() {
  const fleet: AmbulanceFleet[] = [
    {
      id: "amb_1",
      vehicleNo: "HR-26-EA-1008",
      type: "ADVANCED_LIFE_SUPPORT",
      driver: "Ram Kumar",
      driverPhone: "+91 98112 33441",
      paramedic: "K. Mohan (EMT-P)",
      status: "AVAILABLE",
      currentLocation: "Hospital ER Bay 1",
    },
    {
      id: "amb_2",
      vehicleNo: "HR-26-EA-1009",
      type: "BASIC_LIFE_SUPPORT",
      driver: "Satish Sharma",
      driverPhone: "+91 98112 33442",
      paramedic: "S. Rao (EMT-B)",
      status: "DISPATCHED",
      currentLocation: "En route to Sector 54, DLF Phase 5",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-border/70 dark:border-border-dark pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground-dark flex items-center gap-2">
          <AmbulanceIcon className="w-5 h-5 text-primary" /> Emergency Ambulance Fleet & Dispatch
        </h1>
        <p className="text-xs text-foreground-muted dark:text-foreground-mutedDark mt-0.5">
          24/7 Mobile ICU tracking, rapid patient transfer logistics, and EMT paramedic rosters
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total Fleet" value="4 Vehicles" subtitle="2 ALS · 2 BLS" />
        <StatCard title="Available in Bay" value="2" subtitle="Ready for immediate call" />
        <StatCard title="Active Transits" value="1" subtitle="Sector 54 SOS response" />
        <StatCard title="Avg Response Time" value="8.4 mins" subtitle="Under 10 min target" />
      </div>

      <Table
        data={fleet}
        columns={[
          { header: "Vehicle Plate", accessorKey: "vehicleNo", className: "font-mono font-bold text-xs" },
          { header: "Type", render: (f) => <Badge variant={f.type === "ADVANCED_LIFE_SUPPORT" ? "danger" : "primary"}>{f.type.replace(/_/g, " ")}</Badge> },
          { header: "Driver & Contact", render: (f) => <div><div className="font-semibold">{f.driver}</div><div className="text-[11px] text-foreground-muted">{f.driverPhone}</div></div> },
          { header: "Paramedic Lead", accessorKey: "paramedic" },
          { header: "Location", accessorKey: "currentLocation" },
          { header: "Status", render: (f) => <Badge variant={f.status === "AVAILABLE" ? "success" : "warning"}>{f.status}</Badge> },
        ]}
        keyExtractor={(f) => f.id}
        pageSize={5}
      />
    </div>
  );
}
