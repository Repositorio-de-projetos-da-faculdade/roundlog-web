"use client";

import type { ClinicalAlert } from "@/lib/types";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Pill,
  Activity,
  FlaskConical,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: ClinicalAlert;
  onAcknowledge?: (id: string) => void;
}

// severity é string livre vinda do Gemini — mapeamos por valor conhecido
const severityStyle: Record<string, { wrap: string; text: string; Icon: typeof AlertTriangle }> = {
  critical: { wrap: "bg-red-100 border-red-200 text-red-700", text: "text-red-800", Icon: AlertTriangle },
  warning: { wrap: "bg-yellow-100 border-yellow-200 text-yellow-700", text: "text-yellow-800", Icon: AlertCircle },
  info: { wrap: "bg-blue-100 border-blue-200 text-blue-700", text: "text-blue-800", Icon: Info },
};

const typeIcon: Record<string, typeof Pill> = {
  drug_interaction: AlertCircle,
  allergy: Pill,
  critical_value: Activity,
  fall_risk: ClipboardList,
};

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const style = severityStyle[alert.severity.toLowerCase()] ?? severityStyle.info;
  const Icon = typeIcon[alert.type] ?? FlaskConical;

  return (
    <div className={cn("rounded-lg border p-4 transition-all", style.wrap)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 rounded-full bg-white/50 shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className={cn("text-sm font-bold leading-none", style.text)}>
              {alert.description}
            </p>
            <p className="text-[10px] opacity-70 uppercase font-medium">
              {alert.type.replace(/_/g, " ")}
            </p>
            {alert.acknowledgedAt && (
              <p className="text-[10px] opacity-70">
                Ciente em {new Date(alert.acknowledgedAt).toLocaleString("pt-BR")}
              </p>
            )}
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
