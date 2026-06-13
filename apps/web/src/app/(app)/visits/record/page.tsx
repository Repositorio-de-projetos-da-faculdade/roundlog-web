"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createVisit, uploadAudio } from "@/lib/api/visits";
import { getAdmission } from "@/lib/api/admissions";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import { PageShell } from "@/components/layout/PageShell";
import { AudioRecorder } from "@/components/visits/AudioRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecordVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admissionId = searchParams.get("admissionId");
  const role = useAuthStore((s) => s.user?.role);
  const canRecord = role === "PHYSICIAN" || role === "ADMIN";

  const [error, setError] = useState<string | null>(null);

  const { data: admission, isLoading: loadingAdmission } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn: () => getAdmission(admissionId!),
    enabled: !!admissionId,
  });

  const visitMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      if (!admissionId) throw new Error("ID da internação não fornecido.");
      const visit = await createVisit(admissionId);
      await uploadAudio(visit.id, blob);
      return visit;
    },
    onSuccess: (visit) => {
      router.push(`/visits/${visit.id}`);
    },
    onError: (err) => {
      // Mensagens específicas pelos códigos HTTP comuns
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setError(
            "Você não tem permissão para gravar visitas. Apenas usuários com papel Médico(a) podem registrar visitas — faça login como joao@roundlog.dev ou ricardo@roundlog.dev.",
          );
          return;
        }
        if (err.status === 404) {
          setError(
            "Internação não encontrada. Talvez ela tenha sido encerrada ou pertence a outro hospital. Volte e selecione outra.",
          );
          return;
        }
        if (err.status === 400) {
          setError(
            "Áudio recusado pelo servidor (formato ou tamanho inválido). Tente gravar novamente.",
          );
          return;
        }
        if (err.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          return;
        }
      }
      setError("Erro ao processar visita. Tente novamente.");
    },
  });

  if (!admissionId) {
    return (
      <PageShell title="Erro">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold">Internação não identificada</h2>
          <p className="text-muted-foreground mt-2">Selecione um paciente primeiro.</p>
          <Button onClick={() => router.back()} className="mt-6" variant="outline">
            Voltar
          </Button>
        </div>
      </PageShell>
    );
  }

  // Gate por role: enfermeiro / técnico / gestor não pode gravar.
  // Mostra um aviso amigável em vez de deixar o usuário tentar e ver 403.
  if (!canRecord) {
    return (
      <PageShell title="Gravar Visita Médica">
        <div className="max-w-2xl mx-auto">
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <ShieldAlert className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="text-center mt-3">
                Apenas médicos podem gravar visitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-amber-900 text-center">
              <p>
                Você está logado como <strong>{role}</strong>. A gravação de visita
                médica é restrita a usuários com papel <strong>Médico(a)</strong>.
              </p>
              <p className="text-amber-800">
                Para testar este fluxo, faça login com{" "}
                <code className="font-mono bg-white px-1.5 py-0.5 rounded border">
                  joao@roundlog.dev
                </code>{" "}
                ou{" "}
                <code className="font-mono bg-white px-1.5 py-0.5 rounded border">
                  ricardo@roundlog.dev
                </code>
                .
              </p>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="mt-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    );
  }

  const patientName = admission?.patient?.name;
  const bedCode = admission?.bed?.code;
  const description =
    admission && patientName
      ? `Paciente: ${patientName}${bedCode ? ` · Leito: ${bedCode}` : ""}`
      : "Preparando ambiente de gravação...";

  return (
    <PageShell
      title="Gravar Visita Médica"
      description={description}
      actions={
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Cancelar
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Gravador de Round</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingAdmission ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <>
                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Não foi possível processar
                    </p>
                    <p className="text-destructive/90">{error}</p>
                  </div>
                )}
                <AudioRecorder
                  onUpload={(blob) => {
                    setError(null);
                    visitMutation.mutate(blob);
                  }}
                  uploading={visitMutation.isPending}
                />
              </>
            )}

            <div className="text-xs text-muted-foreground text-center px-8">
              Sua gravação será processada pela IA do RoundLog para extrair condutas,
              prescrições e alertas clínicos automaticamente.
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
