"use client";

import type { Conduct } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";

interface ConductCardProps {
  conduct: Conduct;
  onResolve?: (id: string, notes: string) => void;
}

const priorityConfig = {
  high: { color: "bg-orange-400", label: "Alta" },
  medium: { color: "bg-yellow-400", label: "Média" },
  low: { color: "bg-blue-400", label: "Baixa" },
};

export function ConductCard({ conduct, onResolve }: ConductCardProps) {
  const priority = priorityConfig[conduct.priority as keyof typeof priorityConfig] || priorityConfig.low;

  return (
    <div className="rounded-lg border border-border p-4 space-y-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${priority.color}`} />
          <span className="text-sm font-medium">{conduct.description}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {priority.label}
        </Badge>
      </div>

      {conduct.deadline && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Prazo: {new Date(conduct.deadline).toLocaleString("pt-BR")}</span>
        </div>
      )}

      {conduct.status === "open" && onResolve && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResolve(conduct.id, "")}
          className="w-full text-xs h-8"
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Marcar como executado
        </Button>
      )}

      {(conduct.status === "executed" || conduct.status === "resolved") && conduct.resolvedAt && (
        <p className="text-xs text-muted-foreground">
          ✓ Executado em{" "}
          {new Date(conduct.resolvedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </div>
  );
}
