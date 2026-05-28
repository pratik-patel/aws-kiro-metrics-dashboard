import { useState } from "react";
import { FileText, Download, Share, FileSignature, CheckCircle2, AlertTriangle, Zap, Eye, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ReportEvidenceConsole() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportsList, setReportsList] = useState([
    { id: "REP-9182", title: "Enterprise AI Optimization Plan", scope: "Global", audience: "Executive Sponsor", date: "Today, 10:45 AM", status: "Generated" },
    { id: "REP-9181", title: "Payments Transformation Risk Review", scope: "Cost Center: cc-4101", audience: "Delivery Manager", date: "Yesterday, 2:30 PM", status: "Generated" },
    { id: "REP-9180", title: "Model Routing & Hygiene Audit", scope: "Global", audience: "Architect", date: "May 25, 2026", status: "Generated" },
    { id: "REP-9179", title: "Retail Intelligence Q1 Review", scope: "Cost Center: cc-4204", audience: "Executive Sponsor", date: "May 20, 2026", status: "Stale" }
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateModal(false);
      // Add the new report to the top of the list
      setReportsList(prev => [
        {
          id: `REP-${Math.floor(Math.random() * 1000) + 9000}`,
          title: "New Strategic Report",
          scope: "Global",
          audience: "Executive Sponsor",
          date: "Just now",
          status: "Generated"
        },
        ...prev
      ]);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 relative">
      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-[#121A2B] border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-white/5 bg-black/20">
              <h3 className="font-semibold text-white">Generate Strategic Report</h3>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setShowGenerateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Report Scope</Label>
                <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Global (Enterprise Wide)</option>
                  <option>Payments Transformation (cc-4101)</option>
                  <option>AI Delivery Acceleration (cc-4102)</option>
                  <option>Platform Reliability (cc-4308)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Target Audience</Label>
                <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Executive Sponsor</option>
                  <option>Delivery Manager</option>
                  <option>Enterprise Architect</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Reporting Period</Label>
                <select className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Last 30 Days</option>
                  <option>Current Quarter (Q2)</option>
                  <option>Year to Date</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
              <Button variant="outline" className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] w-32"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Report & Evidence Console</h1>
          <p className="text-slate-400">Generated strategic reports and consolidated evidence packages.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
            <Share className="w-4 h-4 mr-2" />
            Share Hub
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            onClick={() => setShowGenerateModal(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Col: Reports List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Completed Reports</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Report</th>
                    <th className="px-6 py-4 font-medium">Scope & Audience</th>
                    <th className="px-6 py-4 font-medium">Generated</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reportsList.map((rep) => (
                    <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileSignature className="w-5 h-5 text-indigo-400" />
                          <div>
                            <p className="font-medium text-slate-200">{rep.title}</p>
                            <p className="text-xs text-slate-500 font-mono">{rep.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300">{rep.scope}</p>
                        <p className="text-xs text-slate-500">{rep.audience}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{rep.date}</span>
                          {rep.status === "Stale" && (
                            <span className="w-2 h-2 rounded-full bg-amber-500" title="Data is older than 7 days" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white bg-black/20 hover:bg-white/10">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Evidence Packs */}
        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden flex flex-col h-[500px]">
            <div className="bg-black/20 border-b border-white/5 p-4">
              <h3 className="font-medium text-slate-200 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" />
                Recent Evidence Packs
              </h3>
            </div>
            <div className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-white/5">
                
                <div className="p-4 hover:bg-white/5 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-slate-200">High-Cost Prompts (Payments)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-white/10">
                      42 Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Extracted evidence for the top 5% of highest consumption requests.</p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 bg-transparent border-white/10 text-slate-300 hover:bg-white/5">
                    View in Drawer
                  </Button>
                </div>
                
                <div className="p-4 hover:bg-white/5 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-slate-200">Unusual Usage Spikes</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-white/10">
                      14 Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Linked to findings on Platform Reliability Engineering.</p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 bg-transparent border-white/10 text-slate-300 hover:bg-white/5">
                    View in Drawer
                  </Button>
                </div>

              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
