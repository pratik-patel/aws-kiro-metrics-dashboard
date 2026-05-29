import type { ReactNode } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  FileCode,
  Hash,
  MessagesSquare,
  Sparkles,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatConsumption, getInteractionById } from "@/lib/kiro-data";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interactionId: string | null;
}

export function EvidenceDrawer({ open, onOpenChange, interactionId }: EvidenceDrawerProps) {
  const interaction = getInteractionById(interactionId);

  if (!interaction) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-[#0B1120] border-white/10 text-white max-h-[90vh]">
          <DrawerHeader className="border-b border-white/5 pb-4 px-6 bg-[#121A2B]">
            <DrawerTitle className="dashboard-card-title text-slate-200 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-slate-400" />
              Interaction Evidence
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 text-slate-400">No evidence was found for this interaction.</div>
        </DrawerContent>
      </Drawer>
    );
  }

  const hasInline = interaction.evidence.inlineCount > 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#0B1120] border-white/10 text-white max-h-[90vh] lg:max-h-[88vh]">
        <DrawerHeader className="border-b border-white/5 pb-4 px-6 flex justify-between items-center bg-[#121A2B]">
          <div>
            <DrawerTitle className="dashboard-card-title text-slate-200 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-teal-400" />
              Interaction Evidence
            </DrawerTitle>
            <p className="text-sm text-slate-400 font-mono mt-1">{interaction.id}</p>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-[#0B1120]">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 xl:grid-cols-[0.92fr_1.08fr] gap-6">
            <div className="space-y-6">
              <section className="bg-[#121A2B] border border-white/5 rounded-xl p-5 shadow-lg">
                <h3 className="dashboard-eyebrow mb-4 text-slate-300">Interaction Summary</h3>
                <div className="space-y-4">
                  <SummaryPair label="Engineer" value={interaction.engineerName} />
                  <SummaryPair label="Cost Center" value={interaction.costCenterName} />
                  <SummaryPair label="Team" value={interaction.teamName} />
                  <div className="grid grid-cols-2 gap-4">
                    <SummaryPair label="Use Case" value={interaction.useCaseLabel} />
                    <SummaryPair label="Channel" value={interaction.interactionChannel} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SummaryPair label="Model" value={interaction.modelName} />
                    <SummaryPair label="Interaction Source" value={interaction.requestSource} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <MetricPair label="Estimated AI Consumption" value={`${formatConsumption(interaction.estimatedCredits)} credits`} />
                    <MetricPair label="Prompt / Response" value={`${interaction.promptChars.toLocaleString()} / ${interaction.responseChars.toLocaleString()} chars`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricPair label="Plugin" value={interaction.pluginName} />
                    <MetricPair label="MCP Server" value={interaction.mcpServer} />
                  </div>
                </div>
              </section>

              <section className="bg-[#121A2B] border border-white/5 rounded-xl p-5 shadow-lg">
                <h3 className="dashboard-eyebrow mb-4 text-slate-300 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
                  Input Drivers
                </h3>
                <div className="space-y-3">
                  {interaction.inputDrivers.map((driver) => (
                    <div key={`${driver.kind}-${driver.label}`} className="rounded-lg border border-white/5 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                              driver.kind === "Observed"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                : "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20"
                            }`}
                          >
                            {driver.kind}
                          </span>
                          <span className="text-sm font-medium text-slate-100">{driver.label}</span>
                        </div>
                        <span className="text-sm text-slate-300">{driver.value}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{driver.note}</p>
                      {driver.kind === "Estimated" && driver.confidence ? (
                        <p className="text-[11px] text-slate-500 mt-2">Confidence: {driver.confidence}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Caveat
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prompt, model, plugin, MCP, and response size are observed directly from Kiro-style telemetry. Steering,
                  agent instruction, and retrieved-context overhead are estimated so the demo stays honest about what Kiro
                  exposes today.
                </p>
              </section>
            </div>

            <div>
              <Tabs defaultValue="chat" className="w-full">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <TabsList className="bg-[#121A2B] border border-white/10 p-1">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
                      <MessagesSquare className="w-4 h-4 mr-2" />
                      Chat Evidence
                    </TabsTrigger>
                    <TabsTrigger
                      value="inline"
                      className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
                      disabled={!hasInline}
                    >
                      <FileCode className="w-4 h-4 mr-2" />
                      Inline Evidence
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Trace
                  </Button>
                </div>

                <TabsContent value="chat" className="m-0 space-y-6">
                  <EvidenceBlock
                    title="Chat Prompt"
                    icon={<MessagesSquare className="w-4 h-4 mr-2" />}
                    content={interaction.evidence.prompt || "No chat prompt captured."}
                    tone="blue"
                  />
                  <EvidenceBlock
                    title="Assistant Response"
                    icon={<Terminal className="w-4 h-4 mr-2" />}
                    content={interaction.evidence.assistantResponse || "No assistant response captured."}
                    tone="indigo"
                  />
                  {interaction.evidence.followupPrompts ? (
                    <EvidenceBlock
                      title="Follow-up Prompts"
                      icon={<Hash className="w-4 h-4 mr-2" />}
                      content={interaction.evidence.followupPrompts}
                      tone="neutral"
                    />
                  ) : null}
                </TabsContent>

                <TabsContent value="inline" className="m-0 space-y-6">
                  <div className="bg-[#121A2B] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-black/40 border-b border-white/5 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        {interaction.evidence.fileName || "No file captured"}
                      </span>
                      <span className="text-xs font-medium text-teal-400 flex items-center bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Inline Suggestion
                      </span>
                    </div>
                    <div className="p-4 bg-[#0a0f18] space-y-4">
                      <CodePanel label="Left Context" content={interaction.evidence.leftContext || "No left context captured."} />
                      <CodePanel
                        label="Accepted Completion"
                        content={interaction.evidence.acceptedCompletion || "No accepted completion captured."}
                        highlight
                      />
                      <CodePanel label="Right Context" content={interaction.evidence.rightContext || "No right context captured."} />
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

function SummaryPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="dashboard-metric-value">{value}</p>
    </div>
  );
}

function MetricPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="dashboard-item-title text-base">{value}</p>
    </div>
  );
}

function EvidenceBlock({
  title,
  icon,
  content,
  tone,
}: {
  title: string;
  icon: ReactNode;
  content: string;
  tone: "blue" | "indigo" | "neutral";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-black/30 border-white/5"
      : tone === "indigo"
        ? "bg-[#1E2A40]/50 border-blue-500/10"
        : "bg-black/20 border-white/5";

  return (
    <div className={`border rounded-xl p-5 shadow-lg ${toneClass}`}>
      <h3 className="dashboard-eyebrow mb-4 text-slate-300 flex items-center">{icon}{title}</h3>
      <p className="dashboard-body font-mono whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function CodePanel({
  label,
  content,
  highlight = false,
}: {
  label: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border ${highlight ? "border-blue-500/20 bg-blue-900/10" : "border-white/5 bg-black/20"} p-4`}>
      <p className="dashboard-metric-label mb-3">{label}</p>
      <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">{content}</pre>
    </div>
  );
}
