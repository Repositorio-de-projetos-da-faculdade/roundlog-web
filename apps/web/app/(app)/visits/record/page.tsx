"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createVisit, uploadAudio } from "@/lib/api/visits";
import { getAdmission } from "@/lib/api/patients";
import { PageShell } from "@/components/layout/PageShell";
import { AudioRecorder } from "@/components/visits/AudioRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecordVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admissionId = searchParams.get("admissionId");

  const [step, setStep] = useState<"idle" | "recording" | "uploading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  // Busca dados da internação para contexto
  const { data: admission, isLoading: loadingAdmission } = useQuery({
    queryKey: ["admission", admissionId],
    queryFn: () => getAdmission(admissionId!),
    enabled: !!admissionId,
  });

  // Mutação para criar visita e enviar áudio
  const visitMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      if (!admissionId) throw new Error("ID da internação não fornecido.");
      
      setStep("uploading");
      
      // 1. Cria a visita
      const visit = await createVisit(admissionId);
      
      // 2. Faz o upload do áudio
      await uploadAudio(visit.id, blob);
      
      return visit;
    },
    onSuccess: (visit) => {
      setStep("done");
      router.push(`/visits/${visit.id}`);
    },
    onError: (err) => {
      setError("Erro ao processar visita. Tente novamente.");
      setStep("idle");
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

  return (
    <PageShell
      title="Gravar Visita Médica"
      description={admission ? `Paciente: ${admission.patient.name} · Leito: ${admission.bedNumber}` : "Preparando ambiente de gravação..."}
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
            ) : error ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm text-center">
                {error}
              </div>
            ) : (
              <AudioRecorder 
                onUpload={(blob) => visitMutation.mutate(blob)} 
                uploading={visitMutation.isPending}
              />
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
