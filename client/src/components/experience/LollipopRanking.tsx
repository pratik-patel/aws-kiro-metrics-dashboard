type LollipopRankingItem = {
  label: string;
  value: number;
  displayValue: string;
  note?: string;
  accent?: "default" | "alert";
  onClick?: () => void;
};

interface LollipopRankingProps {
  title: string;
  description: string;
  items: LollipopRankingItem[];
}

export function LollipopRanking({ title, description, items }: LollipopRankingProps) {
  const max = items.reduce((currentMax, item) => Math.max(currentMax, item.value), 0);

  return (
    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
      <div className="mb-4 space-y-1">
        <h3 className="dashboard-card-title text-slate-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      <div className="space-y-3">
        {items.length ? (
          items.map((item, index) => {
            const width = max > 0 ? Math.max(8, (item.value / max) * 100) : 8;
            const isAlert = item.accent === "alert";
            const buttonClass = item.onClick ? "cursor-pointer hover:border-white/10 hover:bg-white/[0.03]" : "";

            return (
              <div
                key={`${item.label}-${index}`}
                className={`rounded-xl border border-white/6 bg-black/20 px-3 py-3 transition-colors ${buttonClass}`}
                onClick={item.onClick}
                role={item.onClick ? "button" : undefined}
                tabIndex={item.onClick ? 0 : undefined}
                onKeyDown={
                  item.onClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          item.onClick?.();
                        }
                      }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100">{item.label}</p>
                    {item.note ? <p className="mt-1 text-xs text-slate-500">{item.note}</p> : null}
                  </div>
                  <span className={`text-sm font-medium ${isAlert ? "text-amber-300" : "text-slate-200"}`}>
                    {item.displayValue}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-[2px] flex-1 bg-white/8 relative overflow-visible">
                    <div
                      className={`absolute left-0 top-0 h-[2px] ${isAlert ? "bg-amber-400/80" : "bg-sky-400/80"}`}
                      style={{ width: `${width}%` }}
                    />
                    <span
                      className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border ${
                        isAlert
                          ? "border-amber-200/40 bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                          : "border-sky-200/40 bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.38)]"
                      }`}
                      style={{ left: `calc(${width}% - 7px)` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-10 text-center text-sm text-slate-500">
            No ranked items were present in this scope.
          </div>
        )}
      </div>
    </div>
  );
}
