import { Activity, PlayCircle, Loader2, StopCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExecutionMonitor() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Execution Monitor</h1>
          <p className="text-slate-400">Live console for active runs, jobs, and system tasks.</p>
        </div>
      </div>

      <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
        {/* Job Header */}
        <div className="border-b border-white/5 bg-black/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center">
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                Running
              </span>
              <h2 className="text-xl font-semibold text-slate-200">AI Advisor Run</h2>
              <span className="text-sm font-mono text-slate-500">run-84f92c1</span>
            </div>
            <p className="text-sm text-slate-400">Scope: Enterprise (All Cost Centers) • Initiated by: Admin</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300">
              <StopCircle className="w-4 h-4 mr-2" />
              Cancel Run
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[65%] transition-all duration-1000 relative">
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          {/* Main Console */}
          <div className="col-span-1 lg:col-span-2 p-0 bg-[#05080f]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Live Console Output</h3>
              <span className="text-xs text-slate-500 font-mono">ETA: ~45s</span>
            </div>
            <div className="p-4 font-mono text-xs text-slate-400 space-y-2 h-[400px] overflow-y-auto">
              <p><span className="text-slate-500">14:02:11</span> <span className="text-blue-400">[INFO]</span> Initializing AI Advisor engine...</p>
              <p><span className="text-slate-500">14:02:12</span> <span className="text-blue-400">[INFO]</span> Fetching telemetry for 4 Cost Centers...</p>
              <p><span className="text-slate-500">14:02:15</span> <span className="text-teal-400">[SUCCESS]</span> Loaded 1.45M interactions.</p>
              <p><span className="text-slate-500">14:02:16</span> <span className="text-blue-400">[INFO]</span> Running model routing evaluation heuristics...</p>
              <p><span className="text-slate-500">14:02:22</span> <span className="text-amber-400">[WARN]</span> Found 420 instances of suboptimal Claude Opus 4.6 usage.</p>
              <p><span className="text-slate-500">14:02:23</span> <span className="text-blue-400">[INFO]</span> Cross-referencing against engineer activity profiles...</p>
              <p className="text-slate-200 animate-pulse"><span className="text-slate-500">14:02:28</span> <span className="text-blue-400">[INFO]</span> Compiling optimization recommendations...</p>
            </div>
          </div>

          {/* Right Panel: Health & Stats */}
          <div className="col-span-1 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">Stage Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Data Ingestion</p>
                    <p className="text-xs text-slate-500">Completed in 4s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Heuristic Analysis</p>
                    <p className="text-xs text-slate-500">Completed in 8s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Recommendation Synthesis</p>
                    <p className="text-xs text-blue-400">Processing...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Artifact Generation</p>
                    <p className="text-xs text-slate-500">Waiting</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Run Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Throughput</p>
                  <p className="text-lg font-semibold text-slate-200 font-mono">180K/s</p>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Evidences</p>
                  <p className="text-lg font-semibold text-slate-200 font-mono">420</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
