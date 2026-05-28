export default function ExecutionMonitor() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Execution Monitor</h1>
        <p className="text-slate-400">Live console for active runs, jobs, and system tasks.</p>
      </div>
      <div className="h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
        <p className="text-slate-500">Task Queue & Traces Placeholder</p>
      </div>
    </div>
  );
}
