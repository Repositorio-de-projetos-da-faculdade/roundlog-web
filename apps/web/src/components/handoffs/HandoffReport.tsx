"use client";

import type { ShiftHandoff } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, User2 } from "lucide-react";

interface HandoffReportProps {
  handoff: ShiftHandoff;
}

const shiftLabels: Record<string, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  NIGHT: "Noite",
};

export function HandoffReport({ handoff }: HandoffReportProps) {
  const fromShiftType = handoff.fromShift?.type ?? "";
  const patients = handoff.summaryJson?.data?.patients ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">
            Passagem de Plantão: {shiftLabels[fromShiftType] ?? fromShiftType}
          </h2>
        </div>
        <Badge variant={handoff.status === "ACKNOWLEDGED" ? "default" : "outline"}>
          {handoff.status === "ACKNOWLEDGED" ? "Recebido" : "Pendente"}
        </Badge>
      </div>

      {handoff.summaryJson?.text && (
        <div className="rounded-xl border bg-primary/5 border-primary/20 p-4">
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">
            Resumo gerado por IA
          </p>
          <p className="text-sm whitespace-pre-line text-foreground/90">
            {handoff.summaryJson.text}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {patients.map((p, idx) => (
          <div key={`${p.bed}-${idx}`} className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-primary" />
                <span className="font-bold">{p.name}</span>
              </div>
              <Badge variant="outline">Leito {p.bed}</Badge>
            </div>
            <p className="text-sm text-foreground/80">{p.diagnosis}</p>

            {p.openConducts.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold">Condutas abertas:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-muted-foreground">
                  {p.openConducts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {p.alerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 p-2 rounded text-xs text-amber-800">
                <strong>Alertas:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {p.alerts.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
