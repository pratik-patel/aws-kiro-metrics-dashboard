type SignalRingItem = {
  label: string;
  value: number;
  color: string;
  note?: string;
};

interface SignalRingProps {
  title: string;
  centerLabel: string;
  centerValue: string;
  items: SignalRingItem[];
}

export function SignalRing({ title, centerLabel, centerValue, items }: SignalRingProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const gapLength = 12;
  let currentOffset = 0;

  const segments = items.map((item) => {
    const rawLength = total > 0 ? (item.value / total) * circumference : circumference / Math.max(items.length, 1);
    const segmentLength = Math.max(rawLength - gapLength, circumference * 0.06);
    const segment = {
      ...item,
      dasharray: `${segmentLength} ${circumference}`,
      dashoffset: -currentOffset,
    };

    currentOffset += rawLength;
    return segment;
  });

  return (
    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
      <div className="space-y-4">
        <h3 className="dashboard-card-title text-slate-100">{title}</h3>

        <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.78fr)_minmax(0,1.22fr)] lg:items-center">
          <div className="flex items-center justify-center">
            <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
            <defs>
              <filter id="ringGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
              <circle cx="120" cy="120" r={radius} fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="18" />
              {segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={segment.dasharray}
                  strokeDashoffset={segment.dashoffset}
                  transform="rotate(-90 120 120)"
                  filter="url(#ringGlow)"
                />
              ))}
              <circle cx="120" cy="120" r="56" fill="rgba(9,14,25,0.95)" stroke="rgba(255,255,255,0.04)" />
              <text
                x="120"
                y="104"
                textAnchor="middle"
                className="fill-slate-400 text-[11px] uppercase tracking-[0.22em]"
              >
                {centerLabel}
              </text>
              <text
                x="120"
                y="134"
                textAnchor="middle"
                className="fill-white text-[28px] font-semibold tracking-[-0.03em]"
              >
                {centerValue}
              </text>
            </svg>
          </div>

          <div className="grid gap-3">
            {items.map((item) => {
              const width = total ? Math.max(12, (item.value / total) * 100) : 12;
              return (
                <div key={item.label} className="rounded-xl border border-white/6 bg-black/20 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="text-sm font-medium text-slate-200">{item.label}</p>
                    </div>
                    <span className="text-sm text-slate-300">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/6 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: item.color }} />
                  </div>
                  {item.note ? <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.note}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
