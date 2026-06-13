"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdmission } from "@/lib/api/admissions";
import { getPatients } from "@/lib/api/patients";
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
import { cn } from "@/lib/utils";
import { Check, Loader2, UserPlus } from "lucide-react";

interface NewAdmissionDialogProps {
  bedId: string;
  wardId: string;
}

/**
 * Dialog para abrir uma internação num leito disponível.
 * Busca paciente por nome/CPF e abre a internação no leito informado.
 */
export function NewAdmissionDialog({ bedId, wardId }: NewAdmissionDialogProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [error, setError] = useState<string | null>(null);

  const patientsQuery = useQuery({
    queryKey: ["patients", "admission-search", search],
    queryFn: () => getPatients({ search: search || undefined, take: 50 }),
    enabled: open,
    staleTime: 30_000,
  });

  const patients = patientsQuery.data?.items ?? [];

  const mut = useMutation({
    mutationFn: () =>
      createAdmission({
        patientId: selectedPatientId,
        bedId,
        diagnosis: diagnosis || undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ward-dashboard", wardId] });
      handleClose();
    },
    onError: () =>
      setError("Erro ao abrir internação. Verifique o paciente e suas permissões."),
  });

  function handleClose() {
    setSearch("");
    setSelectedPatientId("");
    setDiagnosis("");
    setError(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Internar paciente
          </Button>
        }
      />

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!selectedPatientId) {
              setError("Selecione um paciente.");
              return;
            }
            mut.mutate();
          }}
        >
          <DialogHeader>
            <DialogTitle>Nova internação</DialogTitle>
            <DialogDescription>
              Selecione o paciente que ocupará este leito.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="na-search">Paciente</Label>
              <Input
                id="na-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou CPF..."
              />
            </div>

            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-1">
              {patientsQuery.isLoading ? (
                <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                  Carregando pacientes...
                </p>
              ) : patients.length === 0 ? (
                <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                  Nenhum paciente encontrado.
                </p>
              ) : (
                patients.map((p) => {
                  const isSelected = p.id === selectedPatientId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatientId(p.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                        isSelected && "bg-accent",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{p.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {p.cpf}
                        </span>
                      </span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="na-diagnosis">Diagnóstico (opcional)</Label>
              <textarea
                id="na-diagnosis"
                rows={3}
                className="flex min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Ex: Pneumonia comunitária..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mut.isPending || !selectedPatientId}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Internar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
