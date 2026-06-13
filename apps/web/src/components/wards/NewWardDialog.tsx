"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWard } from "@/lib/api/wards";
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
import { BedDouble, Loader2 } from "lucide-react";

export function NewWardDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", floor: "", specialty: "" });
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () =>
      createWard({
        name: form.name,
        floor: form.floor || undefined,
        specialty: form.specialty || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wards"] });
      qc.invalidateQueries({ queryKey: ["hospital"] });
      setOpen(false);
      setForm({ name: "", floor: "", specialty: "" });
    },
    onError: () => setError("Erro ao criar ala. Apenas ADMIN/MANAGER pode cadastrar."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <BedDouble className="h-4 w-4" />
            Nova Ala
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
            <DialogTitle>Nova Ala</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="nw-name">Nome</Label>
              <Input
                id="nw-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="UTI Adulto, Pediatria, ..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nw-floor">Andar (opcional)</Label>
                <Input
                  id="nw-floor"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nw-spec">Especialidade (opcional)</Label>
                <Input
                  id="nw-spec"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="Cardiologia"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar ala
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
