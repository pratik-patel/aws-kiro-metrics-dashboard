import { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_DATA } from "@/lib/mock-data";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { Link } from "wouter";

export default function GovernanceFindings() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);

  const openEvidence = (id: string) => {
    setSelectedInteraction(id);
    setDrawerOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      <EvidenceDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        interactionId={selectedInteraction} 
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="dashboard-page-title mb-1">Governance Findings</h1>
          <p className="dashboard-page-lead">Automated insights, risk detection, and optimization opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-[#111827] border-white/10 hover:bg-white/5 hover:text-white">
            Resolved (24)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-8">
        {MOCK_DATA.findings.map(finding => (
          <div key={finding.id} className="bg-[#111827] border border-white/5 rounded-xl p-6 shadow-md hover:border-white/10 transition-colors flex flex-col md:flex-row gap-6 relative overflow-hidden">
            {/* Status Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              finding.severity === 'High' ? 'bg-red-500' : 
              finding.severity === 'Medium' ? 'bg-amber-500' : 
              'bg-blue-500'
            }`} />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-1.5 rounded-md ${
                  finding.severity === 'High' ? 'bg-red-500/10 text-red-400' : 
                  finding.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {finding.severity === 'High' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <h3 className="dashboard-card-title text-slate-200">{finding.title}</h3>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-black/40 text-slate-400 border border-white/5">
                  {finding.category}
                </span>
              </div>
              <p className="text-slate-400 mb-4">{finding.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  Scope: <span className="text-slate-300 font-medium">{finding.scope}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>Detected 2 hours ago</span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 md:min-w-[200px] border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
                onClick={() => openEvidence('req-d8d0')}
              >
                <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
                View Evidence
              </Button>
              <Link href="/monitor">
                <Button className="w-full justify-start bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20">
                  <Zap className="w-4 h-4 mr-2" />
                  Run Advisor
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
