import { useState } from "react";
import { Copy, Terminal, MessagesSquare, FileCode, CheckCircle2, ChevronRight, Hash, Eye, AlertTriangle, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interactionId: string | null;
}

export function EvidenceDrawer({ open, onOpenChange, interactionId }: EvidenceDrawerProps) {
  // In a real app, you would fetch evidence based on interactionId
  // For the mockup, we use static mock evidence
  const isInline = Math.random() > 0.5; // Simulate some being inline, some chat

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#0B1120] border-white/10 text-white max-h-[90vh] lg:max-h-[85vh]">
        <DrawerHeader className="border-b border-white/5 pb-4 px-6 flex justify-between items-center bg-[#121A2B]">
          <div>
            <DrawerTitle className="text-lg font-medium text-slate-200 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-teal-400" />
              Interaction Evidence
            </DrawerTitle>
            <p className="text-sm text-slate-400 font-mono mt-1">{interactionId || 'req-unknown'}</p>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-[#0B1120]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Metadata & Summary */}
            <div className="col-span-1 space-y-6">
              <div className="bg-[#121A2B] border border-white/5 rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Interaction Summary</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Engineer</p>
                    <p className="text-sm font-medium text-slate-200 flex items-center">
                      Aisha Khan <span className="ml-2 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">e-1</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Cost Center</p>
                    <p className="text-sm font-medium text-slate-200">AI Delivery Acceleration</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Use Case</p>
                      <p className="text-sm text-slate-300">spec-orchestration</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Model</p>
                      <p className="text-sm text-slate-300">Claude_Sonnet_4.6</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Estimated Consumption</p>
                      <p className="text-lg font-mono font-bold text-white">27.73</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tokens</p>
                      <p className="text-sm text-slate-300 font-mono">14.2k in / 2.1k out</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#121A2B] border border-white/5 rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider flex items-center">
                  <Terminal className="w-4 h-4 mr-2" /> Tool Usage
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Plugin</span>
                    <span className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Jira</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">MCP Server</span>
                    <span className="text-sm font-medium text-slate-500">No MCP Invoked</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Related Findings
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This interaction is flagged under <span className="font-semibold">Prompt Discipline Issue</span> due to unusually high context window utilization for a standard spec-orchestration task.
                </p>
              </div>
            </div>

            {/* Right Column: Evidence Content */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue={isInline ? "inline" : "chat"} className="w-full">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <TabsList className="bg-[#121A2B] border border-white/10 p-1">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
                      <MessagesSquare className="w-4 h-4 mr-2" /> Chat Evidence
                    </TabsTrigger>
                    <TabsTrigger value="inline" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
                      <FileCode className="w-4 h-4 mr-2" /> Inline Evidence
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Copy className="w-4 h-4 mr-2" /> Copy Full Trace
                  </Button>
                </div>

                <TabsContent value="chat" className="m-0 space-y-6">
                  <div className="bg-[#121A2B] border border-white/5 rounded-xl p-5 shadow-lg">
                    <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider flex items-center">
                      <MessagesSquare className="w-4 h-4 mr-2" /> Chat Evidence
                    </h3>
                    <div className="space-y-4">
                      {/* User Prompt */}
                      <div className="bg-black/30 border border-white/5 rounded-lg p-4">
                        <p className="text-xs font-semibold text-blue-400 mb-2">User Prompt</p>
                        <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                          We need to refactor the legacy payment processing module to use the new spec orchestration engine. Please review the attached Jira ticket (PAY-142) and generate the full architectural update strategy, including all interface changes for the API gateway and the required database schema migrations for Postgres.
                        </p>
                        <div className="flex justify-end mt-2">
                          <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500 hover:text-white">
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                        </div>
                      </div>

                      {/* Assistant Response */}
                      <div className="bg-[#1E2A40]/50 border border-blue-500/10 rounded-lg p-4 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
                        <p className="text-xs font-semibold text-slate-400 mb-2">Assistant Response (Claude_Sonnet_4.6)</p>
                        <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed opacity-80">
                          Based on Jira ticket PAY-142, here is the architectural update strategy for migrating the legacy payment processing module to the spec orchestration engine...

[Response truncated for preview. Full response was 2.1k tokens.]
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inline" className="m-0 space-y-6">
                  <div className="bg-[#121A2B] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-black/40 border-b border-white/5 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 flex items-center">
                        <Hash className="w-3 h-3 mr-1" /> server/api/reconciliation.go
                      </span>
                      <span className="text-xs font-medium text-teal-400 flex items-center bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Accepted
                      </span>
                    </div>
                    <div className="p-4 bg-[#0a0f18] font-mono text-sm leading-relaxed overflow-x-auto">
                      {/* Left Context */}
                      <div className="text-slate-500">
                        <div className="flex"><span className="w-8 shrink-0 text-slate-700 select-none">42</span><span>func (h *PaymentHandler) Reconcile(w http.ResponseWriter, r *http.Request) {'{'}</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-slate-700 select-none">43</span><span> ctx := r.Context()</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-slate-700 select-none">44</span><span> var req ReconcileRequest</span></div>
                      </div>
                      
                      {/* Suggestion */}
                      <div className="text-slate-200 bg-blue-900/20 py-2 border-l-2 border-blue-500 my-1">
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">45</span><span>       if err := json.NewDecoder(r.Body).Decode(&req); err != nil {'{'}</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">46</span><span>               h.logger.Error("failed to decode request", zap.Error(err))</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">47</span><span>               http.Error(w, "invalid request body", http.StatusBadRequest)</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">48</span><span>               return</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">49</span><span>       {'}'}</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">50</span><span></span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-blue-500/50 select-none">51</span><span>       if err := h.service.ProcessReconciliation(ctx, req.BatchID); err != nil {'{'}</span></div>
                      </div>

                      {/* Right Context */}
                      <div className="text-slate-500">
                        <div className="flex"><span className="w-8 shrink-0 text-slate-700 select-none">52</span><span>         h.logger.Error("reconciliation failed", zap.Error(err))</span></div>
                        <div className="flex"><span className="w-8 shrink-0 text-slate-700 select-none">53</span><span>         // ... error handling</span></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}