"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Conduct, ConductExecutionInput } from "@/lib/types";
import { apiFetch } from "@/lib/api/client";
import { executeConduct } from "@/lib/api/conducts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

/** Shape mínimo de um turno de enfermagem (NursingShift). */
interface WardShift {
  id: string;
  type: string;
  startedAt: string;
  nurse?: { name: string } | null;
}

type ExecutionStatus = ConductExecutionInput["status"];

const STATUS_LABELS: Record<ExecutionStatus, string> = {
  done: "Executada",
  partial: "Parcial",
  not_possible: "Não foi possível",
};

interface ExecutionModalProps {
  conduct: Conduct | null;
  wardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de execução de conduta pela enfermagem.
 * Faz a mutation internamente (executeConduct) e invalida o dashboard da ala.
 *
 * O endpoint exige um shiftId (NursingShift). Tentamos listar turnos abertos
 * via GET /wards/:id/shifts?open=true; se falhar ou vier vazio, o usuário
 * informa o shiftId manualmente num input (fallback robusto, já que a
 * listagem de turnos pode estar sendo criada em paralelo).
 */
export function ExecutionModal({ conduct, wardId, open, onOpenChange }: ExecutionModalProps) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ExecutionStatus>("done");
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [manualShiftId, setManualShiftId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tenta buscar turnos abertos. Encapsulado em try/catch suave: se o endpoint
  // ainda não existe (404) ou falha, caímos no fallback de input manual.
  const shiftsQuery = useQuery({
    queryKey: ["ward-shifts", wardId, "open"],
    queryFn: async (): Promise<WardShift[]> => {
      try {
        return await apiFetch<WardShift[]>(`/wards/${wardId}/shifts?open=true`);
      } catch {
        return [];
      }
    },
    enabled: open && !!wardId,
    retry: false,
    staleTime: 60_000,
  });

  const shifts = shiftsQuery.data ?? [];
  const hasShifts = shifts.length > 0;
  // shiftId efetivo: o selecionado da lista, ou o colado manualmente.
  const shiftId = (hasShifts ? selectedShiftId : manualShiftId).trim();

  const mut = useMutation({
    mutationFn: () => {
      if (!conduct) throw new Error("Conduta inválida");
      return executeConduct(conduct.id, { shiftId, notes: notes || undefined, status });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ward-dashboard", wardId] });
      handleClose();
    },
    onError: () => setError("Erro ao registrar execução. Verifique o turno e tente novamente."),
  });

  function handleClose() {
    setNotes("");
    setStatus("done");
    setSelectedShiftId("");
    setManualShiftId("");
    setError(null);
    onOpenChange(false);
  }

  function formatShift(s: WardShift): string {
    const time = new Date(s.startedAt).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const who = s.nurse?.name ? ` — ${s.nurse.name}` : "";
    return `${s.type} (${time})${who}`;
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : handleClose())}>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!shiftId) {
              setError("Informe ou selecione o turno para registrar a execução.");
              return;
            }
            mut.mutate();
          }}
        >
          <DialogHeader>
            <DialogTitle>Executar conduta</DialogTitle>
            <DialogDescription>{conduct?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="execution-status">Resultado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus((v as ExecutionStatus) || "done")}
              >
                <SelectTrigger id="execution-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">{STATUS_LABELS.done}</SelectItem>
                  <SelectItem value="partial">{STATUS_LABELS.partial}</SelectItem>
                  <SelectItem value="not_possible">{STATUS_LABELS.not_possible}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Turno</Label>
              {hasShifts ? (
                <Select
                  value={selectedShiftId}
                  onValueChange={(v) => setSelectedShiftId(v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {formatShift(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <textarea
                    id="execution-shift-id"
                    rows={1}
                    className="flex min-h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="Cole o ID do turno"
                    value={manualShiftId}
                    onChange={(e) => setManualShiftId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nenhum turno aberto encontrado. Informe o ID do turno manualmente.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="execution-notes">Observações (opcional)</Label>
              <textarea
                id="execution-notes"
                rows={3}
                className="flex min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Ex: Paciente relatou dor ao administrar..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar execução
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
