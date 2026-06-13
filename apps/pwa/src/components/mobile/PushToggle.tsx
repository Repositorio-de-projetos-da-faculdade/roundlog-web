"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushSubscription } from "@/lib/hooks/usePushSubscription";

/**
 * Botão simples para ativar/desativar notificações push.
 * Coloque em uma tela de configurações ou no header.
 */
export function PushToggle() {
  const { status, error, subscribe, unsubscribe } = usePushSubscription();

  if (status === "unsupported") {
    return (
      <p className="text-xs text-muted-foreground italic">
        Notificações não suportadas neste dispositivo.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-xs text-muted-foreground">
        Notificações bloqueadas. Habilite nas configurações do navegador.
      </p>
    );
  }

  if (status === "disabled") {
    return (
      <p className="text-xs text-muted-foreground">
        Push desabilitado pelo servidor (sem VAPID keys).
      </p>
    );
  }

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
        Carregando...
      </Button>
    );
  }

  if (status === "subscribed") {
    return (
      <div className="space-y-1">
        <Button variant="outline" size="sm" onClick={unsubscribe} className="gap-1.5">
          <BellOff className="h-3.5 w-3.5" />
          Desativar notificações
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button size="sm" onClick={subscribe} className="gap-1.5">
        <Bell className="h-3.5 w-3.5" />
        Ativar notificações
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
