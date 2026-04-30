import { PageShell } from "@/components/layout/PageShell";

export default function HandoffsPage() {
  return (
    <PageShell
      title="Passagem de Plantão"
      description="Gerencie e acompanhe as passagens de plantão entre turnos"
    >
      {/* TODO: Implementar HandoffReport e HandoffAck */}
      <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
        Componentes de passagem de plantão (HandoffReport, HandoffAck) serão
        implementados aqui.
      </div>
    </PageShell>
  );
}
