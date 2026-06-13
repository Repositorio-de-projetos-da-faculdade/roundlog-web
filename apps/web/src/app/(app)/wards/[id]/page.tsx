"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWardDashboard } from "@/lib/hooks/useWardDashboard";
import { getWards } from "@/lib/api/wards";
import { useAuthStore } from "@/lib/stores/authStore";
import { PageShell } from "@/components/layout/PageShell";
import { WardDashboard } from "@/components/nursing/WardDashboard";
import { NewBedDialog } from "@/components/wards/NewBedDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function WardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canCreateBed = role === "ADMIN" || role === "MANAGER";

  const { data: beds, isLoading, error } = useWardDashboard(params.id);

  // Carrega só pra mostrar o nome da ala — barato, vai no cache.
  const { data: wards } = useQuery({ queryKey: ["wards"], queryFn: getWards });
  const ward = wards?.find((w) => w.id === params.id);

  if (isLoading) {
    return (
      <PageShell title={ward?.name ?? "Ala"}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !beds) {
    return (
      <PageShell title={ward?.name ?? "Ala"}>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          Erro ao carregar dashboard da ala.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={ward?.name ?? "Ala"}
      description={ward?.specialty ?? "Dashboard de enfermagem — atualização a cada 30s"}
      actions={canCreateBed ? <NewBedDialog wardId={params.id} /> : null}
    >
      <WardDashboard
        wardId={params.id}
        beds={beds}
        onOpenAdmission={(bed) => {
          const admission = bed.admissions[0];
          if (admission) router.push(`/admissions/${admission.id}`);
        }}
      />
    </PageShell>
  );
}
