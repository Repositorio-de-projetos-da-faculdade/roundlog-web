"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createVisit, uploadAudio } from "@/lib/api/visits";
import { useAuthStore } from "@/lib/stores/authStore";
import { AudioRecorderMobile } from "@/components/mobile/AudioRecorderMobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

export default function MobileRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admissionId = searchParams.get("admissionId");
  const role = useAuthStore((s) => s.user?.role);
  const canRecord = role === "PHYSICIAN" || role === "ADMIN";

  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");

  // Guard: se chegou aqui sem admissionId, volta pra tela de seleção.
  // Antes a mutation falhava silenciosamente e o usuário ficava preso.
  useEffect(() => {
    if (!admissionId) {
      router.replace("/beds");
    }
  }, [admissionId, router]);

  const visitMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      if (!admissionId) throw new Error("Sem internação selecionada.");
      setStatus("uploading");
      const visit = await createVisit(admissionId);
      await uploadAudio(visit.id, blob);
      return visit;
    },
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        router.push("/beds");
      }, 2000);
    },
    onError: () => {
      setStatus("idle");
    },
  });

  // Mensagem amigável quando enfermeiro/técnico tentar usar o gravador.
  // O fluxo de gravação é PHYSICIAN/ADMIN-only no backend (403).
  if (!canRecord) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold">Apenas médicos podem gravar</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          O round é registrado pelo médico responsável. Volte para a lista de
          pacientes.
        </p>
        <Button onClick={() => router.push("/beds")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  if (!admissionId) {
    // Em transição pro replace("/beds") — evita flash de UI inconsistente.
    return null;
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 space-y-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold">Round Enviado!</h1>
        <p className="text-muted-foreground">A IA está processando as condutas agora.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-4">
      <div className="p-6 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/beds")}
          className="-ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos pacientes
        </Button>
        <h1 className="text-2xl font-bold mt-4">Gravar Round</h1>
        <p className="text-sm text-muted-foreground">Fale naturalmente sobre o estado do paciente e as novas condutas.</p>
      </div>

      <div className="flex-1" />

      <AudioRecorderMobile 
        onUpload={(blob) => visitMutation.mutate(blob)} 
        uploading={status === "uploading"} 
      />
    </div>
  );
}
