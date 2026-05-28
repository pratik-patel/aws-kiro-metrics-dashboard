import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, Legend, Treemap, ScatterChart, Scatter } from "recharts";
import { MOCK_DATA } from "@/lib/mock-data";

// Custom Treemap Content to ensure text visibility
const CustomizedTreemapContent = (props: any) => {
  const { depth, x, y, width, height, name, fill, payload } = props;

  const nodeFill = fill || payload?.fill || "rgba(255,255,255,0.05)";
  const displayName = name || payload?.name;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth === 1 ? nodeFill : "transparent",
          stroke: '#0c1220',
          strokeWidth: 3,
        }}
      />
      {
        depth === 1 && width > 50 && height > 30 && displayName && displayName !== "root" && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#0f172a" fontSize={13} fontWeight="600">
            {displayName}
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

  const monthlyTrendData = [
    { month: '2026-04', payments: 2800, ai: 2450, platform: 2800, retail: 1100 },
    { month: '2026-05', payments: 2750, ai: 2500, platform: 2850, retail: 1550 },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#0a0f18] overflow-y-auto">
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-[#0a0f18] shrink-0 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Consumption shape & concentration</h1>
              <p className="text-slate-400">Daily and monthly trend, cost-center concentration, and client-mix posture for the selected scope.</p>
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

      <div className="p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily AI Consumption Trend (Area Chart) */}
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Daily AI Consumption</CardTitle>
                <CardDescription className="text-slate-400">2026-05</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_DATA.dailyTrend}>
                    <defs>
                      <linearGradient id="colorConsumptionArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickFormatter={(val) => val.split('-').slice(2).join('')} />
                    <YAxis stroke="#cbd5e1" fontSize={12} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                    <Area type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumptionArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trend by Cost Center */}
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Monthly Trend by Cost Center</CardTitle>
                <CardDescription className="text-slate-400 uppercase tracking-widest text-xs">ALL MONTHS</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData} maxBarSize={60} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#cbd5e1" fontSize={12} />
                    <YAxis stroke="#cbd5e1" fontSize={12} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                    <Bar dataKey="payments" stackId="a" fill="#60a5fa" name="Payments Trans." />
                    <Bar dataKey="ai" stackId="a" fill="#34d399" name="AI Delivery Accel." />
                    <Bar dataKey="platform" stackId="a" fill="#fbbf24" name="Platform Rel." />
                    <Bar dataKey="retail" stackId="a" fill="#a78bfa" name="Retail Intel." />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Spend Concentration Treemap */}
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Spend Concentration Treemap</CardTitle>
                <CardDescription className="text-slate-400 uppercase tracking-widest text-xs">COST CENTER → TEAM → ENGINEER</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={[
                      { name: 'Payments Trans.', size: 542, fill: '#60a5fa' },
                      { name: 'AI Delivery Accel.', size: 480, fill: '#34d399' },
                      { name: 'Platform Rel.', size: 245, fill: '#fbbf24' },
                      { name: 'Retail Intel.', size: 185, fill: '#a78bfa' }
                    ]}
                    dataKey="size"
                    nameKey="name"
                    aspectRatio={4 / 3}
                    stroke="rgba(0,0,0,0.2)"
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
                <CardTitle className="text-lg font-medium text-slate-200">Client Type Mix by Cost Center</CardTitle>
                <CardDescription className="text-slate-400">2026-05</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DATA.clientMix} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#cbd5e1" fontSize={10} hide />
                    <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="ide" stackId="a" fill="#60a5fa" name="KIRO_IDE" />
                    <Bar dataKey="cli" stackId="a" fill="#34d399" name="KIRO_CLI" />
                    <Bar dataKey="plugin" stackId="a" fill="#fbbf24" name="PLUGIN" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="pt-8 pb-4">
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
                <CardTitle className="text-lg font-medium text-slate-200">Use Case x Model Heatmap</CardTitle>
                <CardDescription className="text-slate-400">Distribution of model usage across different development contexts.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}