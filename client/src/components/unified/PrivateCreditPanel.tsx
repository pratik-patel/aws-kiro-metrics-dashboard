import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { privateCreditMetrics } from "@/lib/mockData";
import { ArrowUpRight, TrendingUp, DollarSign, Layers } from "lucide-react";

export function PrivateCreditPanel() {
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
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            Private Credit Deep Dive
          </h2>
          <p className="text-muted-foreground text-sm">Fund IV • North America • Direct Lending</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-green-500/20">
            <TrendingUp className="w-4 h-4" />
            +8.4% YTD
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* NAV Movement Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NAV Movement (L12M)</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={privateCreditMetrics.navMovement}>
                <defs>
                  <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  interval={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-4)"
                  fillOpacity={1}
                  fill="url(#colorNav)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Capital Breakdown */}
        <div className="grid grid-rows-2 gap-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Capital Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 mb-2">
                <div>
                  <div className="text-2xl font-bold text-mono-nums">${privateCreditMetrics.capitalBreakdown.drawn}M</div>
                  <div className="text-xs text-muted-foreground">Drawn Capital</div>
                </div>
                <div className="h-8 w-[1px] bg-border" />
                <div>
                  <div className="text-2xl font-bold text-muted-foreground text-mono-nums">${privateCreditMetrics.capitalBreakdown.undrawn}M</div>
                  <div className="text-xs text-muted-foreground">Undrawn</div>
                </div>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-chart-4 h-full rounded-full" 
                  style={{ width: `${(privateCreditMetrics.capitalBreakdown.drawn / (privateCreditMetrics.capitalBreakdown.drawn + privateCreditMetrics.capitalBreakdown.undrawn)) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" /> Vintage Mix
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[100px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={privateCreditMetrics.vintageYearMix} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="year" type="category" hide width={30} tick={{ fontSize: 10 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                    <Bar dataKey="percentage" fill="var(--color-chart-4)" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: 'hsl(var(--muted))' }} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
