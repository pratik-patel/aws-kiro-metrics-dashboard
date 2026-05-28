import { BarChart3, PieChart, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend, Treemap, ScatterChart, Scatter } from "recharts";
import { MOCK_DATA } from "@/lib/mock-data";

// Custom Treemap Content to ensure text visibility
const CustomizedTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? payload.fill : "none",
          stroke: 'rgba(255,255,255,0.1)',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {
        width > 50 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#f8fafc"
            fontSize={12}
            fontWeight="500"
          >
            {name}
          </text>
        )
      }
    </g>
  );
};

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
                  value={tab.toLowerCase().replace(' & ', '-').replace(' ', '-')}
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
                        <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                        <YAxis stroke="#cbd5e1" fontSize={12} />
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
                          content={<CustomizedTreemapContent />}
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
                          <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
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
                        <XAxis type="number" dataKey="days" name="Active Days" stroke="#cbd5e1" fontSize={12} />
                        <YAxis type="number" dataKey="consumption" name="Consumption (K)" stroke="#cbd5e1" fontSize={12} />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Scatter name="Engineers" data={scatterData} fill="#14b8a6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="models-tools" className="m-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Model Mix by Cost Center</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.clientMix} layout="vertical" margin={{ left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="ide" stackId="a" fill="#8b5cf6" name="Claude 4.6" />
                          <Bar dataKey="cli" stackId="a" fill="#3b82f6" name="GPT-4o" />
                          <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Gemini 1.5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Plugin vs MCP Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'GitHub', plugin: 125, mcp: 115 },
                          { name: 'Jira', plugin: 85, mcp: 0 },
                          { name: 'Browser', plugin: 45, mcp: 0 },
                          { name: 'DB Schema', plugin: 0, mcp: 90 },
                        ]} layout="vertical" margin={{ left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="plugin" fill="#6366f1" name="Plugin" />
                          <Bar dataKey="mcp" fill="#a855f7" name="MCP" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="use-cases" className="m-0 space-y-6">
                <Card className="bg-[#111827] border-white/5 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-slate-200">Use Case x Model Heatmap</CardTitle>
                    <CardDescription className="text-slate-400">Distribution of model usage across different development contexts.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="category" dataKey="model" name="Model" stroke="#cbd5e1" fontSize={12} allowDuplicatedCategory={false} />
                        <YAxis type="category" dataKey="useCase" name="Use Case" stroke="#cbd5e1" fontSize={12} allowDuplicatedCategory={false} />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Scatter name="Usage Heat" data={[
                          { useCase: 'legacy-mod', model: 'Claude 4.6', value: 850 },
                          { useCase: 'legacy-mod', model: 'GPT-4o', value: 200 },
                          { useCase: 'legacy-mod', model: 'Gemini 1.5', value: 50 },
                          { useCase: 'spec-orch', model: 'Claude 4.6', value: 400 },
                          { useCase: 'spec-orch', model: 'GPT-4o', value: 600 },
                          { useCase: 'retail-analytics', model: 'Claude 4.6', value: 300 },
                          { useCase: 'retail-analytics', model: 'Gemini 1.5', value: 700 },
                          { useCase: 'platform-hard', model: 'Claude 4.6', value: 950 },
                        ]} fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </section>

              {/* SECTION 4: Outliers & Inefficiencies */}
              <section className="space-y-6">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xl font-semibold text-slate-200">Outliers & Inefficiencies</h2>
                  <p className="text-sm text-slate-400">Identifying high-consumption low-activity users and abnormal model mix.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Active Days vs Consumption by Engineer</CardTitle>
                      <CardDescription className="text-slate-400">Identifying high-consumption low-activity outliers.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" dataKey="days" name="Active Days" stroke="#cbd5e1" fontSize={12} />
                          <YAxis type="number" dataKey="consumption" name="Consumption (K)" stroke="#cbd5e1" fontSize={12} />
                          <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                          <Scatter name="Engineers" data={scatterData} fill="#14b8a6" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Model Mix by Cost Center</CardTitle>
                      <CardDescription className="text-slate-400">Identifying sub-optimal model selection habits.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.clientMix} layout="vertical" margin={{ left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="ide" stackId="a" fill="#8b5cf6" name="Claude 4.6" />
                          <Bar dataKey="cli" stackId="a" fill="#3b82f6" name="GPT-4o" />
                          <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Gemini 1.5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </section>

            </div>
          </div>
        </div>
      );
    }
