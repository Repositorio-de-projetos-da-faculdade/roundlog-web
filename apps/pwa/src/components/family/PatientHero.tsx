"use client";

import { Heart, BedDouble, Stethoscope, CalendarDays } from "lucide-react";
import type { FamilyOverview } from "@/lib/api/family";

interface PatientHeroProps {
  patient: FamilyOverview["patient"];
  admission: FamilyOverview["admission"];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function PatientHero({ patient, admission }: PatientHeroProps) {
  const isActive = admission.status === "ACTIVE";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-400 to-orange-300 p-5 text-white shadow-lg">
      <Heart
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-white/10"
        aria-hidden
        fill="currentColor"
      />

      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm ring-1 ring-white/30">
          {initials(patient.name)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold leading-tight">
            {patient.name}
          </h1>
          <p className="text-sm text-white/85">
            {patient.age} anos
            {patient.bloodType ? ` · Tipo ${patient.bloodType}` : ""}
          </p>
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isActive
                ? "bg-white/25 text-white"
                : "bg-emerald-500/90 text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {isActive ? "Internado" : "Alta"}
          </span>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
          <BedDouble className="h-4 w-4 shrink-0 text-white/80" />
          <span className="truncate">
            {admission.ward} · Leito {admission.bed}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
          <CalendarDays className="h-4 w-4 shrink-0 text-white/80" />
          <span className="truncate">
            {admission.daysAdmitted}{" "}
            {admission.daysAdmitted === 1 ? "dia internado" : "dias internado"}
          </span>
        </div>
      </div>

      {admission.diagnosis && (
        <div className="relative mt-2 flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2 text-sm backdrop-blur-sm">
          <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
          <span className="leading-snug">{admission.diagnosis}</span>
        </div>
      )}
    </div>
  );
}
