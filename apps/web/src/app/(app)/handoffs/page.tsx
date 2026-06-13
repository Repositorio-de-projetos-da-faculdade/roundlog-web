"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/PageShell";
import { getMyHospital } from "@/lib/api/hospital";
import { generateHandoff, getHandoff, acknowledgeHandoff } from "@/lib/api/handoffs";
import { getWardShifts, closeShift } from "@/lib/api/shifts";
import { HandoffReport } from "@/components/handoffs/HandoffReport";
import { NewShiftDialog } from "@/components/shifts/NewShiftDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2 } from "lucide-react";

/**
 * Página de passagem de plantão.
 * - Quem é NURSE/ADMIN: gera novo handoff (ward + fromShiftId).
 * - Qualquer um: visualiza um handoff pelo ID e dá ciência (acknowledge).
 */
export default function HandoffsPage() {
  const qc = useQueryClient();
  const hospital = useQuery({ queryKey: ["hospital"], queryFn: getMyHospital });

  const [wardId, setWardId] = useState<string>("");
  const [fromShiftId, setFromShiftId] = useState<string>("");
  const [activeHandoffId, setActiveHandoffId] = useState<string | null>(null);

  const shifts = useQuery({
    queryKey: ["ward-shifts", wardId],
    queryFn: () => getWardShifts(wardId, true),
    enabled: !!wardId,
  });

  const handoff = useQuery({
    queryKey: ["handoff", activeHandoffId],
    queryFn: () => getHandoff(activeHandoffId!),
    enabled: !!activeHandoffId,
  });

  const generateMut = useMutation({
    mutationFn: () => generateHandoff({ wardId, fromShiftId }),
    onSuccess: (h) => setActiveHandoffId(h.id),
  });

  const ackMut = useMutation({
    mutationFn: (id: string) => acknowledgeHandoff(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["handoff", activeHandoffId] }),
  });

  const closeMut = useMutation({
    mutationFn: (id: string) => closeShift(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ward-shifts", wardId] }),
  });

  return (
    <PageShell
      title="Passagem de Plantão"
      description="Gere uma nova passagem ou visualize uma existente"
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-lg border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold">Gerar nova passagem</h2>
            <div className="space-y-2">
              <Label htmlFor="ward">Ala</Label>
              <Select
                value={wardId}
                onValueChange={(v) => {
                  setWardId(v ?? "");
                  setFromShiftId("");
                }}
              >
                <SelectTrigger id="ward">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {hospital.data?.wards.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromShift">Turno de origem</Label>
              <Select
                value={fromShiftId}
                onValueChange={(v) => setFromShiftId(v ?? "")}
                disabled={!wardId || shifts.isLoading}
              >
                <SelectTrigger id="fromShift">
                  <SelectValue
                    placeholder={
                      !wardId
                        ? "Selecione uma ala primeiro"
                        : shifts.isLoading
                          ? "Carregando turnos..."
                          : "Selecione o turno"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {shifts.data?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {`${s.nurse?.name ?? "—"} · ${s.type} · ${new Date(
                        s.startedAt,
                      ).toLocaleString("pt-BR")}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={!wardId || !fromShiftId || generateMut.isPending}
              onClick={() => generateMut.mutate()}
            >
              {generateMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gerar com IA
            </Button>
            {generateMut.error && (
              <p className="text-xs text-destructive">
                Falha: verifique se a ala e o turno pertencem ao seu hospital.
              </p>
            )}
          </section>

          <section className="rounded-lg border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold">Abrir passagem por ID</h2>
            <Input
              placeholder="Cole o ID da passagem"
              onChange={(e) => setActiveHandoffId(e.target.value || null)}
            />
          </section>

          <section className="rounded-lg border bg-card p-4 space-y-3">
            <h2 className="text-sm font-semibold">Turnos da ala</h2>
            {!wardId ? (
              <p className="text-xs text-muted-foreground">
                Selecione uma ala para ver os turnos abertos.
              </p>
            ) : shifts.isLoading ? (
              <Skeleton className="h-20 w-full rounded-md" />
            ) : shifts.data && shifts.data.length > 0 ? (
              <ul className="space-y-2">
                {shifts.data.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {s.nurse?.name ?? "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.type} · {new Date(s.startedAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={closeMut.isPending}
                      onClick={() => closeMut.mutate(s.id)}
                    >
                      {closeMut.isPending && closeMut.variables === s.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Encerrar"
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum turno aberto.</p>
            )}
            {wardId && <NewShiftDialog wardId={wardId} />}
          </section>
        </aside>

        <main>
          {!activeHandoffId ? (
            <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
              Gere ou abra uma passagem para visualizar.
            </div>
          ) : handoff.isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg" />
          ) : handoff.error || !handoff.data ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
              Erro ao carregar a passagem.
            </div>
          ) : (
            <div className="space-y-4">
              <HandoffReport handoff={handoff.data} />
              {handoff.data.status === "PENDING" && (
                <Button
                  onClick={() => ackMut.mutate(handoff.data!.id)}
                  disabled={ackMut.isPending}
                  className="gap-2"
                >
                  {ackMut.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Dar ciência
                </Button>
              )}
              {handoff.data.status === "ACKNOWLEDGED" && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Passagem com ciência registrada
                  {handoff.data.acks && handoff.data.acks.length > 0 && (
                    <span className="text-muted-foreground">
                      ({handoff.data.acks.length} {handoff.data.acks.length === 1 ? "ciência" : "ciências"})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}
