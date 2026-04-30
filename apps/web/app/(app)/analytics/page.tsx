import { PageShell } from "@/components/layout/PageShell";

export default function AnalyticsPage() {
  return (
    <PageShell
      title="Painel de Gestão"
      description="Métricas consolidadas e indicadores de qualidade"
    >
      {/* TODO: Implementar gráficos com Recharts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Gráfico de visitas por dia (Recharts) será implementado aqui.
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Gráfico de condutas por prioridade será implementado aqui.
        </div>
      </div>
    </PageShell>
  );
}
