import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { complianceRules, reportsList, complianceHistory } from "@/lib/complianceMockData";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  FileCheck
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function ReportingCompliance() {
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
        title: "Report Generation Started",
        description: "Compiling monthly data. This may take a few moments.",
    });
    setTimeout(() => {
        toast({
            title: "Report Ready",
            description: "Monthly CIO Pack (Feb 2025) is ready for download.",
            className: "bg-blue-500 text-white border-none"
        });
    }, 2500);
  };

  const handleFilter = () => {
    toast({
        title: "Filters Applied",
        description: "Showing only high-priority compliance rules.",
    });
  };

  const handleDownload = (name: string) => {
    toast({
        title: "Downloading...",
        description: `Downloading ${name}`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
              Reporting & Compliance
            </h1>
            <p className="text-muted-foreground mt-1">
              Governance dashboard, automated rule checks, and regulatory reporting center.
            </p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" /> Feb 2025
             </Button>
             <Button 
                className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                onClick={handleGenerateReport}
             >
                <FileCheck className="w-4 h-4" /> Generate New Report
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Compliance Monitor */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
               <Card className="bg-emerald-500/10 border-emerald-500/20">
                  <CardContent className="p-4 flex items-center gap-4">
                     <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-emerald-500">4</div>
                        <div className="text-xs text-emerald-500/80 font-medium">Passing Rules</div>
                     </div>
                  </CardContent>
               </Card>
               <Card className="bg-amber-500/10 border-amber-500/20">
                  <CardContent className="p-4 flex items-center gap-4">
                     <div className="p-2 bg-amber-500/20 rounded-full text-amber-500">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-amber-500">1</div>
                        <div className="text-xs text-amber-500/80 font-medium">Warnings</div>
                     </div>
                  </CardContent>
               </Card>
               <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4 flex items-center gap-4">
                     <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                        <ShieldAlert className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-red-500">1</div>
                        <div className="text-xs text-red-500/80 font-medium">Violations</div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Active Rules List */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Compliance Rules</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleFilter}
                  >
                     <Filter className="w-3 h-3 mr-1" /> Filter
                  </Button>
               </CardHeader>
               <CardContent>
                  <div className="space-y-1">
                     {complianceRules.map((rule, i) => (
                        <div key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                           <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                 rule.status === 'Pass' ? 'bg-emerald-500' : 
                                 rule.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                              }`} />
                              <div>
                                 <div className="text-sm font-medium text-foreground">{rule.name}</div>
                                 <div className="text-[10px] text-muted-foreground flex gap-2">
                                    <span>ID: {rule.id}</span>
                                    <span>•</span>
                                    <span>{rule.category}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 text-sm">
                              <div className="text-right">
                                 <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Limit</div>
                                 <div className="font-mono text-muted-foreground">{rule.limit}</div>
                              </div>
                              <div className="text-right w-24">
                                 <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</div>
                                 <div className={`font-mono font-medium ${
                                    rule.status === 'Pass' ? 'text-emerald-500' : 
                                    rule.status === 'Warning' ? 'text-amber-500' : 'text-red-500'
                                 }`}>{rule.current}</div>
                              </div>
                              <Badge variant={rule.status === 'Pass' ? 'outline' : 'destructive'} className="w-20 justify-center">
                                 {rule.status}
                              </Badge>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Compliance Trend */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Violation History (30 Days)</CardTitle>
               </CardHeader>
               <CardContent className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={complianceHistory}>
                        <defs>
                           <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <Tooltip 
                           contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }}
                        />
                        <Area type="monotone" dataKey="violations" stroke="hsl(var(--destructive))" fill="url(#colorViolations)" strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Report Center */}
          <div className="lg:col-span-5 space-y-6">
             <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Report Center
                   </CardTitle>
                   <CardDescription>Generated reports and regulatory filings</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                   <Tabs defaultValue="all" className="w-full">
                      <TabsList className="w-full grid grid-cols-3 mb-4">
                         <TabsTrigger value="all">All</TabsTrigger>
                         <TabsTrigger value="investor">Investor</TabsTrigger>
                         <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
                      </TabsList>
                      
                      <div className="space-y-2">
                         {reportsList.map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-all group">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px]">
                                     {report.type}
                                  </div>
                                  <div>
                                     <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{report.name}</div>
                                     <div className="text-[10px] text-muted-foreground flex gap-2">
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.size}</span>
                                     </div>
                                  </div>
                               </div>
                               <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDownload(report.name)}
                               >
                                  <Download className="w-4 h-4" />
                               </Button>
                            </div>
                         ))}
                      </div>
                   </Tabs>
                </CardContent>
             </Card>
          </div>

        </div>
      </div>
    </Layout>
  );
}
