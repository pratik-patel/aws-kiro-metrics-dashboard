type RangeBulletTone = "blue" | "amber" | "teal" | "violet" | "rose";

type RangeBulletItem = {
  label: string;
  value: string;
  note: string;
  ratio: number;
  tone: RangeBulletTone;
};

const toneStyles: Record<
  RangeBulletTone,
  {
    fill: string;
    marker: string;
    glow: string;
    lowBand: string;
    midBand: string;
    highBand: string;
  }
> = {
  blue: {
    fill: "bg-[linear-gradient(90deg,rgba(56,189,248,0.9),rgba(59,130,246,0.88))]",
    marker: "bg-sky-300",
    glow: "shadow-[0_0_18px_rgba(56,189,248,0.32)]",
    lowBand: "bg-sky-500/12",
    midBand: "bg-blue-500/12",
    highBand: "bg-indigo-500/14",
  },
  amber: {
    fill: "bg-[linear-gradient(90deg,rgba(251,191,36,0.92),rgba(249,115,22,0.9))]",
    marker: "bg-amber-200",
    glow: "shadow-[0_0_18px_rgba(249,115,22,0.28)]",
    lowBand: "bg-amber-500/10",
    midBand: "bg-orange-500/12",
    highBand: "bg-red-500/14",
  },
  teal: {
    fill: "bg-[linear-gradient(90deg,rgba(45,212,191,0.92),rgba(20,184,166,0.9))]",
    marker: "bg-teal-200",
    glow: "shadow-[0_0_18px_rgba(45,212,191,0.28)]",
    lowBand: "bg-teal-500/10",
    midBand: "bg-emerald-500/12",
    highBand: "bg-cyan-500/14",
  },
  violet: {
    fill: "bg-[linear-gradient(90deg,rgba(167,139,250,0.94),rgba(139,92,246,0.92))]",
    marker: "bg-violet-200",
    glow: "shadow-[0_0_18px_rgba(139,92,246,0.28)]",
    lowBand: "bg-violet-500/10",
    midBand: "bg-fuchsia-500/12",
    highBand: "bg-indigo-500/14",
  },
  rose: {
    fill: "bg-[linear-gradient(90deg,rgba(251,113,133,0.94),rgba(244,63,94,0.9))]",
    marker: "bg-rose-200",
    glow: "shadow-[0_0_18px_rgba(244,63,94,0.28)]",
    lowBand: "bg-rose-500/10",
    midBand: "bg-pink-500/12",
    highBand: "bg-red-500/14",
  },
};

export function RangeBulletGroup({
  title,
  description,
  items,
  className = "",
}: {
  title: string;
  description?: string;
  items: RangeBulletItem[];
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-white/6 bg-[#0b1120] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] ${className}`}>
      <div className="mb-5">
        <p className="dashboard-section-title text-slate-100">{title}</p>
        {description ? <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p> : null}
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const tone = toneStyles[item.tone];
          const ratio = Math.min(1, Math.max(0.05, item.ratio));
          const percent = ratio * 100;

          return (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-100">{item.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.note}</p>
                </div>
                <span className="text-sm font-semibold text-slate-100">{item.value}</span>
              </div>

              <div className="mt-4">
                <div className="relative h-4 overflow-hidden rounded-full border border-white/6 bg-[#07101f]">
                  <div className="absolute inset-0 grid grid-cols-3 gap-px">
                    <div className={tone.lowBand} />
                    <div className={tone.midBand} />
                    <div className={tone.highBand} />
                  </div>
                  <div className={`absolute inset-y-[2px] left-[2px] rounded-full ${tone.fill} ${tone.glow}`} style={{ width: `calc(${percent}% - 4px)` }} />
                  <div className={`absolute top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full ${tone.marker} ${tone.glow}`} style={{ left: `calc(${percent}% - 1px)` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  <span>Low</span>
                  <span>Target</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
