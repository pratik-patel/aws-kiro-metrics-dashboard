import type { ReactNode } from "react";
import { CheckCircle2, CircleDotDashed, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type ExperienceStat = {
  label: string;
  value: string;
  note?: string;
};

type JourneyState = "complete" | "active" | "upcoming";

type JourneyStep = {
  label: string;
  detail: string;
  state?: JourneyState;
};

interface ExperienceHeaderProps {
  eyebrow: string;
  title: string;
  lead: string;
  stats?: ExperienceStat[];
  journey?: JourneyStep[];
  actions?: ReactNode;
}

const journeyStateStyles: Record<JourneyState, string> = {
  complete: "border-emerald-400/18 bg-emerald-500/10 text-emerald-100",
  active: "border-sky-400/24 bg-sky-500/12 text-white shadow-[0_10px_30px_rgba(59,130,246,0.16)]",
  upcoming: "border-white/8 bg-black/20 text-slate-300",
};

export function ExperienceHeader({
  eyebrow,
  title,
  lead,
  stats = [],
  journey = [],
  actions,
}: ExperienceHeaderProps) {
  return (
    <section className="rounded-[30px] border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.985),rgba(7,12,24,0.98))] px-6 py-6 shadow-[0_24px_70px_rgba(2,6,23,0.45)] md:px-7 md:py-7">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-start">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/14 bg-sky-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-sky-100">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <div className="space-y-3">
            <h1 className="dashboard-page-title">{title}</h1>
            <p className="dashboard-page-lead max-w-4xl text-slate-300/88">{lead}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {stats.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={`${stat.label}-${stat.value}`}
                className="rounded-2xl border border-white/7 bg-black/18 px-4 py-4 backdrop-blur-sm"
              >
                <p className="dashboard-eyebrow text-slate-400/90">{stat.label}</p>
                <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-white">{stat.value}</p>
                {stat.note ? <p className="mt-2 text-sm leading-relaxed text-slate-400">{stat.note}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {journey.length ? (
        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          {journey.map((step, index) => {
            const state = step.state ?? "upcoming";
            return (
              <div
                key={`${step.label}-${index}`}
                className={cn(
                  "rounded-2xl border px-4 py-4 transition-colors",
                  journeyStateStyles[state],
                )}
              >
                <div className="flex items-center gap-2">
                  {state === "complete" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <CircleDotDashed className={cn("h-4 w-4", state === "active" ? "text-sky-200" : "text-slate-500")} />
                  )}
                  <p className="text-sm font-semibold tracking-[-0.01em]">{step.label}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.detail}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
