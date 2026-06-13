"use client";

import { useRouter, useParams } from "next/navigation";
import { useWardDashboard } from "@/lib/hooks/useWardDashboard";
import { BedMobileCard } from "@/components/mobile/BedMobileCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lista de leitos da ala :id no formato mobile. Toque em um leito ocupado
 * abre a tela de gravação (médico) ou de execução (enfermagem).
 */
export default function WardBedsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: beds, isLoading } = useWardDashboard(params.id);

  const totalPatients = beds?.reduce((acc, b) => acc + b.admissions.length, 0) ?? 0;

  return (
    <div className="space-y-4">
      <header className="py-2">
        <h1 className="text-xl font-bold">Ala</h1>
        <p className="text-xs text-muted-foreground">
          {totalPatients} {totalPatients === 1 ? "paciente monitorado" : "pacientes monitorados"}
        </p>
      </header>

      <div className="grid gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          beds?.map((bed) => (
            <BedMobileCard
              key={bed.id}
              bed={bed}
              onClick={(admissionId) => router.push(`/record?admissionId=${admissionId}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
