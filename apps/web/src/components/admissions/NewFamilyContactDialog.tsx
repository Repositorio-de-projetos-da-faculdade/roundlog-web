"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFamilyContact } from "@/lib/api/admissions";
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

interface NewFamilyContactDialogProps {
  admissionId: string;
}

export function NewFamilyContactDialog({ admissionId }: NewFamilyContactDialogProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", relationship: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () => createFamilyContact(admissionId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admission", admissionId] });
      setOpen(false);
      setForm({ name: "", relationship: "", phone: "" });
    },
    onError: () => setError("Erro ao criar contato. Verifique os dados."),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Adicionar familiar
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
            <DialogTitle>Novo contato familiar</DialogTitle>
            <DialogDescription>
              Após criar, copie o link gerado e envie ao familiar — acesso sem login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="fc-name">Nome</Label>
              <Input
                id="fc-name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Maria da Silva"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fc-rel">Vínculo</Label>
                <Input
                  id="fc-rel"
                  required
                  minLength={2}
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  placeholder="Esposa, Filho..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fc-phone">Telefone</Label>
                <Input
                  id="fc-phone"
                  required
                  minLength={8}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-0000"
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
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
