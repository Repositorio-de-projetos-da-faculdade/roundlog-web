"use client";

import type { Conduct, Priority } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";

interface ConductCardProps {
  conduct: Conduct;
  onResolve?: (id: string) => void;
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  CRITICAL: { color: "bg-red-500", label: "Crítica" },
  HIGH: { color: "bg-orange-400", label: "Alta" },
  MEDIUM: { color: "bg-yellow-400", label: "Média" },
  LOW: { color: "bg-blue-400", label: "Baixa" },
};

export function ConductCard({ conduct, onResolve }: ConductCardProps) {
  const priority = priorityConfig[conduct.priority] ?? priorityConfig.LOW;

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

      {conduct.deadlineAt && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Prazo: {new Date(conduct.deadlineAt).toLocaleString("pt-BR")}</span>
        </div>
      )}

      {conduct.status === "OPEN" && onResolve && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResolve(conduct.id)}
          className="w-full text-xs h-8"
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Marcar como executado
        </Button>
      )}

      {conduct.status === "RESOLVED" && conduct.resolvedAt && (
        <p className="text-xs text-muted-foreground">
          ✓ Executado em {new Date(conduct.resolvedAt).toLocaleString("pt-BR")}
        </p>
      )}

      {conduct.status === "IN_PROGRESS" && (
        <p className="text-xs text-muted-foreground italic">Em andamento</p>
      )}
    </div>
  );
}
