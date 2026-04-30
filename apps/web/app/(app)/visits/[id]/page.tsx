"use client";

import { useVisit } from "@/lib/hooks/useVisit";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { VisitSummary } from "@/components/visits/VisitSummary";
import { ConductCard } from "@/components/visits/ConductCard";
import { AlertCard } from "@/components/visits/AlertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ClipboardList, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VisitDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: visit, isLoading } = useVisit(params.id);

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

  const isProcessing = visit.status === "processing";

  return (
    <PageShell
      title={`Visita Médica - ${new Date(visit.createdAt).toLocaleDateString("pt-BR")}`}
      description={`Paciente: ${visit.admission?.patient.name} · Leito: ${visit.admission?.bedNumber}`}
      actions={
        <Badge variant={isProcessing ? "outline" : "default"} className={isProcessing ? "animate-pulse" : ""}>
          {isProcessing ? (
            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processando IA</>
          ) : (
            "Finalizada"
          )}
        </Badge>
      }
    >
      <div className="space-y-8">
        {/* Resumo da IA */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Resumo Estruturado</h2>
          </div>
          <VisitSummary summary={visit.summary} />
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Condutas extraídas */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold">Condutas e Prescrições</h2>
            </div>
            <div className="space-y-3">
              {visit.conducts.map((conduct) => (
                <ConductCard key={conduct.id} conduct={conduct} />
              ))}
              {visit.conducts.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">Nenhuma conduta detectada.</p>
              )}
            </div>
          </section>

          {/* Alertas extraídos */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold">Alertas e Riscos</h2>
            </div>
            <div className="space-y-3">
              {visit.alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              {visit.alerts.length === 0 && !isProcessing && (
                <p className="text-sm text-muted-foreground italic">Nenhum alerta crítico detectado.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
