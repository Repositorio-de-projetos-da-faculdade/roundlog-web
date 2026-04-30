"use client";

import type { WardDashboard as WardDashboardData } from "@/lib/types";
import { BedCard } from "./BedCard";
import type { Bed } from "@/lib/types";

interface WardDashboardProps {
  data: WardDashboardData;
  onBedClick?: (bed: Bed) => void;
}

export function WardDashboard({ data, onBedClick }: WardDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pacientes</p>
          <p className="text-2xl font-bold">{data.stats.totalPatients}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Condutas Pendentes</p>
          <p className="text-2xl font-bold">{data.stats.pendingConducts}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Alertas Críticos</p>
          <p className="text-2xl font-bold text-red-500">
            {data.stats.criticalAlerts}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Visitas Hoje</p>
          <p className="text-2xl font-bold">{data.stats.visitsToday}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Taxa de Execução</p>
          <p className="text-2xl font-bold">
            {Math.round(data.stats.executionRate)}%
          </p>
        </div>
      </div>

      {/* Bed Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Leitos</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.beds.map((bed) => (
            <BedCard key={bed.id} bed={bed} onClick={onBedClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
