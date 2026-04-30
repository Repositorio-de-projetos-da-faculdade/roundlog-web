"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createVisit, uploadAudio } from "@/lib/api/visits";
import { AudioRecorderMobile } from "@/components/mobile/AudioRecorderMobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function MobileRecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admissionId = searchParams.get("admissionId");
  
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");

  const visitMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      if (!admissionId) return;
      setStatus("uploading");
      const visit = await createVisit(admissionId);
      await uploadAudio(visit.id, blob);
      return visit;
    },
    onSuccess: (visit) => {
      setStatus("success");
      setTimeout(() => {
        router.push(`/beds/${admissionId}`); // Volta para o leito
      }, 2000);
    },
  });

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
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Leito
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
