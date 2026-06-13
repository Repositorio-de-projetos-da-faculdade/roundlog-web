"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/lib/api/patients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";

interface NewPatientDialogProps {
  /** Render prop opcional — se ausente, mostra botão padrão. */
  trigger?: React.ReactNode;
}

export function NewPatientDialog({ trigger }: NewPatientDialogProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    dob: "",
    bloodType: "",
    allergies: "",
  });
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () =>
      createPatient({
        name: form.name,
        cpf: form.cpf,
        dob: form.dob,
        bloodType: form.bloodType || undefined,
        allergies: form.allergies
          ? form.allergies.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      setOpen(false);
      setForm({ name: "", cpf: "", dob: "", bloodType: "", allergies: "" });
    },
    onError: (err: Error) => {
      // ApiError tem body com a mensagem
      const message = err.message.includes("409")
        ? "CPF já cadastrado."
        : "Erro ao criar paciente. Verifique os dados.";
      setError(message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mut.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (trigger as React.ReactElement) : (
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Paciente
            </Button>
          )
        }
      />

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
            <DialogDescription>
              Cadastre um paciente. CPF é único no sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="np-name">Nome completo</Label>
              <Input
                id="np-name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="np-cpf">CPF</Label>
                <Input
                  id="np-cpf"
                  required
                  placeholder="00000000000"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value.replace(/\D/g, "") })}
                  maxLength={14}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="np-dob">Nascimento</Label>
                <Input
                  id="np-dob"
                  type="date"
                  required
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="np-blood">Tipo sanguíneo (opcional)</Label>
              <Input
                id="np-blood"
                placeholder="O+"
                maxLength={3}
                value={form.bloodType}
                onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="np-allergies">Alergias (separadas por vírgula)</Label>
              <Input
                id="np-allergies"
                placeholder="dipirona, penicilina"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mut.isPending}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
