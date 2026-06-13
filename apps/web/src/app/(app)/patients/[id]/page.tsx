"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getPatient } from "@/lib/api/patients";
import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

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

  const age = Math.floor(
    (Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 3600 * 1000),
  );

  return (
    <PageShell title={patient.name} description={`CPF: ${patient.cpf}`}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Idade" value={`${age} anos`} />
          <Stat label="Tipo sanguíneo" value={patient.bloodType ?? "—"} />
          <Stat
            label="Alergias"
            value={patient.allergies.length > 0 ? patient.allergies.join(", ") : "Nenhuma"}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Histórico de Internações</h3>
          {patient.admissions.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma internação registrada.
            </p>
          ) : (
            <div className="space-y-3">
              {patient.admissions.map((a) => (
                <Link
                  key={a.id}
                  href={`/admissions/${a.id}`}
                  className="block rounded-lg border p-4 hover:bg-muted/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(a.admittedAt).toLocaleDateString("pt-BR")}
                        {a.dischargedAt
                          ? ` — ${new Date(a.dischargedAt).toLocaleDateString("pt-BR")}`
                          : " — atual"}
                      </span>
                    </div>
                    <Badge variant={a.status === "ACTIVE" ? "default" : "secondary"}>
                      {a.status === "ACTIVE" ? "Em internação" : "Alta dada"}
                    </Badge>
                  </div>
                  {a.diagnosis && (
                    <p className="text-sm text-muted-foreground mt-2">{a.diagnosis}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
