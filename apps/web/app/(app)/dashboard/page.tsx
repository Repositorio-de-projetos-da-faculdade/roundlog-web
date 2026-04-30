import { PageShell } from "@/components/layout/PageShell";

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Visão geral das atividades clínicas"
    >
      {/* TODO: Implementar cards de métricas e gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Visitas Hoje</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Condutas Pendentes</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Alertas Críticos</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Taxa de Execução</p>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
      </div>
    </PageShell>
  );
}
