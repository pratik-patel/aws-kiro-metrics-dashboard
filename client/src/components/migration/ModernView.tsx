import * as React from "react";
import { modernReport } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ModernView() {
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(modernReport.trades);

  React.useEffect(() => {
    // Fast loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 0.8s
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const filtered = modernReport.trades.filter(item => 
      item.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trade_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  return (
    <div className="h-full flex flex-col bg-background border border-border rounded-lg shadow-2xl overflow-hidden relative">
       {/* Header */}
      <div className="bg-card/50 backdrop-blur border-b border-border px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm">Real-Time Reconciliation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {modernReport.data_status}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            Latency: {modernReport.latency_ms}ms
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border/50 bg-card/30 flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Instant Search..." 
            className="pl-9 bg-background/50 border-border focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-xs">
            <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Clean: {modernReport.heatmap_summary.clean}
            </div>
             <div className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                Pending: {modernReport.heatmap_summary.pending}
            </div>
             <div className="px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                Issues: {modernReport.heatmap_summary.exceptions}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            >
              <div className="flex flex-col items-center gap-2">
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
                 <span className="text-xs text-muted-foreground font-mono">Synchronizing...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-4 pb-2">
                <div className="col-span-2">ID</div>
                <div className="col-span-4">Asset</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Settlement</div>
              </div>
              
              {filteredData.map((row, i) => (
                <motion.div
                  key={row.trade_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-12 items-center p-3 rounded-md bg-card hover:bg-card/80 border border-transparent hover:border-primary/20 transition-all group cursor-default"
                >
                  <div className="col-span-2 font-mono text-xs text-foreground group-hover:text-primary transition-colors">{row.trade_id}</div>
                  <div className="col-span-4 text-sm font-medium">{row.asset}</div>
                  <div className="col-span-2 text-right font-mono text-xs">{row.quantity.toLocaleString()}</div>
                  <div className="col-span-2 flex justify-center">
                     <span className={cn(
                         "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                         row.status === "Settled" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                     )}>
                       <CheckCircle2 className="w-3 h-3" /> {row.status}
                     </span>
                  </div>
                  <div className="col-span-2 text-right font-mono text-[10px] text-muted-foreground">
                    {row.settlement_date}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Loader2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    )
  }

// Utility class helper since it was missing in the original file
import { cn } from "@/lib/utils";
