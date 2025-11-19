import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validationStats } from "@/lib/migrationMockData";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function ValidationConsole() {
  return (
    <Layout>
       <div className="space-y-6 pb-20">
         <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Data Quality & Validation</h1>
            <p className="text-sm text-muted-foreground">Post-Migration Reconciliation Report</p>
          </div>
          <Link href="/migration-lineage">
             <Button variant="outline" className="gap-2">
                Data Lineage <ArrowRight className="w-4 h-4" />
             </Button>
          </Link>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4">
           <StatCard label="Records Processed" value={validationStats.totalRows.toLocaleString()} icon={<Check className="w-4 h-4 text-blue-500" />} />
           <StatCard label="Success Rate" value="99.9%" sub="18 Failures" icon={<ShieldCheck className="w-4 h-4 text-green-500" />} />
           <StatCard label="Null Values" value={validationStats.nullCount.toString()} sub="Acceptable Threshold" icon={<AlertTriangle className="w-4 h-4 text-yellow-500" />} />
           <StatCard label="Confidence Score" value={validationStats.confidenceScore.toString()} sub="High Integrity" icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Rules Table */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm font-medium uppercase tracking-wider">DQ Rule Validation</CardTitle>
              </CardHeader>
              <CardContent>
                 <table className="w-full text-sm">
                    <thead>
                       <tr className="border-b border-border/50 text-muted-foreground">
                          <th className="text-left py-2 font-medium">Rule Name</th>
                          <th className="text-left py-2 font-medium">Status</th>
                          <th className="text-right py-2 font-medium">Score</th>
                       </tr>
                    </thead>
                    <tbody>
                       {validationStats.dqRules.map((rule, i) => (
                          <tr key={i} className="border-b border-border/50 last:border-0">
                             <td className="py-3 font-medium">{rule.name}</td>
                             <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs border ${
                                   rule.status === 'Pass' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                   'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                   {rule.status}
                                </span>
                             </td>
                             <td className="py-3 text-right font-mono">{rule.score}%</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </CardContent>
           </Card>

           {/* Outlier Visualization */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm font-medium uppercase tracking-wider">Statistical Outliers</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                       { bucket: "0-10k", count: 450 },
                       { bucket: "10k-50k", count: 320 },
                       { bucket: "50k-100k", count: 150 },
                       { bucket: "100k-500k", count: 80 },
                       { bucket: ">500k (Outliers)", count: 12, fill: "hsl(var(--destructive))" }
                    ]}>
                       <XAxis dataKey="bucket" tick={{fontSize: 10}} />
                       <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                       />
                       <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>
       </div>
    </Layout>
  );
}

function StatCard({ label, value, sub, icon }: { label: string, value: string, sub?: string, icon: React.ReactNode }) {
   return (
      <Card className="bg-card/50 border-border/50">
         <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
               <span className="text-sm text-muted-foreground font-medium">{label}</span>
               {icon}
            </div>
            <div className="text-2xl font-bold font-mono">{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
         </CardContent>
      </Card>
   )
}
