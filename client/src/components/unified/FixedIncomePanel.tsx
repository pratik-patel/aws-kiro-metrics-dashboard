import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fixedIncomeMetrics } from "@/lib/mockData";
import { Activity, Shield, Clock } from "lucide-react";

export function FixedIncomePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            Fixed Income Analysis
          </h2>
          <p className="text-muted-foreground text-xs">Global Aggregate • Investment Grade Focus</p>
        </div>
        <div className="flex gap-2">
           <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50">
              Yield: <span className="font-mono text-foreground font-bold">{fixedIncomeMetrics.duration_stats.yield_to_maturity}%</span>
           </div>
           <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded border border-border/50">
              Dur: <span className="font-mono text-foreground font-bold">{fixedIncomeMetrics.duration_stats.avg_duration}y</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Yield Curve */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm h-[200px]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
               <Activity className="w-4 h-4" /> Yield Curve
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[150px] px-0 pb-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fixedIncomeMetrics.yield_curve}>
                <XAxis dataKey="tenor" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  formatter={(val: number) => `${val}%`}
                />
                <Line type="monotone" dataKey="yield" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Credit Quality */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
           <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" /> Credit Quality Distribution
              </CardTitle>
           </CardHeader>
           <CardContent className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={fixedIncomeMetrics.credit_quality} layout="vertical" margin={{ left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="rating" type="category" width={30} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                    <Bar dataKey="percent" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} barSize={16} background={{ fill: 'hsl(var(--muted))' }} />
                 </BarChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        {/* Key Stats */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm flex flex-col justify-center p-4 gap-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><Clock className="w-5 h-5" /></div>
              <div>
                 <div className="text-xs text-muted-foreground">Effective Duration</div>
                 <div className="text-xl font-bold font-mono">{fixedIncomeMetrics.duration_stats.avg_duration} yrs</div>
              </div>
           </div>
           <div className="h-[1px] bg-border/50" />
           <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full text-green-500"><Activity className="w-5 h-5" /></div>
              <div>
                 <div className="text-xs text-muted-foreground">Yield to Maturity</div>
                 <div className="text-xl font-bold font-mono">{fixedIncomeMetrics.duration_stats.yield_to_maturity}%</div>
              </div>
           </div>
        </Card>
      </div>
    </motion.div>
  );
}
