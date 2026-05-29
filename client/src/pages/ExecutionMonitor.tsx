import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, StopCircle, CheckCircle2, Clock, PlayCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

const MOCK_LOGS = [
  { time: "14:02:11", level: "INFO", text: "Initializing AI Advisor engine...", color: "text-blue-400" },
  { time: "14:02:12", level: "INFO", text: "Fetching telemetry for 4 Cost Centers...", color: "text-blue-400" },
  { time: "14:02:15", level: "SUCCESS", text: "Loaded 1.45M interactions.", color: "text-teal-400" },
  { time: "14:02:16", level: "INFO", text: "Running model routing evaluation heuristics...", color: "text-blue-400" },
  { time: "14:02:19", level: "WARN", text: "Found 420 instances of suboptimal Claude 4.6 usage.", color: "text-amber-400" },
  { time: "14:02:22", level: "INFO", text: "Cross-referencing against engineer activity profiles...", color: "text-blue-400" },
  { time: "14:02:25", level: "INFO", text: "Compiling optimization recommendations...", color: "text-blue-400" },
  { time: "14:02:28", level: "SUCCESS", text: "Artifact generation complete.", color: "text-teal-400" },
  { time: "14:02:29", level: "INFO", text: "Run completed successfully. Ready for review.", color: "text-green-400" }
];

