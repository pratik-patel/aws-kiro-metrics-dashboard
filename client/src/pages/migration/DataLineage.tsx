import * as React from "react";
import Layout from "@/components/Layout";
import { lineageNodes } from "@/lib/migrationMockData";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function DataLineage() {
  return (
    <Layout>
      <div className="space-y-6 pb-20 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">End-to-End Lineage</h1>
            <p className="text-sm text-muted-foreground">Visualization of data flow from Legacy Db2 to Portfolio Dashboard.</p>
          </div>
          <Link href="/migration-summary">
             <Button className="gap-2">
                <FileText className="w-4 h-4" /> View Impact Report
             </Button>
          </Link>
        </div>

        <div className="flex-1 border border-border/50 rounded-xl bg-[#0F172A] relative overflow-hidden shadow-inner">
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
           </div>

           {/* Nodes */}
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[1000px] h-[400px]">
                 {/* Connecting Lines (Hardcoded SVGs for demo) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <path d="M 100 200 C 150 200, 150 200, 250 200" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" strokeDasharray="4" />
                    <path d="M 350 200 C 400 200, 400 200, 500 200" stroke="#3b82f6" strokeWidth="2" fill="none" className="animate-pulse" />
                    <path d="M 600 200 C 650 200, 650 200, 750 200" stroke="#3b82f6" strokeWidth="2" fill="none" className="animate-pulse" />
                    <path d="M 850 200 C 900 200, 900 150, 1000 150" stroke="#10b981" strokeWidth="2" fill="none" />
                    <path d="M 850 200 C 900 200, 900 250, 1000 250" stroke="#10b981" strokeWidth="2" fill="none" />
                 </svg>

                 {/* Node Elements */}
                 {lineageNodes.map((node) => (
                    <motion.div 
                       key={node.id}
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="absolute p-4 rounded-lg border bg-card shadow-xl flex flex-col items-center gap-2 w-40 text-center"
                       style={{ 
                          left: node.position.x, 
                          top: node.position.y + 100, // Center vertically
                          borderColor: node.type === 'source' ? 'hsl(var(--border))' : 
                                       node.type === 'target' ? '#3b82f6' :
                                       node.type === 'consumer' ? '#10b981' : 'hsl(var(--primary))'
                       }}
                    >
                       <div className={`w-3 h-3 rounded-full ${
                          node.type === 'source' ? 'bg-gray-500' : 
                          node.type === 'target' ? 'bg-blue-500' :
                          node.type === 'consumer' ? 'bg-green-500' : 'bg-primary'
                       }`} />
                       <span className="text-xs font-bold">{node.label}</span>
                       <span className="text-[10px] text-muted-foreground uppercase">{node.type}</span>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
