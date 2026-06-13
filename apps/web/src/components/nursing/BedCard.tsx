"use client";

import { useState } from "react";
import type { Conduct, DashboardBed } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExecutionModal } from "./ExecutionModal";
import { NewAdmissionDialog } from "@/components/admissions/NewAdmissionDialog";
import { ArrowRight, Play, Wrench } from "lucide-react";

interface BedCardProps {
  bed: DashboardBed;
  wardId: string;
  onOpenAdmission?: (bed: DashboardBed) => void;
}

export function BedCard({ bed, wardId, onOpenAdmission }: BedCardProps) {
  const [executingConduct, setExecutingConduct] = useState<Conduct | null>(null);

  const activeAdmission = bed.admissions[0];
  const lastVisit = activeAdmission?.visits?.[0];
  const openConducts = (lastVisit?.conducts ?? []).filter((c) => c.status === "OPEN");
  const openAlerts = lastVisit?.alerts ?? [];
  const isOccupied = bed.status === "OCCUPIED" && !!activeAdmission;
  const isMaintenance = bed.status === "MAINTENANCE";

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-4 transition-all",
        openAlerts.length > 0
          ? "border-red-500/50 bg-red-500/5"
          : openConducts.length > 0
            ? "border-yellow-500/50 bg-yellow-500/5"
            : "border-border bg-card",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">Leito {bed.code}</span>
        <Badge variant={isOccupied ? "default" : "secondary"} className="text-xs">
          {bed.status === "AVAILABLE"
            ? "Livre"
            : isMaintenance
              ? "Manutenção"
              : "Ocupado"}
        </Badge>
      </div>

      {isMaintenance && (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Wrench className="h-4 w-4" />
          Leito em manutenção
        </div>
      )}

      {bed.status === "AVAILABLE" && (
        <div className="flex flex-1 flex-col gap-3">
          <p className="py-3 text-center text-sm text-muted-foreground">Leito disponível</p>
          <NewAdmissionDialog bedId={bed.id} wardId={wardId} />
        </div>
      )}

      {isOccupied && activeAdmission && (
        <div className="flex flex-1 flex-col space-y-2">
          <div className="space-y-1">
            <p className="truncate text-sm font-medium">{activeAdmission.patient.name}</p>
            {activeAdmission.diagnosis && (
              <p className="truncate text-xs text-muted-foreground">
                {activeAdmission.diagnosis}
              </p>
            )}
          </div>

          {(openConducts.length > 0 || openAlerts.length > 0) && (
            <div className="flex items-center gap-2">
              {openConducts.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {openConducts.length} condutas
                </Badge>
              )}
              {openAlerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {openAlerts.length} alertas
                </Badge>
              )}
            </div>
          )}

          {openConducts.length > 0 && (
            <ul className="space-y-1.5">
              {openConducts.map((conduct) => (
                <li
                  key={conduct.id}
                  className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate text-xs" title={conduct.description}>
                    {conduct.description}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => setExecutingConduct(conduct)}
                  >
                    <Play className="h-3 w-3" />
                    Executar
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-between px-2 text-xs"
              onClick={() => onOpenAdmission?.(bed)}
            >
              Ver internação
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <ExecutionModal
        conduct={executingConduct}
        wardId={wardId}
        open={executingConduct !== null}
        onOpenChange={(o) => {
          if (!o) setExecutingConduct(null);
        }}
      />
    </div>
  );
}
