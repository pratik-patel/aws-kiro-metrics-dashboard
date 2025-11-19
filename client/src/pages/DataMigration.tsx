import * as React from "react";
import Layout from "@/components/Layout";
import { LegacyView } from "@/components/migration/LegacyView";
import { ModernView } from "@/components/migration/ModernView";
import { SpeedComparison } from "@/components/migration/SpeedComparison";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function DataMigration() {
  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground mb-2">
             Platform Modernization Impact
          </h1>
          <p className="text-muted-foreground">
             Direct comparison of data reconciliation workflows: Legacy Batch Processing vs. Real-Time Streaming.
          </p>
        </div>

        {/* Speed Comparison Widget */}
        <SpeedComparison />

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[600px]">
          
          {/* Legacy Side */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="relative"
          >
             <div className="absolute -top-3 left-4 z-10 bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded border border-border uppercase tracking-wider">
               Before
             </div>
             <LegacyView />
          </motion.div>

          {/* Modern Side */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="relative"
          >
             <div className="absolute -top-3 right-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-lg shadow-primary/20 uppercase tracking-wider flex items-center gap-1">
               After <ArrowRight className="w-3 h-3" />
             </div>
             <ModernView />
          </motion.div>

        </div>

        {/* CIO Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-b from-card to-background border border-border/50">
            <CardContent className="p-8 text-center">
              <p className="text-xl font-medium text-foreground max-w-4xl mx-auto leading-relaxed">
                "The modernization eliminates data latency, improves decision accuracy, and unifies operational workflows. This is foundational for real-time risk, compliance automation, and straight-through processing."
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
