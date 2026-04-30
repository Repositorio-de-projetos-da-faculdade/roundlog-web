"use client";

import type { Pending } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, FlaskConical, Pill, Stethoscope, HelpCircle } from "lucide-react";

interface PendingCardProps {
  pending: Pending;
  onResolve?: (id: string) => void;
}

const typeConfig = {
  exam: { icon: FlaskConical, label: "Exame" },
  procedure: { icon: Stethoscope, label: "Procedimento" },
  medication: { icon: Pill, label: "Medicação" },
  other: { icon: ClipboardList, label: "Outro" },
};

export function PendingCard({ pending, onResolve }: PendingCardProps) {
  const config = typeConfig[pending.type as keyof typeof typeConfig] || { icon: HelpCircle, label: "Pendente" };
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{pending.description}</p>
          <p className="text-[10px] text-muted-foreground uppercase">{config.label}</p>
        </div>
      </div>
      <Badge variant={pending.priority === "high" ? "destructive" : "outline"} className="text-[10px]">
        {pending.priority}
      </Badge>
    </div>
  );
}
