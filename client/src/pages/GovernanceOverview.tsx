import { ArrowUpRight, Zap, Users, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DATA } from "@/lib/mock-data";
import { Link, useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Treemap } from 'recharts';

export default function GovernanceOverview() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Above-the-fold structure */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Kiro AI Consumption Governance</h1>
          <p className="text-slate-400 text-lg">Enterprise visibility, accountability, and optimization for Kiro telemetry</p>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl">
            This command center bridges the gap between raw interaction data and executive decision-making. 
            Monitor consumption trends, identify risk clusters, and simulate policy changes across your organization.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/reports">
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white transition-all shadow-sm">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              Generate Strategic Report
            </Button>
          </Link>
          <Link href="/studio">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all">
              <Zap className="w-4 h-4 mr-2" />
              Run AI Advisor
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Total AI Consumption" value={MOCK_DATA.kpis.totalConsumption} icon={Zap} trend="+12.5%" />
        <KPICard title="Overrun" value={MOCK_DATA.kpis.overrun} icon={AlertTriangle} trend="+4.2%" trendDown />
        <KPICard title="Active Engineers" value={MOCK_DATA.kpis.activeEngineers} icon={Users} trend="+2" />
        <KPICard title="Consumption per Engineer" value={MOCK_DATA.kpis.consumptionPerEngineer} icon={Activity} />
        <KPICard title="Top Cost Center" value={MOCK_DATA.kpis.topCostCenter} isText />
        <KPICard title="Top Engineer" value={MOCK_DATA.kpis.topEngineer} isText />
      </div>

      {/* Intelligence Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <IntelligenceTile 
          title="Top Cost Centers" 
          metric="Payments Transformation" 
          desc="Driving 37% of total enterprise consumption."
          href="/detail/cost-center/cc-payments"
        />
        <IntelligenceTile 
          title="Top Teams" 
          metric="AI SDLC Enablement" 
          desc="Highest week-over-week growth (+18%)."
          href="/detail/team/t-sdlc"
        />
        <IntelligenceTile 
          title="Top Use Cases" 
          metric="Legacy Modernization" 
          desc="Accounting for 42% of all Claude Opus 4.6 usage."
          href="/detail/cost-center/cc-legacy"
        />
        <IntelligenceTile 
          title="Top Risk Signals" 
          metric="Spend Concentration" 
          desc="5% of engineers generating 45% of consumption."
          href="/findings"
          alert
        />
      </div>

      {/* Main Analytics Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Daily AI Consumption Trend */}
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-200">Daily AI Consumption Trend</CardTitle>
              <CardDescription className="text-slate-400">Trailing 10 days of aggregate usage</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_DATA.dailyTrend}>
                  <defs>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickMargin={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                  <YAxis stroke="#cbd5e1" fontSize={12} tickMargin={10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#1e3a8a', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spend Concentration Treemap */}
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Spend Concentration</CardTitle>
                <CardDescription className="text-slate-400">Cost Center &gt; Team</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
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
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
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
              <CardContent className="h-[250px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DATA.clientMix} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={10} width={80} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="ide" stackId="a" fill="#3b82f6" name="IDE" />
                    <Bar dataKey="cli" stackId="a" fill="#8b5cf6" name="CLI" />
                    <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Plugin" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Consumers Leaderboard */}
          <Card className="bg-[#111827] border-white/5 shadow-lg">
             <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-200">Top Consumers</CardTitle>
              <CardDescription className="text-slate-400">Highest utilizing engineers across the enterprise</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                    <tr>
                      <th className="px-6 py-3 font-medium">Engineer</th>
                      <th className="px-6 py-3 font-medium">Team</th>
                      <th className="px-6 py-3 font-medium text-right">Consumption</th>
                      <th className="px-6 py-3 font-medium text-right">Active Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_DATA.engineers.slice(0, 5).map((eng, idx) => (
                      <tr key={eng.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setLocation(`/detail/engineer/${eng.id}`)}>
                        <td className="px-6 py-3 font-medium text-slate-200 flex items-center gap-2">
                          <span className="text-slate-500 font-mono text-xs w-4">{idx + 1}.</span>
                          {eng.name}
                        </td>
                        <td className="px-6 py-3 text-slate-400 hover:text-blue-400 transition-colors" onClick={(e) => { e.stopPropagation(); setLocation(`/detail/team/${eng.team.replace(/\s+/g, '-').toLowerCase()}`); }}>{eng.team}</td>
                        <td className="px-6 py-3 text-right text-slate-300 font-mono font-medium">{eng.consumption}</td>
                        <td className="px-6 py-3 text-right text-slate-400">{eng.activeDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          {/* AI Advisor Module */}
          <Card className="bg-gradient-to-br from-[#1e1b4b]/80 to-[#111827] border-indigo-500/20 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-indigo-400" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg font-medium text-indigo-300 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                AI Advisor
              </CardTitle>
              <CardDescription className="text-slate-400">Simulate policy changes and get actionable recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <p className="text-sm text-slate-300">Run a fresh simulation to identify optimization opportunities across <span className="text-white font-medium">842 active engineers</span>.</p>
              </div>
              <Link href="/studio">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
                  Open Simulation Studio
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Findings */}
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-red-500/20 p-4">
              <h3 className="font-medium text-red-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Recent Findings
              </h3>
            </div>
            <div className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-white/5">
                {MOCK_DATA.findings.slice(0, 4).map(finding => (
                  <div key={finding.id} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-slate-200 group-hover:text-blue-400 transition-colors">{finding.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        finding.severity === 'High' ? 'bg-red-500/20 text-red-400' : 
                        finding.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{finding.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-white/5 bg-black/20 text-center">
              <Link href="/findings" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All Findings →</Link>
            </div>
          </Card>

          {/* System Health / Status */}
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Data Freshness</span>
                  <span className="text-slate-200 font-medium">Near Real-Time</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Active Syncs</span>
                  <span className="text-teal-400 font-medium">Healthy</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Last Telemetry</span>
                  <span className="text-slate-200 font-medium">2 mins ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, trend, trendDown, isText }: any) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-md hover:bg-white/[0.02] transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-medium text-slate-400">{title}</p>
          {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className={`font-semibold text-white ${isText ? 'text-lg truncate' : 'text-2xl'}`} title={isText ? value : undefined}>
            {value}
          </h3>
          {trend && (
            <span className={`text-xs font-medium ${trendDown ? 'text-amber-400' : 'text-teal-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IntelligenceTile({ title, metric, desc, href, alert }: any) {
  const content = (
    <Card className={`h-full border-white/5 shadow-md hover:border-white/20 transition-all cursor-pointer group ${
      alert ? 'bg-gradient-to-br from-[#1a1515] to-[#111827]' : 'bg-[#111827]'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 flex justify-between items-center">
          {title}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-lg font-semibold mb-1 ${alert ? 'text-amber-400' : 'text-slate-200'}`}>
          {metric}
        </div>
        <p className="text-xs text-slate-500">{desc}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
