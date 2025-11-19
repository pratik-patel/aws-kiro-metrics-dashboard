import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { executionLogs } from "@/lib/migrationMockData";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, Terminal, CheckCircle2, Database } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function MigrationExecution() {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("Idle");
  const [logIndex, setLogIndex] = React.useState(0);

  const startExecution = () => {
    setStatus("Running");
    setProgress(0);
    setLogIndex(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("Completed");
          return 100;
        }
        return prev + 1;
      });
      
      // Reveal logs
      setLogIndex(prev => prev < executionLogs.length ? prev + 0.1 : prev);

    }, 50);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Execution Simulator</h1>
            <p className="text-sm text-muted-foreground">MP-2025-001: Batch_42 Execution</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="gap-2" onClick={() => { setProgress(0); setStatus("Idle"); setLogIndex(0); }}>
                <RefreshCw className="w-4 h-4" /> Reset
             </Button>
             <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={startExecution} disabled={status === "Running" || status === "Completed"}>
                {status === "Running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
                {status === "Running" ? "Processing..." : "Run Pipeline"}
             </Button>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
           <CardContent className="pt-6">
              <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium">Total Pipeline Progress</span>
                 <span className="font-mono text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                 />
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground font-mono">
                 <div className="flex gap-4">
                    <span>Extract: {progress > 30 ? "Done" : "Pending"}</span>
                    <span>Transform: {progress > 60 ? "Done" : "Pending"}</span>
                    <span>Load: {progress === 100 ? "Done" : "Pending"}</span>
                 </div>
                 <div>ETA: {status === "Running" ? "00:00:12" : "--:--:--"}</div>
              </div>
           </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Live Logs */}
           <Card className="lg:col-span-2 border-border/50 bg-[#0c0c0c] text-green-500 font-mono text-xs shadow-2xl">
              <CardHeader className="border-b border-white/10 py-3">
                 <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Live Console Output
                 </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] overflow-auto p-4 space-y-2">
                 {executionLogs.slice(0, Math.floor(logIndex + 1)).map((log, i) => (
                    <div key={i} className="flex gap-4 border-b border-white/5 pb-1">
                       <span className="opacity-50 select-none">[{log.time}]</span>
                       <span className={
                          log.level === "INFO" ? "text-blue-400" :
                          log.level === "WARN" ? "text-yellow-400" :
                          log.level === "SUCCESS" ? "text-emerald-400 font-bold" : "text-red-400"
                       }>{log.level}</span>
                       <span className="text-gray-300">{log.message}</span>
                    </div>
                 ))}
                 {status === "Running" && (
                    <div className="animate-pulse">_</div>
                 )}
              </CardContent>
           </Card>

           {/* Status Panel */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
              <CardHeader>
                 <CardTitle className="text-sm font-medium">Job Health</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                 <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                       <div className="text-sm font-bold">Cluster Healthy</div>
                       <div className="text-xs text-muted-foreground">3/3 Nodes Active</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Database className="w-5 h-5 text-blue-500" />
                    <div>
                       <div className="text-sm font-bold">Throughput</div>
                       <div className="text-xs text-muted-foreground">45,000 records/sec</div>
                    </div>
                 </div>
                 
                 {status === "Completed" && (
                    <div className="mt-8 pt-8 border-t border-border text-center">
                       <div className="mb-4 text-sm text-muted-foreground">Pipeline completed successfully</div>
                       <Link href="/migration-validation">
                          <Button className="w-full">View Validation Report</Button>
                       </Link>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </Layout>
  );
}
