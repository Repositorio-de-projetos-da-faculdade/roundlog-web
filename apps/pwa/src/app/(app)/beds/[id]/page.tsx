"use client";

import { useWardDashboard } from "@/lib/hooks/useWardDashboard";
import { BedMobileCard } from "@/components/mobile/BedMobileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function WardBedsPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useWardDashboard(params.id);

  return (
    <div className="space-y-4">
      <header className="py-2">
        <h1 className="text-xl font-bold">{data?.ward.name || "Ala Hospitalar"}</h1>
        <p className="text-xs text-muted-foreground">{data?.stats.totalPatients} pacientes monitorados</p>
      </header>

      <div className="grid gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : (
          data?.beds.map((bed) => (
            <BedMobileCard key={bed.id} bed={bed} />
          ))
        )}
      </div>
    </div>
  );
}
