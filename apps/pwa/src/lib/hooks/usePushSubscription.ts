"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPushPublicKey,
  subscribePush,
  unsubscribePush,
} from "@/lib/api/notifications";

type Status = "unsupported" | "denied" | "disabled" | "idle" | "subscribed" | "loading";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/**
 * Gerencia a subscription de push notifications.
 *
 *  - Detecta suporte do navegador e permissão atual
 *  - Registra SW (`/sw.js`) se ainda não registrado
 *  - subscribe: pede permissão, gera PushSubscription, envia ao backend
 *  - unsubscribe: revoga no navegador e no backend
 */
export function usePushSubscription() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  // Registra o SW e detecta estado inicial
  useEffect(() => {
    if (!supported) {
      setStatus("unsupported");
      return;
    }

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();

        if (sub) {
          setStatus("subscribed");
        } else if (Notification.permission === "denied") {
          setStatus("denied");
        } else {
          setStatus("idle");
        }
      } catch (err) {
        console.error("Falha ao registrar SW:", err);
        setStatus("unsupported");
      }
    })();
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) return;
    setError(null);
    setStatus("loading");

    try {
      const { publicKey, enabled } = await getPushPublicKey();
      if (!enabled || !publicKey) {
        setError("Push notifications não estão habilitadas no servidor.");
        setStatus("disabled");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      // Cast: TS lib.dom mais nova exige ArrayBuffer estrito, mas a runtime
      // aceita Uint8Array com ArrayBufferLike. Cast pra unknown evita o ruído.
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      });

      const raw = sub.toJSON();
      await subscribePush({
        endpoint: raw.endpoint!,
        keys: {
          p256dh: raw.keys?.p256dh ?? "",
          auth: raw.keys?.auth ?? "",
        },
        userAgent: navigator.userAgent,
      });
      setStatus("subscribed");
    } catch (err) {
      console.error("Falha ao inscrever push:", err);
      setError("Não foi possível ativar as notificações.");
      setStatus("idle");
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;
    setStatus("loading");

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribePush(sub.endpoint).catch(() => undefined);
        await sub.unsubscribe();
      }
      setStatus("idle");
    } catch (err) {
      console.error("Falha ao desinscrever:", err);
      setError("Não foi possível desativar as notificações.");
    }
  }, [supported]);

  return { status, error, subscribe, unsubscribe };
}
