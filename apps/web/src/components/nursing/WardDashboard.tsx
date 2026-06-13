"use client";

import type { DashboardBed } from "@/lib/types";
import { BedCard } from "./BedCard";

interface WardDashboardProps {
  wardId: string;
  beds: DashboardBed[];
  onOpenAdmission?: (bed: DashboardBed) => void;
}

/**
 * Dashboard de uma ala. Recebe o array de leitos do endpoint
 * /wards/:id/dashboard e calcula stats agregados na hora.
 */
export function WardDashboard({ wardId, beds, onOpenAdmission }: WardDashboardProps) {
  const totalPatients = beds.reduce((acc, b) => acc + b.admissions.length, 0);
  const allOpenConducts = beds.flatMap((b) =>
    b.admissions.flatMap((a) => a.visits.flatMap((v) => v.conducts)),
  );
  const allOpenAlerts = beds.flatMap((b) =>
    b.admissions.flatMap((a) => a.visits.flatMap((v) => v.alerts)),
  );
  const criticalAlerts = allOpenAlerts.filter(
    (a) => a.severity.toLowerCase() === "critical",
  ).length;
  const todayISO = new Date().toISOString().slice(0, 10);
  const visitsToday = beds.reduce(
    (acc, b) =>
      acc +
      b.admissions.reduce(
        (s, a) => s + a.visits.filter((v) => v.startedAt.startsWith(todayISO)).length,
        0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Pacientes" value={totalPatients} />
        <StatCard label="Condutas Abertas" value={allOpenConducts.length} />
        <StatCard label="Alertas Críticos" value={criticalAlerts} accent="text-red-500" />
        <StatCard label="Visitas Hoje" value={visitsToday} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Leitos</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {beds.map((bed) => (
            <BedCard
              key={bed.id}
              bed={bed}
              wardId={wardId}
              onOpenAdmission={onOpenAdmission}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
