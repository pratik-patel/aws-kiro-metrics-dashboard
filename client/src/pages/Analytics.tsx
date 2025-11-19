import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart, ScatterChart, Scatter, ZAxis, BarChart, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, Calendar, Filter, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Mock data generator for different views
const generatePerformanceData = (view: 'YTD' | '1Y' | '3Y') => {
    const baseData = [
        { date: "Jan", portfolio: 4.2, benchmark: 3.8, alpha: 0.4 },
        { date: "Feb", portfolio: 4.5, benchmark: 4.0, alpha: 0.5 },
        { date: "Mar", portfolio: 3.8, benchmark: 3.2, alpha: 0.6 },
        { date: "Apr", portfolio: 5.1, benchmark: 4.5, alpha: 0.6 },
        { date: "May", portfolio: 5.4, benchmark: 4.8, alpha: 0.6 },
        { date: "Jun", portfolio: 6.2, benchmark: 5.2, alpha: 1.0 },
        { date: "Jul", portfolio: 6.5, benchmark: 5.5, alpha: 1.0 },
        { date: "Aug", portfolio: 6.1, benchmark: 5.3, alpha: 0.8 },
        { date: "Sep", portfolio: 5.8, benchmark: 5.0, alpha: 0.8 },
        { date: "Oct", portfolio: 6.5, benchmark: 5.6, alpha: 0.9 },
        { date: "Nov", portfolio: 7.2, benchmark: 6.0, alpha: 1.2 },
        { date: "Dec", portfolio: 7.8, benchmark: 6.4, alpha: 1.4 },
    ];

    if (view === 'YTD') {
        return baseData.slice(0, 6); // Simulate current year progress
    } else if (view === '1Y') {
        return baseData;
    } else {
        // 3Y Simulated view (aggregated quarters for brevity in mockup)
        return [
            { date: "2022", portfolio: 12.5, benchmark: 10.2, alpha: 2.3 },
            { date: "2023", portfolio: 28.4, benchmark: 24.1, alpha: 4.3 },
            { date: "2024", portfolio: 45.2, benchmark: 38.5, alpha: 6.7 },
            { date: "2025", portfolio: 52.8, benchmark: 44.9, alpha: 7.9 },
        ];
    }
};

// Risk data filterable by asset class
const allRiskData = [
  { asset: "Public Equities", vol: 14.2, return: 8.5, size: 45, type: "Public" },
  { asset: "Fixed Income", vol: 5.1, return: 4.2, size: 30, type: "Public" },
  { asset: "Private Equity", vol: 18.5, return: 14.2, size: 20, type: "Private" },
  { asset: "Private Credit", vol: 9.2, return: 9.8, size: 5, type: "Private" },
  { asset: "Real Assets", vol: 7.5, return: 6.2, size: 10, type: "Private" }, // Extra data for filtering demo
  { asset: "Cash", vol: 0.5, return: 3.5, size: 5, type: "Public" },
];

const attributionData = [
  { factor: "Asset Allocation", contribution: 1.2 },
  { factor: "Security Selection", contribution: 0.8 },
  { factor: "Sector Bias", contribution: -0.3 },
  { factor: "Currency", contribution: 0.1 },
  { factor: "Fees", contribution: -0.2 },
];

