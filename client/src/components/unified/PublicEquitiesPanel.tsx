import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEquitiesMetrics } from "@/lib/mockData";
import { TrendingUp, Globe, Briefcase } from "lucide-react";

export function PublicEquitiesPanel() {
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
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            Public Equities Overview
          </h2>
          <p className="text-muted-foreground text-xs">Global Large Cap • Active Management</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-green-500/20">
            <TrendingUp className="w-4 h-4" />
            +22.4% YTD
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Performance Chart */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm h-[180px]">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Portfolio Performance (Indexed)</CardTitle>
          </CardHeader>
          <CardContent className="h-[130px] px-0 pb-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={publicEquitiesMetrics.performance_monthly}>
                <defs>
                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<></>} cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  fillOpacity={1}
                  fill="url(#colorPerf)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
           <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" /> Sector Allocation
              </CardTitle>
           </CardHeader>
           <CardContent className="h-[200px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie 
                       data={publicEquitiesMetrics.sector_allocation} 
                       dataKey="value" 
                       nameKey="name" 
                       cx="50%" 
                       cy="50%" 
                       innerRadius={40} 
                       outerRadius={70} 
                    >
                       {publicEquitiesMetrics.sector_allocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                       ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                      formatter={(val: number) => `${val}%`}
                    />
                 </PieChart>
              </ResponsiveContainer>
              <div className="text-xs space-y-1 min-w-[100px]">
                 {publicEquitiesMetrics.sector_allocation.slice(0,4).map((sector, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                       <span>{sector.name}</span>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        {/* Top Holdings Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
           <CardHeader className="pb-2 pt-4 px-4 border-b border-border/50">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                 <Briefcase className="w-4 h-4" /> Top Holdings
              </CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-auto">
              <table className="w-full text-xs">
                 <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                       <th className="text-left p-2 font-medium">Symbol</th>
                       <th className="text-right p-2 font-medium">Weight</th>
                       <th className="text-right p-2 font-medium">Return</th>
                    </tr>
                 </thead>
                 <tbody>
                    {publicEquitiesMetrics.top_holdings.map((stock, i) => (
                       <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-2 font-medium">
                             <div className="font-bold">{stock.symbol}</div>
                             <div className="text-[10px] text-muted-foreground truncate max-w-[80px]">{stock.name}</div>
                          </td>
                          <td className="p-2 text-right font-mono">{stock.weight}%</td>
                          <td className="p-2 text-right font-mono text-green-500">+{stock.return}%</td>
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
