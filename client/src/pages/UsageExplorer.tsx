import { useState } from "react";
import { Search, Filter, SlidersHorizontal, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_DATA } from "@/lib/mock-data";
import { Link, useLocation } from "wouter";

export default function UsageExplorer() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Usage Explorer</h1>
          <p className="text-slate-400">Discover and analyze ownership hierarchy and interaction universe.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search by name, ID, or use case..." 
            className="pl-9 bg-[#111827] border-white/10 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500"
          />
        </div>
        <Button variant="outline" className="bg-[#111827] border-white/10 hover:bg-white/5 hover:text-white">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="bg-[#111827] border-white/10 hover:bg-white/5 hover:text-white">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          View
        </Button>
      </div>

      <Tabs defaultValue="cost-centers" className="w-full">
        <TabsList className="bg-[#111827] border border-white/5 p-1">
          <TabsTrigger value="cost-centers" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Cost Centers</TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Teams</TabsTrigger>
          <TabsTrigger value="engineers" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Engineers</TabsTrigger>
          <TabsTrigger value="interactions" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Interactions</TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Models</TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cost-centers" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Cost Center</th>
                    <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                    <th className="px-6 py-4 font-medium text-right">Overrun</th>
                    <th className="px-6 py-4 font-medium text-right">Active Eng.</th>
                    <th className="px-6 py-4 font-medium">Top Use Case</th>
                    <th className="px-6 py-4 font-medium">Last Active</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.costCenters.map((cc) => (
                    <tr key={cc.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setLocation(`/detail/cost-center/${cc.id}`)}>
                      <td className="px-6 py-4 font-medium text-slate-200">{cc.name}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{cc.consumption}</td>
                      <td className="px-6 py-4 text-right text-amber-400 font-mono">{cc.overrun}</td>
                      <td className="px-6 py-4 text-right text-slate-300">{cc.activeEngineers}</td>
                      <td className="px-6 py-4 text-slate-400"><Badge>{cc.topUseCase}</Badge></td>
                      <td className="px-6 py-4 text-slate-400">{cc.lastActive}</td>
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
          </Card>
        </TabsContent>

        <TabsContent value="engineers" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Engineer</th>
                    <th className="px-6 py-4 font-medium">Team</th>
                    <th className="px-6 py-4 font-medium">Cost Center</th>
                    <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                    <th className="px-6 py-4 font-medium text-right">Active Days</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.engineers.map((eng) => (
                    <tr key={eng.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setLocation(`/detail/engineer/${eng.id}`)}>
                      <td className="px-6 py-4 font-medium text-slate-200">{eng.name}</td>
                      <td className="px-6 py-4 text-slate-400">{eng.team}</td>
                      <td className="px-6 py-4 text-slate-400">{eng.costCenter}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{eng.consumption}</td>
                      <td className="px-6 py-4 text-right text-slate-300">{eng.activeDays}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {eng.status}
                        </span>
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
          </Card>
        </TabsContent>
        
        <TabsContent value="interactions" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Request ID</th>
                    <th className="px-6 py-4 font-medium">Engineer</th>
                    <th className="px-6 py-4 font-medium">Cost Center</th>
                    <th className="px-6 py-4 font-medium">Use Case</th>
                    <th className="px-6 py-4 font-medium text-right">Consumption</th>
                    <th className="px-6 py-4 font-medium text-center">Evidence</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.interactions.map((int) => (
                    <tr key={int.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setLocation(`/detail/interaction/${int.id}`)}>
                      <td className="px-6 py-4 font-mono text-xs text-blue-400">{int.id.substring(0,12)}...</td>
                      <td className="px-6 py-4 font-medium text-slate-200">{int.engineer}</td>
                      <td className="px-6 py-4 text-slate-400">{int.costCenter}</td>
                      <td className="px-6 py-4 text-slate-400"><Badge>{int.useCase}</Badge></td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{int.consumption}</td>
                      <td className="px-6 py-4 text-center">
                        {int.evidence ? (
                          <Eye className="w-4 h-4 text-teal-400 mx-auto" />
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
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Team</th>
                    <th className="px-6 py-4 font-medium">Cost Center</th>
                    <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                    <th className="px-6 py-4 font-medium text-right">Active Eng.</th>
                    <th className="px-6 py-4 font-medium">Top Engineer</th>
                    <th className="px-6 py-4 font-medium">Top Channel</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.teams.map((team) => (
                    <tr key={team.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setLocation(`/detail/team/${team.id}`)}>
                      <td className="px-6 py-4 font-medium text-slate-200">{team.name}</td>
                      <td className="px-6 py-4 text-slate-400">{team.costCenter}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{team.consumption}</td>
                      <td className="px-6 py-4 text-right text-slate-300">{team.activeEngineers}</td>
                      <td className="px-6 py-4 text-slate-400">{team.topEngineer}</td>
                      <td className="px-6 py-4 text-slate-400"><Badge>{team.topChannel}</Badge></td>
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
          </Card>
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Model</th>
                    <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                    <th className="px-6 py-4 font-medium text-right">Interactions</th>
                    <th className="px-6 py-4 font-medium">Top Cost Centers</th>
                    <th className="px-6 py-4 font-medium">Top Use Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.models?.map((model) => (
                    <tr key={model.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">{model.name}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{model.consumption}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{model.interactions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-400">{model.topCostCenters}</td>
                      <td className="px-6 py-4 text-slate-400"><Badge>{model.topUseCases}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <Card className="bg-[#111827] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tool</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                    <th className="px-6 py-4 font-medium text-right">Interactions</th>
                    <th className="px-6 py-4 font-medium">Top Cost Center</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_DATA.tools?.map((tool) => (
                    <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">{tool.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${tool.type === 'Plugin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'}`}>
                          {tool.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{tool.consumption}</td>
                      <td className="px-6 py-4 text-right text-slate-300 font-mono">{tool.interactions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-400">{tool.topCostCenters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
      {children}
    </span>
  );
}
