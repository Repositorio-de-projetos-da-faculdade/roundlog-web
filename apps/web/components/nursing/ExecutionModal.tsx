"use client";

import { useState } from "react";
import type { Conduct } from "@/lib/types";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ExecutionModalProps {
  conduct: Conduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (conductId: string, notes: string) => Promise<void>;
}

export function ExecutionModal({ conduct, open, onOpenChange, onConfirm }: ExecutionModalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!conduct) return;
    setLoading(true);
    try {
      await onConfirm(conduct.id, notes);
      setNotes("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Execução</DialogTitle>
          <DialogDescription>{conduct?.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="execution-notes">Observações (opcional)</Label>
            <Input id="execution-notes" placeholder="Ex: Paciente relatou dor..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Execução
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
