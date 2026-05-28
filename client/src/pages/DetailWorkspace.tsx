import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Download, Zap, Users, AlertTriangle, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_DATA } from "@/lib/mock-data";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

import { EvidenceDrawer } from "@/components/EvidenceDrawer";

export default function DetailWorkspace() {
  const { entityType, entityId } = useParams();
  const [, setLocation] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);

  const openEvidence = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedInteraction(id);
    setDrawerOpen(true);
  };

  
  // Try to find the entity in mock data
  let entityName = "Unknown Entity";
  let parentNav = [];
  
  if (entityType === 'cost-center') {
    const cc = MOCK_DATA.costCenters.find(c => c.id === entityId);
    if (cc) {
      entityName = cc.name;
      parentNav = [{ label: "Cost Centers", href: "/explorer" }];
    }
  } else if (entityType === 'team') {
    const t = MOCK_DATA.teams.find(t => t.id === entityId);
    if (t) {
      entityName = t.name;
    }
  } else if (entityType === 'engineer') {
    const e = MOCK_DATA.engineers.find(e => e.id === entityId);
    if (e) {
      entityName = e.name;
    }
  }

  const scatterData = MOCK_DATA.engineers.map(e => ({
    name: e.name,
    consumption: parseFloat(e.consumption.replace('K', '')),
    days: e.activeDays
  }));

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <EvidenceDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        interactionId={selectedInteraction} 
      />
      {/* Header Area */}
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-[#0a0f18]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center text-sm text-slate-400 mb-4">
            <Link href="/explorer" className="hover:text-white transition-colors">Explorer</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-blue-400 capitalize">{entityType?.replace('-', ' ')}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{entityName}</h1>
              <p className="text-slate-400">Detailed performance, consumption, and governance posture.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white transition-all shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Link href="/studio">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all">
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Advisor on Scope
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Subnav */}
      <div className="px-8 border-b border-white/5 bg-[#0c1220]/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="bg-transparent border-none p-0 h-auto gap-6 justify-start">
              {['Summary', 'Consumption', 'Teams', 'Use Cases', 'Models & Tools', 'Findings', 'Evidence'].map(tab => (
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
              <TabsContent value="summary" className="m-0 space-y-6">
                {/* Contextual KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard title="AI Consumption" value="542K" trend="+8%" />
                  <KPICard title="Overrun" value="12K" trendDown trend="+1.2%" />
                  <KPICard title="Active Engineers" value="145" />
                  <KPICard title="Top Use Case" value="Legacy Mod" isText />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Monthly Consumption Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.dailyTrend.slice(0,7)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Consumption vs Active Days</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" dataKey="days" name="Active Days" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                          <YAxis type="number" dataKey="consumption" name="Consumption (K)" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                          <RechartsTooltip 
                            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          />
                          <Scatter name="Engineers" data={scatterData} fill="#8b5cf6" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Findings Preview */}
                <Card className="bg-[#111827] border-white/5 shadow-lg">
                  <div className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-red-500/20 p-4">
                    <h3 className="font-medium text-red-400 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Findings for this Scope
                    </h3>
                  </div>
                  <div className="p-0">
                    <div className="divide-y divide-white/5">
                      {MOCK_DATA.findings.slice(0, 2).map(finding => (
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
                </Card>
              </TabsContent>
              
              <TabsContent value="consumption" className="m-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Monthly AI Consumption</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.dailyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar dataKey="consumption" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/5 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-slate-200">Client Type Mix</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.clientMix.slice(0, 1)} layout="vertical" margin={{ left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} width={80} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar dataKey="ide" stackId="a" fill="#3b82f6" name="IDE" />
                          <Bar dataKey="cli" stackId="a" fill="#8b5cf6" name="CLI" />
                          <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Plugin" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="m-0 space-y-6">
                <Card className="bg-[#111827] border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 font-medium">Team</th>
                          <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                          <th className="px-6 py-4 font-medium text-right">Active Eng.</th>
                          <th className="px-6 py-4 font-medium">Top Engineer</th>
                          <th className="px-6 py-4 font-medium">Top Channel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_DATA.teams.map((team) => (
                          <tr key={team.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setLocation(`/detail/team/${team.id}`)}>
                            <td className="px-6 py-4 font-medium text-slate-200">{team.name}</td>
                            <td className="px-6 py-4 text-right text-slate-300 font-mono">{team.consumption}</td>
                            <td className="px-6 py-4 text-right text-slate-300">{team.activeEngineers}</td>
                            <td className="px-6 py-4 text-slate-400">{team.topEngineer}</td>
                            <td className="px-6 py-4 text-slate-400">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                {team.topChannel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="engineers" className="m-0 space-y-6">
                 <Card className="bg-[#111827] border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4 font-medium">Engineer</th>
                          <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                          <th className="px-6 py-4 font-medium text-right">Active Days</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {MOCK_DATA.engineers.map((eng) => (
                          <tr key={eng.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setLocation(`/detail/engineer/${eng.id}`)}>
                            <td className="px-6 py-4 font-medium text-slate-200">{eng.name}</td>
                            <td className="px-6 py-4 text-right text-slate-300 font-mono">{eng.consumption}</td>
                            <td className="px-6 py-4 text-right text-slate-300">{eng.activeDays}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                {eng.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="use-cases" className="m-0 text-center py-12 text-slate-500 bg-[#111827] border border-white/5 rounded-lg">
                Use case views will load here.
              </TabsContent>

              <TabsContent value="models-tools" className="m-0 text-center py-12 text-slate-500 bg-[#111827] border border-white/5 rounded-lg">
                Models and Tools views will load here.
              </TabsContent>

              <TabsContent value="findings" className="m-0 text-center py-12 text-slate-500 bg-[#111827] border border-white/5 rounded-lg">
                <div className="text-left px-4">
                  <div className="divide-y divide-white/5">
                    {MOCK_DATA.findings.map(finding => (
                      <div key={finding.id} className="p-4 hover:bg-white/5 transition-colors group cursor-pointer" onClick={(e) => openEvidence(e, finding.id)}>
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
              </TabsContent>
              
              <TabsContent value="evidence" className="m-0 text-center py-12 text-slate-500 bg-[#111827] border border-white/5 rounded-lg">
                 <div className="overflow-x-auto text-left">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">Request ID</th>
                        <th className="px-6 py-4 font-medium">Engineer</th>
                        <th className="px-6 py-4 font-medium">Use Case</th>
                        <th className="px-6 py-4 font-medium text-right">Consumption</th>
                        <th className="px-6 py-4 font-medium text-center">Evidence</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MOCK_DATA.interactions.map((int) => (
                        <tr key={int.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={(e) => openEvidence(e, int.id)}>
                          <td className="px-6 py-4 font-mono text-xs text-blue-400">{int.id.substring(0,12)}...</td>
                          <td className="px-6 py-4 font-medium text-slate-200">{int.engineer}</td>
                          <td className="px-6 py-4 text-slate-400">{int.useCase}</td>
                          <td className="px-6 py-4 text-right text-slate-300 font-mono">{int.consumption}</td>
                          <td className="px-6 py-4 text-center">
                            {int.evidence ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10" onClick={(e) => openEvidence(e, int.id)}>
                                <Activity className="w-4 h-4" />
                              </Button>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="m-0 text-center py-12 text-slate-500 bg-[#111827] border border-white/5 rounded-lg">
                <div className="px-8 text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                     <h3 className="font-medium text-slate-200">Generated Reports for this Scope</h3>
                     <Link href="/reports">
                      <Button variant="outline" className="bg-black/20 hover:bg-white/5 border-white/10 hover:text-white text-sm h-8">
                        View All
                      </Button>
                     </Link>
                  </div>
                  <div className="space-y-4">
                     {MOCK_DATA.reports.slice(0, 2).map((report) => (
                      <div key={report.id} className="bg-black/20 border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-slate-200 font-medium">{report.title}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                report.status === 'Completed' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 
                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {report.status}
                             </span>
                           </div>
                           <p className="text-xs text-slate-400">Generated: {report.createdAt} • Audience: {report.audience}</p>
                        </div>
                        <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Download
                        </Button>
                      </div>
                     ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendDown, isText }: any) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-md">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-slate-400 mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`font-semibold text-white ${isText ? 'text-lg truncate' : 'text-2xl'}`}>
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
