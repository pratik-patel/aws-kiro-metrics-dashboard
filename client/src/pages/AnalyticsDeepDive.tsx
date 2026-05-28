import { BarChart3, PieChart, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend, Treemap, ScatterChart, Scatter } from "recharts";
import { MOCK_DATA } from "@/lib/mock-data";

export default function AnalyticsDeepDive() {
  const scatterData = MOCK_DATA.engineers.map(e => ({
    name: e.name,
    consumption: parseFloat(e.consumption.replace('K', '')),
    days: e.activeDays
  }));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#0a0f18]">
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-[#0a0f18] shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics Deep Dive</h1>
              <p className="text-slate-400">Complex cross-dimensional analysis and ad-hoc reporting.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Raw Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 border-b border-white/5 bg-[#0c1220]/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto">
          <Tabs defaultValue="consumption" className="w-full">
            <TabsList className="bg-transparent border-none p-0 h-auto gap-6 justify-start">
              {['Consumption', 'Ownership', 'Models & Tools', 'Use Cases', 'Interactions'].map(tab => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase().replace(' & ', '-')}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none px-1 py-4 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="py-6 max-w-[1600px] mx-auto">
              <TabsContent value="consumption" className="m-0 space-y-6">
                
                {/* Daily AI Consumption Trend (Area Chart) */}
                <Card className="bg-[#111827] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-200">Daily AI Consumption Trend</CardTitle>
                    <CardDescription className="text-slate-400">Overall enterprise usage across the last 10 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DATA.dailyTrend}>
                        <defs>
                          <linearGradient id="colorConsumptionArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Area type="monotone" dataKey="consumption" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorConsumptionArea)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spend Concentration Treemap */}
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Spend Concentration</CardTitle>
                      <CardDescription className="text-slate-400">Cost Center &gt; Team</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={[
                            { name: 'Payments Trans.', size: 542, fill: '#1e40af' },
                            { name: 'AI Delivery Accel.', size: 480, fill: '#3730a3' },
                            { name: 'Platform Rel.', size: 245, fill: '#0f766e' },
                            { name: 'Retail Intel.', size: 185, fill: '#0369a1' }
                          ]}
                          dataKey="size"
                          aspectRatio={4 / 3}
                          stroke="rgba(255,255,255,0.1)"
                        >
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                        </Treemap>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Client Type Mix */}
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Client Type Mix</CardTitle>
                      <CardDescription className="text-slate-400">By Cost Center</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.clientMix} layout="vertical" margin={{ left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} width={80} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="ide" stackId="a" fill="#3b82f6" name="IDE" />
                          <Bar dataKey="cli" stackId="a" fill="#8b5cf6" name="CLI" />
                          <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Plugin" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ownership" className="m-0 space-y-6">
                <Card className="bg-[#111827] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-200">Active Days vs Consumption by Engineer</CardTitle>
                    <CardDescription className="text-slate-400">Identifying high-consumption low-activity outliers.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" dataKey="days" name="Active Days" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                        <YAxis type="number" dataKey="consumption" name="Consumption (K)" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Scatter name="Engineers" data={scatterData} fill="#14b8a6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {['models-tools', 'use-cases', 'interactions'].map(tab => (
                <TabsContent key={tab} value={tab} className="m-0 text-center py-20 text-slate-500 bg-[#111827] border border-white/5 rounded-lg shadow-lg">
                  <BarChart3 className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                  Detailed visualization for {tab.replace('-', ' ')} will load here.
                </TabsContent>
              ))}

            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
