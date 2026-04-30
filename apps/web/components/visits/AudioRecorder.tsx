"use client";

import { useAudioRecorder } from "@/lib/hooks/useAudioRecorder";
import { Button } from "@/components/ui/button";
import { Mic, Square, RotateCcw, Upload, AlertCircle } from "lucide-react";

interface AudioRecorderProps {
  onUpload: (blob: Blob) => void;
  uploading?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioRecorder({ onUpload, uploading }: AudioRecorderProps) {
  const { state, blob, duration, error, start, stop, reset } =
    useAudioRecorder();

  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {state === "idle" && "Pronto para gravar"}
          {state === "recording" && "Gravando..."}
          {state === "stopped" && "Gravação finalizada"}
        </p>

        {/* Timer */}
        <p className="text-4xl font-mono font-bold tabular-nums">
          {formatDuration(duration)}
        </p>

        {/* Indicador de gravação */}
        {state === "recording" && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-500">REC</span>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Controles */}
      <div className="flex items-center justify-center gap-3">
        {state === "idle" && (
          <Button onClick={start} size="lg" className="gap-2">
            <Mic className="h-5 w-5" />
            Iniciar Gravação
          </Button>
        )}

        {state === "recording" && (
          <Button onClick={stop} size="lg" variant="destructive" className="gap-2">
            <Square className="h-5 w-5" />
            Parar
          </Button>
        )}

        {state === "stopped" && blob && (
          <>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Regravar
            </Button>
            <Button
              onClick={() => onUpload(blob)}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Enviando..." : "Enviar para IA"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
