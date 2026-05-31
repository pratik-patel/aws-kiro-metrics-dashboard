import type { CSSProperties } from "react";
import { useId } from "react";

import { ArrowRight, MoveDown, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type ConstellationTone = "amber" | "blue" | "teal" | "violet" | "rose";

type ConstellationNode = {
  id: string;
  eyebrow?: string;
  title: string;
  detail: string;
  value?: string;
  badge?: string;
  tone?: ConstellationTone;
  actionLabel?: string;
  onAction?: () => void;
};

type ConstellationCenter = {
  eyebrow: string;
  title: string;
  detail: string;
  metrics?: Array<{ label: string; value: string }>;
  badge?: string;
  tone?: ConstellationTone;
};

type ConstellationFooter = {
  eyebrow: string;
  title: string;
  detail: string;
  badge?: string;
  tone?: ConstellationTone;
  actionLabel?: string;
  onAction?: () => void;
};

const toneStyles: Record<
  ConstellationTone,
  {
    panel: string;
    badge: string;
    dot: string;
    shadow: string;
    stroke: string;
  }
> = {
  blue: {
    panel: "border-sky-500/18 bg-sky-500/10",
    badge: "border-sky-500/18 bg-sky-500/12 text-sky-200",
    dot: "bg-sky-300",
    shadow: "shadow-[0_0_26px_rgba(56,189,248,0.2)]",
    stroke: "#38bdf8",
  },
  amber: {
    panel: "border-amber-500/18 bg-amber-500/10",
    badge: "border-amber-500/18 bg-amber-500/12 text-amber-200",
    dot: "bg-amber-300",
    shadow: "shadow-[0_0_24px_rgba(251,191,36,0.18)]",
    stroke: "#f59e0b",
  },
  teal: {
    panel: "border-teal-500/18 bg-teal-500/10",
    badge: "border-teal-500/18 bg-teal-500/12 text-teal-200",
    dot: "bg-teal-300",
    shadow: "shadow-[0_0_24px_rgba(45,212,191,0.18)]",
    stroke: "#2dd4bf",
  },
  violet: {
    panel: "border-violet-500/18 bg-violet-500/10",
    badge: "border-violet-500/18 bg-violet-500/12 text-violet-200",
    dot: "bg-violet-300",
    shadow: "shadow-[0_0_24px_rgba(139,92,246,0.18)]",
    stroke: "#8b5cf6",
  },
  rose: {
    panel: "border-rose-500/18 bg-rose-500/10",
    badge: "border-rose-500/18 bg-rose-500/12 text-rose-200",
    dot: "bg-rose-300",
    shadow: "shadow-[0_0_24px_rgba(244,63,94,0.18)]",
    stroke: "#f43f5e",
  },
};

export function ConstellationFlow({
  title,
  description,
  sources,
  center,
  targets,
  footer,
  className = "",
}: {
  title: string;
  description?: string;
  sources: ConstellationNode[];
  center: ConstellationCenter;
  targets: ConstellationNode[];
  footer: ConstellationFooter;
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const centerTone = toneStyles[center.tone ?? "blue"];
  const footerTone = toneStyles[footer.tone ?? "teal"];
  const sourcePositions = distributePositions(sources.length, 18, 66);
  const targetPositions = distributePositions(targets.length, 18, 66);

  return (
    <div
      className={`rounded-[30px] border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_24%),linear-gradient(180deg,rgba(11,17,32,0.96),rgba(7,11,21,0.98))] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.34)] ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-300" />
            <p className="dashboard-section-title text-slate-100">{title}</p>
          </div>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{description}</p> : null}
        </div>
        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
          Connected read
        </span>
      </div>

      <div className="xl:hidden">
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/6 bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Signals</p>
            <div className="mt-4 space-y-3">
              {sources.map((node) => (
                <CompactNode key={node.id} node={node} />
              ))}
            </div>
          </div>

          <CompactArrow />
          <CenterCard center={center} compact />
          <CompactArrow />

          <div className="rounded-2xl border border-white/6 bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Proof points</p>
            <div className="mt-4 space-y-3">
              {targets.map((node) => (
                <CompactNode key={node.id} node={node} />
              ))}
            </div>
          </div>

          <CompactArrow />
          <FooterCard footer={footer} compact />
        </div>
      </div>

      <div className="relative hidden min-h-[500px] overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,rgba(11,18,32,0.8),rgba(6,10,20,0.92))] xl:block">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:80px_80px] opacity-25" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${gradientId}-left`} x1="18%" x2="50%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.05)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.55)" />
            </linearGradient>
            <linearGradient id={`${gradientId}-right`} x1="50%" x2="82%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.55)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.08)" />
            </linearGradient>
            <linearGradient id={`${gradientId}-down`} x1="0%" x2="0%" y1="28%" y2="84%">
              <stop offset="0%" stopColor="rgba(45,212,191,0.5)" />
              <stop offset="100%" stopColor="rgba(45,212,191,0.06)" />
            </linearGradient>
          </defs>

          {sourcePositions.map((position, index) => {
            const tone = toneStyles[sources[index]?.tone ?? "amber"];
            return (
              <g key={`source-line-${sources[index]?.id ?? index}`}>
                <path
                  d={`M 24 ${position} C 31 ${position}, 39 32, 46 32`}
                  fill="none"
                  stroke={`url(#${gradientId}-left)`}
                  strokeWidth="0.45"
                />
                <circle cx="24" cy={position} r="0.8" fill={tone.stroke} />
              </g>
            );
          })}

          {targetPositions.map((position, index) => {
            const tone = toneStyles[targets[index]?.tone ?? "blue"];
            return (
              <g key={`target-line-${targets[index]?.id ?? index}`}>
                <path
                  d={`M 54 32 C 61 32, 69 ${position}, 76 ${position}`}
                  fill="none"
                  stroke={`url(#${gradientId}-right)`}
                  strokeWidth="0.45"
                />
                <circle cx="76" cy={position} r="0.8" fill={tone.stroke} />
              </g>
            );
          })}

          <path
            d="M 50 42 C 50 52, 50 62, 50 74"
            fill="none"
            stroke={`url(#${gradientId}-down)`}
            strokeWidth="0.45"
            strokeDasharray="1.4 1.6"
          />
          <circle cx="50" cy="74" r="0.8" fill={footerTone.stroke} />
        </svg>

        {sources.map((node, index) => (
          <NodeCard
            key={node.id}
            node={node}
            style={{ left: "1rem", top: `calc(${sourcePositions[index]}% - 3.25rem)` }}
          />
        ))}

        <CenterCard center={center} />

        {targets.map((node, index) => (
          <NodeCard
            key={node.id}
            node={node}
            style={{ right: "1rem", top: `calc(${targetPositions[index]}% - 3.25rem)` }}
          />
        ))}

        <FooterCard footer={footer} />

        <div className="pointer-events-none absolute inset-x-0 top-[31.8%] flex justify-center">
          <div className={`h-2.5 w-2.5 rounded-full ${centerTone.dot} ${centerTone.shadow}`} />
        </div>
      </div>
    </div>
  );
}

function NodeCard({
  node,
  style,
}: {
  node: ConstellationNode;
  style?: CSSProperties;
}) {
  const tone = toneStyles[node.tone ?? "blue"];

  return (
    <div
      className={`absolute z-10 w-[15.75rem] rounded-[24px] border bg-[linear-gradient(180deg,rgba(15,22,38,0.96),rgba(8,12,23,0.98))] p-4 ${tone.panel} ${tone.shadow}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{node.eyebrow ?? "Signal"}</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-white">{node.title}</p>
        </div>
        {node.value ? <span className="text-sm font-semibold text-slate-100">{node.value}</span> : null}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{node.detail}</p>
      {node.badge ? (
        <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] ${tone.badge}`}>
          {node.badge}
        </span>
      ) : null}
      {node.actionLabel && node.onAction ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 h-8 rounded-full border border-white/8 bg-white/[0.03] px-3 text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white"
          onClick={node.onAction}
        >
          {node.actionLabel}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}

function CenterCard({
  center,
  compact = false,
}: {
  center: ConstellationCenter;
  compact?: boolean;
}) {
  const tone = toneStyles[center.tone ?? "blue"];

  return (
    <div
      className={`${compact ? "" : "absolute left-1/2 top-[12%] z-10 -translate-x-1/2"} rounded-[28px] border bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),linear-gradient(180deg,rgba(15,24,41,0.98),rgba(8,12,23,1))] p-6 ${tone.panel} ${tone.shadow} ${compact ? "w-full" : "w-[29rem]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">{center.eyebrow}</p>
          <h4 className="mt-3 text-[1.2rem] font-semibold leading-tight text-white">{center.title}</h4>
        </div>
        {center.badge ? (
          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${tone.badge}`}>
            {center.badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{center.detail}</p>
      {center.metrics?.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {center.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{metric.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FooterCard({
  footer,
  compact = false,
}: {
  footer: ConstellationFooter;
  compact?: boolean;
}) {
  const tone = toneStyles[footer.tone ?? "teal"];

  return (
    <div
      className={`${compact ? "" : "absolute bottom-5 left-1/2 z-10 -translate-x-1/2"} rounded-[24px] border bg-[linear-gradient(180deg,rgba(10,17,28,0.98),rgba(8,12,23,1))] p-5 ${tone.panel} ${tone.shadow} ${compact ? "w-full" : "w-[25rem]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">{footer.eyebrow}</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-white">{footer.title}</p>
        </div>
        {footer.badge ? (
          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${tone.badge}`}>
            {footer.badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{footer.detail}</p>
      {footer.actionLabel && footer.onAction ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 h-8 rounded-full border border-white/8 bg-white/[0.03] px-3 text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white"
          onClick={footer.onAction}
        >
          {footer.actionLabel}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}

function CompactNode({ node }: { node: ConstellationNode }) {
  const tone = toneStyles[node.tone ?? "blue"];

  return (
    <div className={`rounded-2xl border bg-[linear-gradient(180deg,rgba(15,22,38,0.96),rgba(8,12,23,0.98))] p-4 ${tone.panel}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{node.eyebrow ?? "Signal"}</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-white">{node.title}</p>
        </div>
        {node.value ? <span className="text-sm font-semibold text-slate-100">{node.value}</span> : null}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{node.detail}</p>
      {node.badge ? (
        <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] ${tone.badge}`}>
          {node.badge}
        </span>
      ) : null}
      {node.actionLabel && node.onAction ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 h-8 rounded-full border border-white/8 bg-white/[0.03] px-3 text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white"
          onClick={node.onAction}
        >
          {node.actionLabel}
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}

function CompactArrow() {
  return (
    <div className="flex items-center justify-center text-slate-500">
      <MoveDown className="h-4 w-4" />
    </div>
  );
}

function distributePositions(count: number, start: number, end: number) {
  if (count <= 1) {
    return [50];
  }

  return Array.from({ length: count }, (_, index) => start + (index * (end - start)) / (count - 1));
}
