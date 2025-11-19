import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function SpeedComparison() {
  return (
    <div className="w-full max-w-md mx-auto bg-card/30 backdrop-blur border border-border/50 rounded-xl p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-widest">Performance Benchmark</h3>
      
      <div className="space-y-6">
        {/* Legacy */}
        <div className="space-y-2">
           <div className="flex justify-between text-xs">
             <span className="text-muted-foreground">Legacy Infrastructure</span>
             <span className="font-mono text-red-400">5.2s</span>
           </div>
           <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 5.2, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
               className="h-full bg-red-500/50"
             />
           </div>
        </div>

        {/* Modern */}
        <div className="space-y-2">
           <div className="flex justify-between text-xs">
             <span className="text-foreground font-medium">Modern Platform</span>
             <span className="font-mono text-emerald-400 font-bold">0.8s</span>
           </div>
           <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 0.8, ease: "easeOut", repeat: Infinity, repeatDelay: 5.4 }}
               className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
             />
           </div>
        </div>
      </div>
    </div>
  );
}
