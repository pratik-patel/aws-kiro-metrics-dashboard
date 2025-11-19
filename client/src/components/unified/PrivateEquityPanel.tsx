import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { privateEquityMetrics } from "@/lib/mockData";
import { TrendingUp, Award, Briefcase } from "lucide-react";

export function PrivateEquityPanel() {
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
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            Private Equity Portfolio
          </h2>
          <p className="text-muted-foreground text-xs">Global Buyout & Growth • Vintage 2018-2024</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-orange-500/20">
            <TrendingUp className="w-4 h-4" />
            1.8x MOIC
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* NAV Growth */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm h-[180px]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">NAV Growth (5 Year)</CardTitle>
          </CardHeader>
          <CardContent className="h-[130px] px-0 pb-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={privateEquityMetrics.nav_growth}>
                <defs>
                  <linearGradient id="colorPe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip content={<></>} cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-3)"
                  fillOpacity={1}
                  fill="url(#colorPe)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strategy Mix */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
           <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Strategy Diversification
              </CardTitle>
           </CardHeader>
           <CardContent className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={privateEquityMetrics.strategy_mix}>
                    <XAxis dataKey="strategy" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                       {privateEquityMetrics.strategy_mix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        {/* Top Funds List */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
           <CardHeader className="pb-2 pt-4 px-4 border-b border-border/50">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                 <Award className="w-4 h-4" /> Top Performing Funds
              </CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-auto">
              <table className="w-full text-xs">
                 <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                       <th className="text-left p-2 font-medium">Fund</th>
                       <th className="text-right p-2 font-medium">Vintage</th>
                       <th className="text-right p-2 font-medium">Net IRR</th>
                    </tr>
                 </thead>
                 <tbody>
                    {privateEquityMetrics.top_funds.map((fund, i) => (
                       <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-2 font-medium truncate max-w-[120px]">{fund.name}</td>
                          <td className="p-2 text-right text-muted-foreground">{fund.vintage}</td>
                          <td className="p-2 text-right font-mono text-green-500">{fund.irr}%</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
