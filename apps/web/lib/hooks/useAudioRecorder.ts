"use client";

import { useState, useRef, useCallback } from "react";

type RecorderState = "idle" | "recording" | "stopped";

/**
 * Hook de gravação de áudio usando MediaRecorder API.
 * Grava em formato webm/opus conforme exigido pelo backend.
 */
export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      setBlob(null);
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      recorder.ondataavailable = (e) => chunks.current.push(e.data);

      recorder.onstop = () => {
        setBlob(new Blob(chunks.current, { type: "audio/webm" }));
        chunks.current = [];

        // Para o timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Libera o microfone
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setState("recording");

      // Inicia timer de duração
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao acessar o microfone. Verifique as permissões."
      );
      setState("idle");
    }
  }, []);

  const stop = useCallback(() => {
    mediaRecorder.current?.stop();
    setState("stopped");
  }, []);

  const reset = useCallback(() => {
    setBlob(null);
    setDuration(0);
    setError(null);
    setState("idle");
  }, []);

  return { state, blob, duration, error, start, stop, reset };
}
