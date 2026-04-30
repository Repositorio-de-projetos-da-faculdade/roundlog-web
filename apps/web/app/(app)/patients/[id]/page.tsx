"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/lib/api/patients";
import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ["patient", params.id],
    queryFn: () => getPatient(params.id),
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <PageShell title="Paciente">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full mt-4" />
      </PageShell>
    );
  }

  if (error || !patient) {
    return (
      <PageShell title="Paciente">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          Erro ao carregar paciente.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={patient.name}
      description={`Prontuário: ${patient.medicalRecordNumber}`}
    >
      {/* TODO: Implementar detalhes do paciente e histórico de visitas */}
      <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
        Detalhes do paciente e histórico de internações/visitas serão
        implementados aqui.
      </div>
    </PageShell>
  );
}
