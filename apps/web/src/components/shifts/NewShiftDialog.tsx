"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShift } from "@/lib/api/shifts";
import type { ShiftType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

const SHIFT_LABELS: Record<ShiftType, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  NIGHT: "Noite",
};

interface NewShiftDialogProps {
  wardId: string;
}

export function NewShiftDialog({ wardId }: NewShiftDialogProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ShiftType>("MORNING");
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () => createShift({ wardId, type }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ward-shifts", wardId] });
      setOpen(false);
      setType("MORNING");
    },
    onError: () => setError("Erro ao abrir turno. Verifique a ala."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Abrir turno
          </Button>
        }
      />
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            mut.mutate();
          }}
        >
          <DialogHeader>
            <DialogTitle>Abrir turno</DialogTitle>
            <DialogDescription>
              Inicia um novo turno de enfermagem nesta ala, começando agora.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="shift-type">Período</Label>
              <Select
                value={type}
                onValueChange={(v) => setType((v ?? "MORNING") as ShiftType)}
              >
                <SelectTrigger id="shift-type">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING">{SHIFT_LABELS.MORNING}</SelectItem>
                  <SelectItem value="AFTERNOON">{SHIFT_LABELS.AFTERNOON}</SelectItem>
                  <SelectItem value="NIGHT">{SHIFT_LABELS.NIGHT}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Abrir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
