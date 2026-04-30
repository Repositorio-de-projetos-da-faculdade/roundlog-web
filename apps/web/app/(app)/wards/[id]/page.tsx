"use client";

import { useParams } from "next/navigation";
import { useWardDashboard } from "@/lib/hooks/useWardDashboard";
import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/skeleton";

export default function WardDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useWardDashboard(params.id);

  if (isLoading) {
    return (
      <PageShell title="Ala">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell title="Ala">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          Erro ao carregar dashboard da ala.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={data.ward.name}
      description={`${data.stats.totalPatients} pacientes · Turno: ${data.currentShift}`}
    >
      {/* TODO: Renderizar WardDashboard, BedCard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          BedCards serão renderizados aqui.
        </div>
      </div>
    </PageShell>
  );
}
