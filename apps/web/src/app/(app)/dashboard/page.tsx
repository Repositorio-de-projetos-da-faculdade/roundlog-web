"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { getMyHospital } from "@/lib/api/hospital";
import { getComplianceMetrics, getHandoffMetrics } from "@/lib/api/analytics";
import { getOverdueConducts } from "@/lib/api/nursing";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, ClipboardCheck, BedDouble, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const hospital = useQuery({ queryKey: ["hospital"], queryFn: getMyHospital });
  const compliance = useQuery({
    queryKey: ["compliance"],
    queryFn: () => getComplianceMetrics(),
  });
  const handoffs = useQuery({
    queryKey: ["handoff-metrics"],
    queryFn: () => getHandoffMetrics(),
  });
  const overdue = useQuery({
    queryKey: ["overdue"],
    queryFn: getOverdueConducts,
    refetchInterval: 60_000,
  });

  return (
    <PageShell
      title={hospital.data?.name ?? "Dashboard"}
      description="Visão geral das atividades clínicas do seu hospital"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Condutas Resolvidas"
          icon={<ClipboardCheck className="h-4 w-4" />}
          value={
            compliance.isLoading ? null : `${compliance.data?.complianceRate.toFixed(0) ?? 0}%`
          }
          hint={
            compliance.data
              ? `${compliance.data.resolvedConducts}/${compliance.data.totalConducts}`
              : undefined
          }
        />
        <StatCard
          label="Plantões com Ciência"
          icon={<Activity className="h-4 w-4" />}
          value={handoffs.isLoading ? null : `${handoffs.data?.ackRate.toFixed(0) ?? 0}%`}
          hint={
            handoffs.data
              ? `${handoffs.data.acknowledgedHandoffs}/${handoffs.data.totalHandoffs}`
              : undefined
          }
        />
        <StatCard
          label="Condutas em Atraso"
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={overdue.data && overdue.data.length > 0 ? "text-red-500" : undefined}
          value={overdue.isLoading ? null : String(overdue.data?.length ?? 0)}
        />
        <StatCard
          label="Alas Ativas"
          icon={<BedDouble className="h-4 w-4" />}
          value={hospital.isLoading ? null : String(hospital.data?.wards.length ?? 0)}
        />
      </div>

      <section className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Alas</h2>
          <Link href="/wards" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {hospital.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="grid gap-2">
            {hospital.data?.wards.map((w) => (
              <Link
                key={w.id}
                href={`/wards/${w.id}`}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition"
              >
                <div>
                  <p className="font-medium">{w.name}</p>
                  {w.specialty && (
                    <p className="text-xs text-muted-foreground">{w.specialty}</p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {overdue.data && overdue.data.length > 0 && (
        <section className="rounded-lg border border-red-200 bg-red-50/40 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Condutas em atraso ({overdue.data.length})
          </h2>
          <div className="mt-3 space-y-2">
            {overdue.data.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded border bg-card p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{c.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.visit.admission.patient.name} · Leito {c.visit.admission.bed.code}
                  </p>
                </div>
                <p className="text-xs text-red-600">
                  Prazo: {c.deadlineAt && new Date(c.deadlineAt).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
            {overdue.data.length > 5 && (
              <p className="text-xs text-muted-foreground">
                + {overdue.data.length - 5} outras
              </p>
            )}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function StatCard({
  label,
  icon,
  value,
  hint,
  accent,
}: {
  label: string;
  icon: React.ReactNode;
  value: string | null;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="text-sm">{label}</p>
        {icon}
      </div>
      {value === null ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <p className={`mt-2 text-3xl font-bold ${accent ?? ""}`}>{value}</p>
      )}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
