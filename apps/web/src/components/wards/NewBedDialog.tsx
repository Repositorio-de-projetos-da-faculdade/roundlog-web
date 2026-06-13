"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBed } from "@/lib/api/wards";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Loader2 } from "lucide-react";
import type { BedStatus } from "@/lib/types";

interface NewBedDialogProps {
  wardId: string;
}

export function NewBedDialog({ wardId }: NewBedDialogProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ code: string; status: BedStatus }>({
    code: "",
    status: "AVAILABLE",
  });
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () => createBed(wardId, { code: form.code, status: form.status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ward-dashboard", wardId] });
      qc.invalidateQueries({ queryKey: ["ward-beds", wardId] });
      setOpen(false);
      setForm({ code: "", status: "AVAILABLE" });
    },
    onError: () => setError("Erro ao criar leito. Verifique o código e permissões."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Novo leito
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
            <DialogTitle>Novo Leito</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="nb-code">Código</Label>
              <Input
                id="nb-code"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="L01, 204-A, ..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status inicial</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: (v as BedStatus) || "AVAILABLE" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Disponível</SelectItem>
                  <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
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
              Criar leito
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
