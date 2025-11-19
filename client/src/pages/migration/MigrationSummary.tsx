import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { migrationKPIs } from "@/lib/migrationMockData";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function MigrationSummary() {
  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
           <Link href="/migration-workspace">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
           </Link>
           <div>
             <h1 className="text-3xl font-display font-bold tracking-tight">Migration Impact Report</h1>
             <p className="text-muted-foreground">Executive Summary for Global Private Credit Migration</p>
           </div>
        </div>

        {/* Hero KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <KpiCard label="Latency Improvement" value={migrationKPIs.latencyImprovement} icon={<Zap className="w-6 h-6 text-yellow-500" />} />
           <KpiCard label="Data Quality Uplift" value={migrationKPIs.dataQualityUplift} icon={<TrendingUp className="w-6 h-6 text-green-500" />} />
           <KpiCard label="Cost Reduction" value={migrationKPIs.costReduction} icon={<TrendingDown className="w-6 h-6 text-blue-500" />} />
           <KpiCard label="Legacy Systems Retired" value={migrationKPIs.legacyRetired} icon={<CheckCircle className="w-6 h-6 text-purple-500" />} />
        </div>

        {/* Narrative Section */}
        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-card to-background border-border/50">
           <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Strategic Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div>
                    <h4 className="font-medium text-primary mb-2">Operational Efficiency</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Automated pipelines have reduced manual reconciliation efforts by 85%, allowing the Data Ops team to focus on exceptions rather than routine processing.
                    </p>
                 </div>
                 <div>
                    <h4 className="font-medium text-primary mb-2">Decision Velocity</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Investment teams now access Private Credit NAV data in real-time (vs T+2), enabling faster deployment of undrawn capital and more accurate risk modeling.
                    </p>
                 </div>
                 <div>
                    <h4 className="font-medium text-primary mb-2">Compliance Confidence</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Full end-to-end lineage and automated DQ firewalls ensure 100% traceability for regulatory reporting, eliminating audit findings related to data provenance.
                    </p>
                 </div>
              </div>
           </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8">
           <Link href="/unified-portfolio">
              <Button size="lg" className="bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                 Return to Portfolio Dashboard
              </Button>
           </Link>
        </div>
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
   return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative group hover:border-primary/50 transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>
         <CardContent className="p-6">
            <div className="text-sm text-muted-foreground font-medium mb-2">{label}</div>
            <div className="text-4xl font-display font-bold tracking-tight text-foreground">{value}</div>
         </CardContent>
      </Card>
   )
}
