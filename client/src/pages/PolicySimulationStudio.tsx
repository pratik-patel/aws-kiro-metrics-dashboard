import { useState } from "react";
import { Beaker, Play, Save, History, Settings, ArrowRight, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MOCK_DATA } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PolicySimulationStudio() {
  const [simulationRun, setSimulationRun] = useState(false);
  const [levers, setLevers] = useState({
    routingStrictness: 75,
    promptThreshold: 40,
    utilizationThreshold: 20
  });

  const handleRunSimulation = () => {
    setSimulationRun(true);
  };

  const updateLever = (key: keyof typeof levers, value: string) => {
    setLevers(prev => ({ ...prev, [key]: parseInt(value) }));
    // In a real app, this might trigger a recalculation
    if (simulationRun) {
      setSimulationRun(false); // Reset to encourage re-running
    }
  };

  // Calculate dynamic simulated values based on levers
  const getSimulatedValue = (baseline: number, impactFactor: number) => {
    if (!simulationRun) return baseline;
    
    // Simple deterministic simulation logic
    const strictnessImpact = (levers.routingStrictness - 50) / 100 * 0.15; // +/- 15%
    const promptImpact = (levers.promptThreshold - 50) / 100 * 0.1; // +/- 10%
    const totalImpact = impactFactor * (1 - strictnessImpact - promptImpact);
    
    return Math.max(Math.round(baseline * totalImpact), 0);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#0a0f18]">
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-[#0a0f18] shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Policy & Simulation Studio</h1>
              <p className="text-slate-400">Model governance rules, project impact, and test policies before deployment.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
                <History className="w-4 h-4 mr-2" />
                Saved Scenarios
              </Button>
              <Button onClick={handleRunSimulation} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
          
          {/* Left Column: Configuration */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <Card className="bg-[#111827] border-white/5 shadow-lg h-full flex flex-col">
              <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                <CardTitle className="text-lg font-medium text-slate-200 flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-slate-400" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider">Advisor Mode</Label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Optimization Recommendations</option>
                    <option>Cost Concentration Review</option>
                    <option>License Hygiene Review</option>
                    <option>Model Routing Review</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-slate-400 text-xs uppercase tracking-wider">Simulation Levers</Label>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm text-slate-300">Model Routing Strictness</Label>
                      <span className="text-xs text-blue-400 font-mono">{levers.routingStrictness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={levers.routingStrictness}
                      onChange={(e) => updateLever('routingStrictness', e.target.value)}
                      className="w-full accent-blue-500" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm text-slate-300">Prompt-Size Threshold</Label>
                      <span className="text-xs text-blue-400 font-mono">{levers.promptThreshold}k chars</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={levers.promptThreshold}
                      onChange={(e) => updateLever('promptThreshold', e.target.value)}
                      className="w-full accent-blue-500" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm text-slate-300">Low-Utilization Threshold</Label>
                      <span className="text-xs text-blue-400 font-mono">&lt; {Math.round(levers.utilizationThreshold / 4)} days/mo</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={levers.utilizationThreshold}
                      onChange={(e) => updateLever('utilizationThreshold', e.target.value)}
                      className="w-full accent-blue-500" 
                    />
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-white/5 bg-black/20">
                <Button variant="outline" className="w-full bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Scenario
                </Button>
              </div>
            </Card>
          </div>

          {/* Center Column: Current State vs Baseline */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <Card className="bg-[#111827] border-white/5 shadow-lg h-full">
              <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                <CardTitle className="text-lg font-medium text-slate-200">Current State vs. Baseline</CardTitle>
                <CardDescription className="text-slate-400">Evaluating 842 active engineers across 4 cost centers.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 border border-white/5 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Baseline Consumption</p>
                    <p className="text-2xl font-bold text-white font-mono">1,452K</p>
                  </div>
                  <div className="bg-black/20 border border-white/5 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Baseline Overrun</p>
                    <p className="text-2xl font-bold text-amber-400 font-mono">34.5K</p>
                  </div>
                </div>
                
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Payments Trans.", baseline: 542, simulated: getSimulatedValue(542, 0.88) },
                      { name: "AI Del. Accel.", baseline: 480, simulated: getSimulatedValue(480, 0.85) },
                      { name: "Platform Rel.", baseline: 245, simulated: getSimulatedValue(245, 0.94) },
                      { name: "Retail Intel.", baseline: 185, simulated: getSimulatedValue(185, 0.86) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} />
                      <YAxis stroke="#cbd5e1" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="baseline" fill="#334155" name="Baseline" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="simulated" fill="#3b82f6" name="Simulated" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Projected Impact */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            <Card className="bg-[#111827] border-white/5 shadow-lg h-full flex flex-col">
              <CardHeader className="pb-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent">
                <CardTitle className="text-lg font-medium text-blue-400 flex items-center">
                  <Beaker className="w-4 h-4 mr-2" />
                  Projected Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                {!simulationRun ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                    <Beaker className="w-12 h-12 text-slate-700" />
                    <p>Adjust levers and run simulation to see projected impact and advisor recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-xs text-blue-400 mb-1 font-medium">Consumption Delta</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-white font-mono">-172K</p>
                          <TrendingDown className="w-3 h-3 text-teal-400" />
                        </div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <p className="text-xs text-amber-400 mb-1 font-medium">Overrun Delta</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-white font-mono">-24K</p>
                          <TrendingDown className="w-3 h-3 text-teal-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-200">Advisor Recommendations</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-black/20 border border-white/5 rounded-lg flex gap-3 items-start">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-slate-200">Enforce Claude Haiku routing for routine text tasks.</p>
                            <p className="text-xs text-slate-400 mt-1">Saves est. 85K in AI Delivery Acceleration.</p>
                          </div>
                        </div>
                        <div className="p-3 bg-black/20 border border-white/5 rounded-lg flex gap-3 items-start">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-slate-200">Review 45 low-utilization seats in Retail Intelligence.</p>
                            <p className="text-xs text-slate-400 mt-1">Potential license hygiene improvement.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {simulationRun && (
                <div className="p-4 border-t border-white/5 bg-black/20">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                    Generate Strategic Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}