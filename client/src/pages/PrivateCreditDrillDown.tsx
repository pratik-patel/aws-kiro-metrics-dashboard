import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { privateCreditFunds, cashFlowWaterfall, privateCreditMetrics } from "@/lib/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine, ComposedChart, Line } from "recharts";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PrivateCreditDrillDown() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      toast({
        title: "Export Started",
        description: "Generating PDF report for Private Credit Fund IV...",
      });

      // Use ref instead of getElementById
      const element = contentRef.current;
      if (!element) throw new Error("Report content not found");

      // Small delay to ensure UI is stable and animations have completed
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        backgroundColor: '#0f172a', // Match dark theme background
        ignoreElements: (element) => {
            return element.classList.contains('no-print');
        },
        onclone: (clonedDoc) => {
           // Ensure background colors are preserved in the clone if needed
           const clonedElement = clonedDoc.body.querySelector('.space-y-6');
           if (clonedElement) {
               // Force specific styles if necessary
           }
        }
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
      pdf.save("Private_Credit_Fund_IV_Report.pdf");

      toast({
        title: "Export Complete",
        description: "The report has been downloaded successfully.",
        variant: "default",
        className: "bg-green-500 text-white border-none"
      });
    } catch (error) {
      console.error("Export failed:", error);
      // More descriptive error for the user if possible
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during PDF generation";
      
      toast({
        title: "Export Failed",
        description: `Could not generate PDF report: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20" ref={contentRef}>
        {/* Header with Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
               <Link href="/unified-portfolio" className="hover:text-foreground transition-colors flex items-center gap-1">
                   <ArrowLeft className="w-3 h-3" /> Back to Dashboard
               </Link>
               <span>/</span>
               <span className="text-foreground font-medium">Private Credit Fund IV</span>
             </div>
             <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
               Private Credit • North America Direct Lending
             </h1>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed no-print"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" /> Export PDF
              </>
            )}
          </button>
        </div>

        {/* Top Summary Ribbon */}
        <div className="grid grid-cols-4 gap-4">
           <SummaryCard label="Total Commitment" value="$100.0M" sub="Vintage 2019" />
           <SummaryCard label="Drawn Capital" value="80.0%" sub="$80.0M Called" />
           <SummaryCard label="NAV Δ (QoQ)" value="+2.4%" sub="vs Benchmark +1.8%" positive />
           <SummaryCard label="Net IRR" value="11.2%" sub="Inception to Date" positive />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Waterfall Chart */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-lg font-medium">Cash Flow Waterfall</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowWaterfall}>
                       <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                       <YAxis hide />
                       <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} 
                       />
                       <Bar dataKey="value">
                          {cashFlowWaterfall.map((entry, index) => (
                             <Cell 
                                key={`cell-${index}`} 
                                fill={
                                   entry.type === 'positive' ? 'hsl(var(--chart-2))' : 
                                   entry.type === 'negative' ? 'hsl(var(--destructive))' : 
                                   'hsl(var(--primary))'
                                } 
                             />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>

           {/* Vintage Performance */}
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-lg font-medium">Vintage Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={privateCreditFunds} layout="vertical" margin={{ left: 40 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="vintage" type="category" width={40} tick={{ fontSize: 12 }} />
                       <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                       />
                       <Bar dataKey="irr" name="IRR %" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </CardContent>
           </Card>
        </div>

        {/* Quarterly NAV Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
           <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Quarterly NAV Progression</CardTitle>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    <Calendar className="w-3 h-3" /> Last Updated: Jan 31, 2025
                 </div>
              </div>
           </CardHeader>
           <CardContent>
              <table className="w-full text-sm">
                 <thead className="bg-muted/30 border-b border-border/50">
                    <tr>
                       <th className="text-left p-3 font-medium text-muted-foreground">Quarter</th>
                       <th className="text-right p-3 font-medium text-muted-foreground">Beginning NAV</th>
                       <th className="text-right p-3 font-medium text-muted-foreground">Capital Called</th>
                       <th className="text-right p-3 font-medium text-muted-foreground">Distributions</th>
                       <th className="text-right p-3 font-medium text-muted-foreground">Appreciation</th>
                       <th className="text-right p-3 font-medium text-muted-foreground">Ending NAV</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/10">
                       <td className="p-3 font-mono">Q4 2024</td>
                       <td className="p-3 text-right font-mono text-muted-foreground">$142.0M</td>
                       <td className="p-3 text-right font-mono">$5.0M</td>
                       <td className="p-3 text-right font-mono text-red-400">($2.0M)</td>
                       <td className="p-3 text-right font-mono text-green-400">+$3.0M</td>
                       <td className="p-3 text-right font-mono font-bold">$148.0M</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/10">
                       <td className="p-3 font-mono">Q3 2024</td>
                       <td className="p-3 text-right font-mono text-muted-foreground">$138.0M</td>
                       <td className="p-3 text-right font-mono">$2.0M</td>
                       <td className="p-3 text-right font-mono text-red-400">($0.5M)</td>
                       <td className="p-3 text-right font-mono text-green-400">+$2.5M</td>
                       <td className="p-3 text-right font-mono font-bold">$142.0M</td>
                    </tr>
                     <tr className="border-b border-border/50 hover:bg-muted/10">
                       <td className="p-3 font-mono">Q2 2024</td>
                       <td className="p-3 text-right font-mono text-muted-foreground">$131.0M</td>
                       <td className="p-3 text-right font-mono">$4.0M</td>
                       <td className="p-3 text-right font-mono text-red-400">($1.0M)</td>
                       <td className="p-3 text-right font-mono text-green-400">+$4.0M</td>
                       <td className="p-3 text-right font-mono font-bold">$138.0M</td>
                    </tr>
                 </tbody>
              </table>
           </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function SummaryCard({ label, value, sub, positive }: { label: string, value: string, sub: string, positive?: boolean }) {
   return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
         <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className={cn("text-2xl font-bold font-display tracking-tight", positive && "text-green-500")}>{value}</div>
            <div className="text-xs text-muted-foreground/70 mt-1">{sub}</div>
         </CardContent>
      </Card>
   )
}