export default function Analytics() {
  const [timeView, setTimeView] = React.useState<'YTD' | '1Y' | '3Y'>('1Y');
  const [activeFilter, setActiveFilter] = React.useState<'All' | 'Public' | 'Private'>('All');
  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);
  
  const performanceData = React.useMemo(() => generatePerformanceData(timeView), [timeView]);
  
  const filteredRiskData = React.useMemo(() => {
      if (activeFilter === 'All') return allRiskData;
      return allRiskData.filter(item => item.type === activeFilter);
  }, [activeFilter]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Export Started",
        description: "Generating PDF report...",
      });

      const element = document.getElementById("analytics-content");
      if (!element) throw new Error("Analytics element not found");

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        backgroundColor: '#0f172a' // Match dark theme background
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Performance_Analytics_${timeView}.pdf`);

      toast({
        title: "Export Complete",
        description: "Report downloaded successfully.",
        variant: "default",
        className: "bg-green-500 text-white border-none"
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Could not generate PDF report.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20" id="analytics-content">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Performance Analytics</h1>
            <p className="text-muted-foreground mt-2">Attribution, Risk Modeling, and Benchmark Comparison.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-center">
             {/* Time Range Segmented Control */}
             <div className="bg-card/50 border border-border/50 p-1 rounded-lg flex items-center backdrop-blur-sm">
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground flex items-center gap-2 border-r border-border/50 mr-2">
                    <Calendar className="w-3.5 h-3.5" /> Period
                </div>
                {(['YTD', '1Y', '3Y'] as const).map((period) => (
                    <button
                        key={period}
                        onClick={() => setTimeView(period)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 relative",
                            timeView === period ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {timeView === period && (
                            <motion.div
                                layoutId="activePeriod"
                                className="absolute inset-0 bg-primary rounded-md shadow-sm"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">{period}</span>
                    </button>
                ))}
             </div>

             {/* Asset Class Filter Segmented Control */}
             <div className="bg-card/50 border border-border/50 p-1 rounded-lg flex items-center backdrop-blur-sm">
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground flex items-center gap-2 border-r border-border/50 mr-2">
                    <Layers className="w-3.5 h-3.5" /> View
                </div>
                {(['All', 'Public', 'Private'] as const).map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 relative min-w-[60px]",
                            activeFilter === filter ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                         {activeFilter === filter && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-primary rounded-md shadow-sm"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">{filter}</span>
                    </button>
                ))}
             </div>

             {/* Export Button */}
             <Button 
               onClick={handleExport} 
               disabled={isExporting}
               variant="outline"
               size="sm"
               className="gap-2 h-9"
             >
               {isExporting ? (
                 <span className="flex items-center gap-2">
                   <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                   Exporting...
                 </span>
               ) : (
                 <>
                   <Download className="w-4 h-4" /> PDF
                 </>
               )}
             </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <AnalyticsCard title={`Total Return (${timeView})`} value={timeView === '3Y' ? "+52.8%" : timeView === 'YTD' ? "+6.2%" : "+7.8%"} trend="up" sub="+1.4% vs Benchmark" />
           <AnalyticsCard title="Sharpe Ratio" value="1.85" trend="up" sub="Top Decile" />
           <AnalyticsCard title="Portfolio Volatility" value="9.2%" trend="down" sub="-0.5% vs Target" inverse />
           <AnalyticsCard title="Max Drawdown" value="-4.2%" trend="neutral" sub="Last 12 Months" />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Performance vs Benchmark */}
           <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Cumulative Performance vs Benchmark
                 </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceData}>
                       <defs>
                          <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} domain={[0, 'auto']} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                       />
                       <Legend />
                       <Area 
                          type="monotone" 
                          dataKey="portfolio" 
                          name="Portfolio" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#colorPortfolio)" 
                          strokeWidth={2} 
                          animationDuration={1000}
                       />
                       <Line 
                          type="monotone" 
                          dataKey="benchmark" 
                          name="Benchmark (60/40)" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={2} 
                          strokeDasharray="5 5" 
                          dot={false} 
                          animationDuration={1000}
                       />
                    </ComposedChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>

           {/* Performance Attribution */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Return Attribution
                 </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attributionData} layout="vertical" margin={{ left: 20 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="factor" type="category" width={100} tick={{ fontSize: 11 }} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                       <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                          {attributionData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>

           {/* Risk/Return Scatter */}
           <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm font-medium">Risk vs Return Profile</CardTitle>
                 <CardDescription>Bubble size represents allocation weight • Showing: {activeFilter}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                       <XAxis type="number" dataKey="vol" name="Volatility" unit="%" label={{ value: 'Risk (Volatility)', position: 'bottom', offset: 0 }} />
                       <YAxis type="number" dataKey="return" name="Return" unit="%" label={{ value: 'Return', angle: -90, position: 'left' }} />
                       <ZAxis type="number" dataKey="size" range={[100, 1000]} name="Weight" unit="%" />
                       <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                       <Scatter name="Assets" data={filteredRiskData} fill="hsl(var(--primary))">
                          {filteredRiskData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                          ))}
                       </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>
      </div>
    </Layout>
  );
}

function AnalyticsCard({ title, value, trend, sub, inverse }: { title: string, value: string, trend: 'up' | 'down' | 'neutral', sub: string, inverse?: boolean }) {
   const isPositive = trend === 'up';
   // Logic: if inverse is true, Down is good (Green), Up is bad (Red). 
   // If inverse is false (default), Up is good (Green), Down is bad (Red).
   
   let color = "text-muted-foreground";
   if (trend !== 'neutral') {
      if (inverse) {
         color = trend === 'down' ? "text-emerald-500" : "text-red-500";
      } else {
         color = trend === 'up' ? "text-emerald-500" : "text-red-500";
      }
   }

   return (
      <Card className="bg-card/50 border-border/50">
         <CardContent className="p-4">
            <div className="text-sm text-muted-foreground font-medium mb-2">{title}</div>
            <div className="flex items-end justify-between">
               <div className="text-2xl font-bold font-mono">{value}</div>
               {trend !== 'neutral' ? (
                  trend === 'up' ? <ArrowUpRight className={`w-4 h-4 ${color}`} /> : <ArrowDownRight className={`w-4 h-4 ${color}`} />
               ) : (
                  <Activity className="w-4 h-4 text-muted-foreground" />
               )}
            </div>
            <div className={`text-xs mt-1 ${color}`}>{sub}</div>
         </CardContent>
      </Card>
   )
}
