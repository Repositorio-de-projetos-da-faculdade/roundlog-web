"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { dischargeAdmission, getAdmission } from "@/lib/api/admissions";
import { useAuthStore } from "@/lib/stores/authStore";
import { PageShell } from "@/components/layout/PageShell";
import { NewFamilyContactDialog } from "@/components/admissions/NewFamilyContactDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  LogOut,
  Phone,
  Heart,
  Copy,
  Check,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function AdmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const role = useAuthStore((s) => s.user?.role);
  const canRecord = role === "PHYSICIAN" || role === "ADMIN";

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admission", params.id],
    queryFn: () => getAdmission(params.id),
    enabled: !!params.id,
  });

  const dischargeMut = useMutation({
    mutationFn: () => dischargeAdmission(params.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admission", params.id] }),
  });

  if (isLoading) {
    return (
      <PageShell title="Internação">
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell title="Internação">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          Erro ao carregar internação.
        </div>
      </PageShell>
    );
  }

  const canDischarge =
    data.status === "ACTIVE" && (role === "PHYSICIAN" || role === "ADMIN");

  function copyFamilyLink(token: string) {
    // Portal familiar mora no PWA — usa env var pra montar o link correto.
    // Fallback pro web atual se não configurado (caso raro).
    const portalUrl =
      process.env.NEXT_PUBLIC_FAMILY_PORTAL_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const link = `${portalUrl}/family/patient/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  return (
    <PageShell
      title={data.patient.name}
      description={`Leito ${data.bed.code} · ${data.bed.ward.name}`}
      actions={
        <div className="flex items-center gap-2">
          {canRecord && (
            <Button
              variant="outline"
              onClick={() => router.push(`/visits/record?admissionId=${data.id}`)}
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              Nova visita
            </Button>
          )}
          {canDischarge && (
            <Button
              variant="destructive"
              disabled={dischargeMut.isPending}
              onClick={() => {
                if (confirm("Confirmar alta? Esta ação libera o leito.")) {
                  dischargeMut.mutate();
                }
              }}
              className="gap-2"
            >
              {dischargeMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Dar alta
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <Stat label="Status" value={data.status === "ACTIVE" ? "Internado" : "Alta dada"} />
          <Stat
            label="Admissão"
            value={new Date(data.admittedAt).toLocaleDateString("pt-BR")}
          />
          <Stat
            label="Alta"
            value={
              data.dischargedAt
                ? new Date(data.dischargedAt).toLocaleDateString("pt-BR")
                : "—"
            }
          />
          <Stat label="Diagnóstico" value={data.diagnosis ?? "—"} />
        </section>

        {data.patient.allergies.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-xs text-amber-700 uppercase font-bold mb-1">Alergias</p>
            <div className="flex flex-wrap gap-2">
              {data.patient.allergies.map((a) => (
                <Badge key={a} variant="outline" className="bg-white">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-3">Visitas médicas</h2>
          {data.visits.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma visita registrada nesta internação ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {data.visits.map((v) => (
                <Link
                  key={v.id}
                  href={`/visits/${v.id}`}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(v.startedAt).toLocaleString("pt-BR")}</span>
                  </div>
                  <Badge
                    variant={
                      v.status === "READY"
                        ? "default"
                        : v.status === "ERROR"
                          ? "destructive"
                          : "outline"
                    }
                    className={v.status === "PROCESSING" ? "animate-pulse" : ""}
                  >
                    {v.status === "READY"
                      ? "Finalizada"
                      : v.status === "PROCESSING"
                        ? "Processando"
                        : v.status === "ERROR"
                          ? "Erro"
                          : "Gravando"}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" /> Contatos familiares
            </h2>
            <NewFamilyContactDialog admissionId={data.id} />
          </div>
          {data.familyContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nenhum contato cadastrado. Use o botão acima para adicionar.
            </p>
          ) : (
            <div className="space-y-2">
              {data.familyContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {c.name}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
                        ({c.relationship})
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" /> {c.phone}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyFamilyLink(c.accessToken)}
                    className="gap-1.5"
                  >
                    {copiedToken === c.accessToken ? (
                      <>
                        <Check className="h-3 w-3" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copiar link
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold mt-1 truncate">{value}</p>
    </div>
  );
}
