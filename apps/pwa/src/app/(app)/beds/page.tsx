"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMyAdmissions, type MyAdmissionItem } from "@/lib/api/admissions";
import { useAuthStore } from "@/lib/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, BedDouble, ShieldAlert, CalendarDays } from "lucide-react";

/**
 * Tela inicial do PWA depois do login: lista as internações ATIVAS sob
 * responsabilidade do usuário.
 *
 *  - PHYSICIAN/ADMIN/MANAGER → todas as ativas do hospital
 *  - NURSE/TECHNICIAN        → só da ward do plantão aberto
 *
 * Tap em um card vai para /record?admissionId=X (médico) ou /beds/[wardId]
 * (enfermagem usa o drilldown legado por ala). Em vez de cair direto no
 * gravador sem contexto, o usuário escolhe explicitamente o paciente.
 */
export default function BedsPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canRecord = role === "PHYSICIAN" || role === "ADMIN";

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-admissions"],
    queryFn: getMyAdmissions,
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <header className="py-2">
          <h1 className="text-xl font-bold">Meus pacientes</h1>
        </header>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Erro ao carregar lista de pacientes. Tente novamente em instantes.
      </div>
    );
  }

  if (data?.requiresShift) {
    return (
      <div className="space-y-4">
        <header className="py-2">
          <h1 className="text-xl font-bold">Plantão fechado</h1>
        </header>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-900 space-y-3">
          <ShieldAlert className="h-6 w-6 text-amber-700" aria-hidden="true" />
          <p className="font-semibold">Abra seu plantão para ver os pacientes</p>
          <p className="text-amber-800">
            Como enfermagem, sua lista de leitos depende da ala onde você está
            de plantão. Abra o plantão pelo painel da ala no Web (RoundLog
            Desktop) e volte aqui.
          </p>
        </div>
      </div>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <header className="py-2">
          <h1 className="text-xl font-bold">Meus pacientes</h1>
        </header>
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          <BedDouble className="h-10 w-10 mx-auto mb-3 opacity-40" aria-hidden="true" />
          <p>Nenhuma internação ativa no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="py-2">
        <h1 className="text-xl font-bold">Meus pacientes</h1>
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "paciente ativo" : "pacientes ativos"}
        </p>
      </header>

      <div className="grid gap-3">
        {items.map((a) => (
          <PatientCard
            key={a.id}
            admission={a}
            canRecord={canRecord}
            onRecord={() => router.push(`/record?admissionId=${a.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function PatientCard({
  admission,
  canRecord,
  onRecord,
}: {
  admission: MyAdmissionItem;
  canRecord: boolean;
  onRecord: () => void;
}) {
  const daysAdmitted = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(admission.admittedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const lastVisitLabel = admission.lastVisitAt
    ? new Date(admission.lastVisitAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sem visita registrada";

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3 active:scale-[0.99] transition-transform">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold truncate">
            {admission.patient.name}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {admission.bed.ward.name} · Leito {admission.bed.code}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          Dia {daysAdmitted}
        </Badge>
      </div>

      {admission.diagnosis && (
        <p className="text-xs text-foreground/80 line-clamp-2 border-l-2 border-primary/40 pl-2">
          {admission.diagnosis}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <CalendarDays className="h-3 w-3" aria-hidden="true" />
          <span>Última visita: {lastVisitLabel}</span>
        </div>
        {canRecord && (
          <Button
            size="sm"
            onClick={onRecord}
            className="gap-1.5 h-8 text-xs"
            aria-label={`Gravar nova visita para ${admission.patient.name}`}
          >
            <Mic className="h-3.5 w-3.5" />
            Gravar
          </Button>
        )}
      </div>
    </div>
  );
}
