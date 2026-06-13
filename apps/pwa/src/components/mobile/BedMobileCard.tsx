"use client";

import type { DashboardBed } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle, Clock } from "lucide-react";

interface BedMobileCardProps {
  bed: DashboardBed;
  onClick?: (admissionId: string) => void;
}

export function BedMobileCard({ bed, onClick }: BedMobileCardProps) {
  const admission = bed.admissions[0];
  const lastVisit = admission?.visits?.[0];
  const openAlerts = lastVisit?.alerts?.length ?? 0;
  const isOccupied = bed.status === "OCCUPIED" && !!admission;

  return (
    <div
      onClick={() => isOccupied && admission && onClick?.(admission.id)}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm active:scale-[0.98] transition-transform",
        openAlerts > 0 ? "border-red-500 bg-red-50/50" : "border-border",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Leito {bed.code}</span>
            {openAlerts > 0 && (
              <Badge variant="destructive" className="animate-pulse px-1.5 py-0">
                <AlertCircle className="h-3 w-3" />
              </Badge>
            )}
          </div>
          {isOccupied && admission ? (
            <>
              <p className="text-sm font-semibold truncate max-w-[200px]">
                {admission.patient.name}
              </p>
              {admission.diagnosis && (
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {admission.diagnosis}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Leito Disponível</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant={isOccupied ? "default" : "outline"}>
            {isOccupied ? "Ocupado" : "Livre"}
          </Badge>
          {lastVisit?.startedAt && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {new Date(lastVisit.startedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
