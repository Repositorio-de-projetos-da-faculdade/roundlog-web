"use client";

import type { Bed } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle, Clock } from "lucide-react";

interface BedMobileCardProps {
  bed: Bed;
  onClick?: (id: string) => void;
}

export function BedMobileCard({ bed, onClick }: BedMobileCardProps) {
  const isOccupied = bed.status === "occupied" && bed.admission;
  const hasAlerts = bed.alerts > 0;

  return (
    <div
      onClick={() => isOccupied && onClick?.(bed.id)}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm active:scale-[0.98] transition-transform",
        hasAlerts ? "border-red-500 bg-red-50/50" : "border-border"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Leito {bed.number}</span>
            {hasAlerts && (
              <Badge variant="destructive" className="animate-pulse px-1.5 py-0">
                <AlertCircle className="h-3 w-3" />
              </Badge>
            )}
          </div>
          {isOccupied ? (
            <>
              <p className="text-sm font-semibold truncate max-w-[200px]">
                {bed.admission?.patient.name}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {bed.admission?.diagnosis}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Leito Disponível</p>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge variant={isOccupied ? "default" : "outline"}>
            {isOccupied ? "Ocupado" : "Livre"}
          </Badge>
          {bed.lastVisitAt && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {new Date(bed.lastVisitAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
