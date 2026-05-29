import { cn } from "@/lib/utils";

export interface IntensityMatrixColumn {
  key: string;
  label: string;
}

export interface IntensityMatrixCell {
  key: string;
  value: number;
  displayValue: string;
  note?: string;
}

export interface IntensityMatrixRow {
  key: string;
  label: string;
  summary?: string;
  cells: IntensityMatrixCell[];
}

interface IntensityMatrixProps {
  title: string;
  description: string;
  columns: IntensityMatrixColumn[];
  rows: IntensityMatrixRow[];
  maxValue?: number;
}

function heatClass(ratio: number) {
  if (ratio >= 0.85) return "bg-sky-400/28 text-sky-50 border-sky-300/30";
  if (ratio >= 0.65) return "bg-cyan-400/20 text-cyan-50 border-cyan-300/24";
  if (ratio >= 0.4) return "bg-blue-500/14 text-slate-100 border-blue-300/18";
  if (ratio > 0) return "bg-white/[0.05] text-slate-300 border-white/8";
  return "bg-black/18 text-slate-600 border-white/[0.04]";
}

export function IntensityMatrix({
  title,
  description,
  columns,
  rows,
  maxValue,
}: IntensityMatrixProps) {
  const resolvedMax =
    maxValue ??
    rows.reduce((currentMax, row) => Math.max(currentMax, ...row.cells.map((cell) => cell.value)), 0);

  return (
    <section className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="dashboard-card-title text-slate-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[720px] gap-2"
          style={{ gridTemplateColumns: `minmax(220px, 1.2fr) repeat(${columns.length}, minmax(110px, 0.8fr))` }}
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">Scope Slice</div>
          {columns.map((column) => (
            <div
              key={column.key}
              className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.2em] text-slate-500"
            >
              {column.label}
            </div>
          ))}

          {rows.map((row) => (
            <div key={row.key} className="contents">
              <div
                className="rounded-xl border border-white/6 bg-black/20 px-3 py-3"
              >
                <p className="text-sm font-medium text-slate-100">{row.label}</p>
                {row.summary ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{row.summary}</p> : null}
              </div>
              {columns.map((column) => {
                const cell = row.cells.find((item) => item.key === column.key);
                const value = cell?.value ?? 0;
                const ratio = resolvedMax > 0 ? value / resolvedMax : 0;

                return (
                  <div
                    key={`${row.key}-${column.key}`}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-center transition-colors",
                      heatClass(ratio),
                    )}
                    title={cell?.note ?? `${row.label} · ${column.label}: ${cell?.displayValue ?? "0"}`}
                  >
                    <p className="text-sm font-semibold">{cell?.displayValue ?? "—"}</p>
                    {cell?.note ? <p className="mt-1 text-[11px] leading-relaxed text-current/70">{cell.note}</p> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
