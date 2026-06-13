"use client";

import { useVisit } from "@/lib/hooks/useVisit";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/PageShell";
import { VisitSummary } from "@/components/visits/VisitSummary";
import { ConductCard } from "@/components/visits/ConductCard";
import { AlertCard } from "@/components/visits/AlertCard";
import { PendingCard } from "@/components/visits/PendingCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ClipboardList,
  Loader2,
  Pill,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { resolveConduct } from "@/lib/api/conducts";
import { resolvePending } from "@/lib/api/pendings";
import { acknowledgeAlert } from "@/lib/api/alerts";

export default function VisitDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: visit, isLoading } = useVisit(params.id);
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["visit", params.id] });

  const resolveConductMut = useMutation({
    mutationFn: (id: string) => resolveConduct(id),
    onSuccess: invalidate,
  });
  const resolvePendingMut = useMutation({
    mutationFn: (id: string) => resolvePending(id),
    onSuccess: invalidate,
  });
  const ackAlertMut = useMutation({
    mutationFn: (id: string) => acknowledgeAlert(id),
    onSuccess: invalidate,
  });

  if (isLoading) {
    return (
      <PageShell title="Carregando Visita...">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!visit) return <div>Visita não encontrada.</div>;

  const isProcessing = visit.status === "PROCESSING" || visit.status === "RECORDING";
  const patientName = visit.admission?.patient?.name;

  return (
    <PageShell
      title={`Visita Médica — ${new Date(visit.startedAt).toLocaleString("pt-BR")}`}
      description={patientName ? `Paciente: ${patientName}` : undefined}
      actions={
        <Badge
          variant={isProcessing ? "outline" : visit.status === "ERROR" ? "destructive" : "default"}
          className={isProcessing ? "animate-pulse" : ""}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processando IA
            </>
          ) : visit.status === "ERROR" ? (
            "Erro"
          ) : (
            "Finalizada"
          )}
        </Badge>
      }
    >
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Resumo</h2>
          </div>
          <VisitSummary visit={visit} />
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold">Condutas</h2>
            </div>
            <div className="space-y-3">
              {visit.conducts.map((c) => (
                <ConductCard
                  key={c.id}
                  conduct={c}
                  onResolve={(id) => resolveConductMut.mutate(id)}
                />
              ))}
              {visit.conducts.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma conduta detectada.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold">Alertas</h2>
            </div>
            <div className="space-y-3">
              {visit.alerts.map((a) => (
                <AlertCard
                  key={a.id}
                  alert={a}
                  onAcknowledge={(id) => ackAlertMut.mutate(id)}
                />
              ))}
              {visit.alerts.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum alerta detectado.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-violet-500" />
              <h2 className="text-lg font-bold">Pendências</h2>
            </div>
            <div className="space-y-3">
              {visit.pendings.map((p) => (
                <PendingCard
                  key={p.id}
                  pending={p}
                  onResolve={(id) => resolvePendingMut.mutate(id)}
                />
              ))}
              {visit.pendings.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma pendência.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-bold">Prescrições</h2>
            </div>
            <div className="space-y-2">
              {visit.prescriptions.map((p) => (
                <div key={p.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{p.medication}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.dose} · {p.route.toUpperCase()} · {p.frequency}
                    {p.duration ? ` · ${p.duration}` : ""}
                  </p>
                </div>
              ))}
              {visit.prescriptions.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">
                  Sem prescrições nesta visita.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
