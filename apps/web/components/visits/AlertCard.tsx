"use client";

import type { ClinicalAlert } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, Pill, Activity, FlaskConical, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: ClinicalAlert;
  onAcknowledge?: (id: string) => void;
}

const severityConfig = {
  critical: { color: "bg-red-100 border-red-200 text-red-700", textColor: "text-red-800" },
  high: { color: "bg-orange-100 border-orange-200 text-orange-700", textColor: "text-orange-800" },
  medium: { color: "bg-yellow-100 border-yellow-200 text-yellow-700", textColor: "text-yellow-800" },
  low: { color: "bg-blue-100 border-blue-200 text-blue-700", textColor: "text-blue-800" },
};

const categoryConfig = {
  allergy: Pill,
  interaction: AlertCircle,
  vital_sign: Activity,
  lab_result: FlaskConical,
  other: ClipboardList,
};

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const severity = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.low;
  const Icon = categoryConfig[alert.category as keyof typeof categoryConfig] || categoryConfig.other;

  return (
    <div className={cn("rounded-lg border p-4 transition-all", severity.color)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 rounded-full bg-white/50 shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className={cn("text-sm font-bold leading-none", severity.textColor)}>
              {alert.message}
            </p>
            <p className="text-[10px] opacity-70 uppercase font-medium">
              Detectado em {new Date(alert.detectedAt).toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </div>
        {!alert.acknowledgedAt && onAcknowledge && (
          <button 
            onClick={() => onAcknowledge(alert.id)}
            className="text-[10px] underline font-bold opacity-60 hover:opacity-100"
          >
            Ciente
          </button>
        )}
      </div>
    </div>
  );
}
