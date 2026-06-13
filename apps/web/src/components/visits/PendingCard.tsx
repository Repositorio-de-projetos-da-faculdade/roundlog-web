"use client";

import type { Pending } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, FlaskConical, Pill, Stethoscope } from "lucide-react";

interface PendingCardProps {
  pending: Pending;
  onResolve?: (id: string) => void;
}

// Heurística: tenta inferir ícone a partir do assignedToRole / texto da descrição
function iconFor(pending: Pending) {
  const role = (pending.assignedToRole ?? "").toLowerCase();
  if (role.includes("lab")) return FlaskConical;
  if (role.includes("pharm") || role.includes("farm")) return Pill;
  if (role.includes("radio")) return Stethoscope;
  return ClipboardList;
}

const roleLabel: Record<string, string> = {
  nursing: "Enfermagem",
  lab: "Laboratório",
  pharmacy: "Farmácia",
  radiology: "Radiologia",
};

export function PendingCard({ pending, onResolve }: PendingCardProps) {
  const Icon = iconFor(pending);
  const label = pending.assignedToRole ? roleLabel[pending.assignedToRole] ?? pending.assignedToRole : "Pendente";

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{pending.description}</p>
          <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
        </div>
      </div>
      {pending.status === "OPEN" && onResolve && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResolve(pending.id)}
          className="text-xs h-8"
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Resolver
        </Button>
      )}
      {pending.status === "RESOLVED" && (
        <Badge variant="secondary" className="text-[10px]">Resolvido</Badge>
      )}
    </div>
  );
}
