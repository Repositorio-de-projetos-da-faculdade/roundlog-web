"use client";

interface VisitSummaryProps {
  summary: string;
}

export function VisitSummary({ summary }: VisitSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm border-primary/20 bg-primary/5">
      <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
        "{summary}"
      </p>
    </div>
  );
}
