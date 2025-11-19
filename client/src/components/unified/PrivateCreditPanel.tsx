import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { privateCreditMetrics, privateCreditFunds } from "@/lib/mockData";
import { TrendingUp, DollarSign, Layers, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function PrivateCreditPanel() {
  const drawnMillions = (privateCreditMetrics.capital_breakdown.drawn / 1000000).toFixed(0);
  const undrawnMillions = (privateCreditMetrics.capital_breakdown.undrawn / 1000000).toFixed(0);

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
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            Private Credit Deep Dive
          </h2>
          <p className="text-muted-foreground text-xs">Fund IV • North America • Direct Lending</p>
        </div>
        <Link 
          href="/private-credit"
          className="text-xs flex items-center gap-1 text-primary hover:underline cursor-pointer"
        >
          View Full Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Left Column: Key Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* NAV Card */}
          <Card className="col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">NAV Movement (L12M)</CardTitle>
            </CardHeader>
            <CardContent className="h-[80px] px-0 pb-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={privateCreditMetrics.nav_movement_monthly}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<></>} cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="nav"
                    stroke="var(--color-chart-4)"
                    fillOpacity={1}
                    fill="url(#colorNav)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Drawn Capital */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
             <CardContent className="p-4 flex flex-col justify-center h-full">
                <div className="text-xs text-muted-foreground mb-1">Drawn</div>
                <div className="text-lg font-bold font-mono text-foreground">${drawnMillions}M</div>
                <div className="w-full bg-muted/50 h-1 mt-2 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-[80%]" />
                </div>
             </CardContent>
          </Card>

           {/* Undrawn Capital */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
             <CardContent className="p-4 flex flex-col justify-center h-full">
                <div className="text-xs text-muted-foreground mb-1">Undrawn</div>
                <div className="text-lg font-bold font-mono text-muted-foreground">${undrawnMillions}M</div>
                <div className="w-full bg-muted/50 h-1 mt-2 rounded-full overflow-hidden">
                   <div className="bg-muted-foreground/30 h-full w-[20%]" />
                </div>
             </CardContent>
          </Card>
          
          {/* Vintage Mix Chart */}
          <Card className="col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
             <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">Vintage Exposure</CardTitle>
             </CardHeader>
             <CardContent className="h-[80px] px-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={privateCreditMetrics.vintage_year_mix} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="vintage" type="category" hide width={30} tick={{ fontSize: 10 }} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', fontSize: '12px' }} />
                        <Bar dataKey="percent" fill="var(--color-chart-4)" radius={[0, 2, 2, 0]} barSize={16} background={{ fill: 'hsl(var(--muted))' }} />
                    </BarChart>
                 </ResponsiveContainer>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Underlying Funds Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
           <CardHeader className="pb-2 pt-4 px-4 border-b border-border/50">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Underlying Funds</CardTitle>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-auto">
              <table className="w-full text-xs">
                 <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                       <th className="text-left p-2 font-medium">Fund Name</th>
                       <th className="text-right p-2 font-medium">Vintage</th>
                       <th className="text-right p-2 font-medium">NAV</th>
                       <th className="text-right p-2 font-medium">IRR</th>
                    </tr>
                 </thead>
                 <tbody>
                    {privateCreditFunds.map((fund, i) => (
                       <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-2 font-medium truncate max-w-[120px]">{fund.name}</td>
                          <td className="p-2 text-right text-muted-foreground">{fund.vintage}</td>
                          <td className="p-2 text-right font-mono">${(fund.nav / 1000000).toFixed(1)}M</td>
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
