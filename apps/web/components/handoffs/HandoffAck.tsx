"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

interface HandoffAckProps {
  handoffId: string;
  acknowledged: boolean;
  onAcknowledge: (id: string) => Promise<void>;
}

export function HandoffAck({ handoffId, acknowledged, onAcknowledge }: HandoffAckProps) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try { await onAcknowledge(handoffId); } finally { setLoading(false); }
  };

  if (acknowledged) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4" /> Plantão recebido
      </div>
    );
  }

  return (
    <Button onClick={handle} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Confirmar Recebimento
    </Button>
  );
}
