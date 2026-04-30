"use client";

import type { Bed } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BedCardProps {
  bed: Bed;
  onClick?: (bed: Bed) => void;
}

export function BedCard({ bed, onClick }: BedCardProps) {
  const isOccupied = bed.status === "occupied" && bed.admission;
  const hasPending = bed.pendingConducts.length > 0;
  const hasAlerts = bed.alerts > 0;

  return (
    <button
      onClick={() => onClick?.(bed)}
      className={cn(
        "w-full rounded-lg border p-4 text-left transition-all hover:shadow-md",
        hasAlerts
          ? "border-red-500/50 bg-red-500/5"
          : hasPending
            ? "border-yellow-500/50 bg-yellow-500/5"
            : "border-border bg-card"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Leito {bed.number}</span>
        <Badge
          variant={isOccupied ? "default" : "secondary"}
          className="text-xs"
        >
          {bed.status === "available"
            ? "Livre"
            : bed.status === "maintenance"
              ? "Manutenção"
              : "Ocupado"}
        </Badge>
      </div>

      {/* Patient info */}
      {isOccupied && bed.admission && (
        <div className="space-y-1">
          <p className="text-sm font-medium truncate">
            {bed.admission.patient.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {bed.admission.diagnosis}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {hasPending && (
              <Badge variant="outline" className="text-xs">
                {bed.pendingConducts.length} condutas
              </Badge>
            )}
            {hasAlerts && (
              <Badge variant="destructive" className="text-xs">
                {bed.alerts} alertas
              </Badge>
            )}
          </div>
        </div>
      )}
    </button>
  );
}