export default function ExecutionMonitor() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'running' | 'completed' | 'cancelled'>('running');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<typeof MOCK_LOGS>(MOCK_LOGS.slice(0, 1));
  const [eta, setEta] = useState(45);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus('completed');
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5; // Complete in roughly ~6 seconds for the mockup
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'running') return;
    
    // Add logs progressively based on progress %
    const logIndex = Math.min(
      Math.floor((progress / 100) * MOCK_LOGS.length),
      MOCK_LOGS.length - 1
    );
    
    if (logs.length <= logIndex) {
      setLogs(MOCK_LOGS.slice(0, logIndex + 1));
    }

    if (progress % 10 === 0 && eta > 0) {
      setEta(e => Math.max(0, e - 5));
    }
  }, [progress, status, logs.length, eta]);

  useEffect(() => {
    // Auto-scroll to bottom of logs
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCancel = () => setStatus('cancelled');
  const handleRestart = () => {
    setStatus('running');
    setProgress(0);
    setLogs(MOCK_LOGS.slice(0, 1));
    setEta(45);
  };

  const getStageStatus = (stageNum: number) => {
    if (status === 'cancelled') return 'cancelled';
    const thresholds = [0, 30, 70, 95];
    const stageProgress = progress >= thresholds[stageNum];
    const nextStageProgress = stageNum < 3 ? progress >= thresholds[stageNum + 1] : progress >= 100;
    
    if (nextStageProgress) return 'completed';
    if (stageProgress && !nextStageProgress) return 'running';
    return 'waiting';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="dashboard-page-title mb-1">Execution Monitor</h1>
          <p className="dashboard-page-lead">Live console for active runs, jobs, and system tasks.</p>
        </div>
      </div>

      <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden transition-all duration-500">
        {/* Job Header */}
        <div className="border-b border-white/5 bg-black/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {status === 'running' && (
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center">
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                  Running
                </span>
              )}
              {status === 'completed' && (
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" />
                  Completed
                </span>
              )}
              {status === 'cancelled' && (
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center">
                  <StopCircle className="w-3 h-3 mr-1.5" />
                  Cancelled
                </span>
              )}
              <h2 className="dashboard-section-title">AI Advisor Run</h2>
              <span className="text-sm font-mono text-slate-500">run-84f92c1</span>
            </div>
            <p className="text-sm text-slate-400">Scope: Enterprise (All Cost Centers) • Initiated by: Admin</p>
          </div>
          
          <div className="flex gap-2">
            {status === 'running' && (
              <Button onClick={handleCancel} variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                <StopCircle className="w-4 h-4 mr-2" />
                Cancel Run
              </Button>
            )}
            {status !== 'running' && (
              <Button onClick={handleRestart} variant="outline" className="bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white">
                <PlayCircle className="w-4 h-4 mr-2" />
                Restart Run
              </Button>
            )}
            {status === 'completed' && (
              <Button onClick={() => setLocation('/findings')} className="bg-blue-600 hover:bg-blue-500 text-white border-0">
                View Findings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800">
          <div 
            className={`h-full transition-all duration-300 relative ${status === 'cancelled' ? 'bg-red-500' : status === 'completed' ? 'bg-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            style={{ width: `${progress}%` }}
          >
            {status === 'running' && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          {/* Main Console */}
          <div className="col-span-1 lg:col-span-2 p-0 bg-[#05080f]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Live Console Output</h3>
              <span className="text-xs text-slate-500 font-mono">
                {status === 'running' ? `ETA: ~${eta}s` : status === 'completed' ? 'Done in 45s' : 'Halted'}
              </span>
            </div>
            <div ref={scrollRef} className="p-4 font-mono text-xs text-slate-400 space-y-2 h-[400px] overflow-y-auto">
              {logs.map((log, i) => (
                <p key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-slate-500 mr-2">{log.time}</span>
                  <span className={`mr-2 ${log.color}`}>[{log.level}]</span>
                  <span className={log.level === 'SUCCESS' ? 'text-slate-300' : ''}>{log.text}</span>
                </p>
              ))}
              {status === 'running' && (
                <p className="text-slate-500 animate-pulse mt-4">_</p>
              )}
            </div>
          </div>

          {/* Right Panel: Health & Stats */}
          <div className="col-span-1 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-4">Stage Progress</h3>
              <div className="space-y-4">
                {/* Stage 1: Ingestion */}
                <div className={`flex items-center gap-3 transition-opacity ${getStageStatus(0) === 'waiting' ? 'opacity-50' : ''}`}>
                  {getStageStatus(0) === 'completed' ? <CheckCircle2 className="w-5 h-5 text-teal-500" /> : 
                   getStageStatus(0) === 'running' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                   <Clock className="w-5 h-5 text-slate-500" />}
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Data Ingestion</p>
                    <p className={`text-xs ${getStageStatus(0) === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                      {getStageStatus(0) === 'completed' ? 'Completed' : getStageStatus(0) === 'running' ? 'Processing...' : 'Waiting'}
                    </p>
                  </div>
                </div>

                {/* Stage 2: Heuristics */}
                <div className={`flex items-center gap-3 transition-opacity ${getStageStatus(1) === 'waiting' ? 'opacity-50' : ''}`}>
                  {getStageStatus(1) === 'completed' ? <CheckCircle2 className="w-5 h-5 text-teal-500" /> : 
                   getStageStatus(1) === 'running' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                   <Clock className="w-5 h-5 text-slate-500" />}
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Heuristic Analysis</p>
                    <p className={`text-xs ${getStageStatus(1) === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                      {getStageStatus(1) === 'completed' ? 'Completed' : getStageStatus(1) === 'running' ? 'Processing...' : 'Waiting'}
                    </p>
                  </div>
                </div>

                {/* Stage 3: Synthesis */}
                <div className={`flex items-center gap-3 transition-opacity ${getStageStatus(2) === 'waiting' ? 'opacity-50' : ''}`}>
                  {getStageStatus(2) === 'completed' ? <CheckCircle2 className="w-5 h-5 text-teal-500" /> : 
                   getStageStatus(2) === 'running' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                   <Clock className="w-5 h-5 text-slate-500" />}
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Recommendation Synthesis</p>
                    <p className={`text-xs ${getStageStatus(2) === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                      {getStageStatus(2) === 'completed' ? 'Completed' : getStageStatus(2) === 'running' ? 'Processing...' : 'Waiting'}
                    </p>
                  </div>
                </div>

                {/* Stage 4: Artifacts */}
                <div className={`flex items-center gap-3 transition-opacity ${getStageStatus(3) === 'waiting' ? 'opacity-50' : ''}`}>
                  {getStageStatus(3) === 'completed' ? <CheckCircle2 className="w-5 h-5 text-teal-500" /> : 
                   getStageStatus(3) === 'running' ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                   <Clock className="w-5 h-5 text-slate-500" />}
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Artifact Generation</p>
                    <p className={`text-xs ${getStageStatus(3) === 'running' ? 'text-blue-400' : 'text-slate-500'}`}>
                      {getStageStatus(3) === 'completed' ? 'Completed' : getStageStatus(3) === 'running' ? 'Processing...' : 'Waiting'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Run Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Throughput</p>
                  <p className="text-lg font-semibold text-slate-200 font-mono">
                    {status === 'running' ? `${Math.floor(175 + Math.random() * 10)}K/s` : '0K/s'}
                  </p>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Evidences</p>
                  <p className="text-lg font-semibold text-slate-200 font-mono">
                    {Math.floor(progress * 4.2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
