"use client";

import { MessageCircleHeart } from "lucide-react";

interface TimelineUpdate {
  id: string;
  contentLay: string;
  generatedAt: string;
}

interface UpdateTimelineProps {
  updates: TimelineUpdate[];
}

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "agora há pouco";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function UpdateTimeline({ updates }: UpdateTimelineProps) {
  if (updates.length === 0) {
    return (
      <p className="px-1 text-sm italic text-slate-400">
        Ainda não há atualizações. A equipe publicará novidades por aqui.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 pl-6">
      {/* linha vertical conectando */}
      <span
        className="absolute left-[9px] top-2 bottom-2 w-px bg-rose-100"
        aria-hidden
      />
      {updates.map((u) => (
        <li key={u.id} className="relative">
          <span className="absolute -left-6 top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rose-500 ring-4 ring-rose-50">
            <MessageCircleHeart className="h-2.5 w-2.5 text-white" />
          </span>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-500">
                Equipe assistencial
              </span>
              <span className="text-[11px] text-slate-400">
                {relativeTime(u.generatedAt)}
              </span>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {u.contentLay}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
