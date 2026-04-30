"use client";

import type { Handoff } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, User2, MessageSquare } from "lucide-react";

interface HandoffReportProps {
  handoff: Handoff;
}

const shiftLabels = {
  morning: "Manhã",
  afternoon: "Tarde",
  night: "Noite",
};

export function HandoffReport({ handoff }: HandoffReportProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Passagem de Plantão: {shiftLabels[handoff.shift]}</h2>
        </div>
        <Badge variant={handoff.acknowledgedAt ? "default" : "outline"}>
          {handoff.acknowledgedAt ? "Recebido" : "Pendente"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {handoff.patientStates.map((state) => (
          <div key={state.patientId} className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-primary" />
                <span className="font-bold">{state.patient?.name || "Paciente"}</span>
              </div>
              <Badge variant={state.isStable ? "outline" : "destructive"}>
                {state.isStable ? "Estável" : "Instável"}
              </Badge>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {state.summary}
            </p>
            {state.criticalNotes && (
              <div className="bg-amber-50 border border-amber-100 p-2 rounded text-xs text-amber-800">
                <strong>Atenção:</strong> {state.criticalNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
