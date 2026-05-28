import { Beaker, Play, Save, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PolicySimulationStudio() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-[#0a0f18]">
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
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Beaker className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-200">Simulation Environment</h3>
            <p className="text-slate-400">Configure parameters on the left, view impact projections in the center, and get AI Advisor recommendations on the right.</p>
            <Button variant="outline" className="mt-4 border-white/10">Configure New Scenario</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
