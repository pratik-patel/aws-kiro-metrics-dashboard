import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  Eye,
  FileText,
  Loader2,
  Share2,
  X,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { ExperienceHeader } from "@/components/experience/ExperienceHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  KIRO_DATA,
  formatConsumption,
  getInteractionsForScope,
  getRecommendationsForScope,
  getUseCaseSummariesForScope,
  type Recommendation,
  type ReportSummary,
} from "@/lib/kiro-data";

type Audience = "Executive Sponsor" | "Delivery Manager" | "Architect";
type ScopeType = Recommendation["scopeType"];

interface ReportEntry extends ReportSummary {
  scopeType: ScopeType;
  scopeId: string;
}

export default function ReportEvidenceConsole() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(KIRO_DATA.reports[0]?.id ?? "");
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);
  const [draftScopeId, setDraftScopeId] = useState("enterprise");
  const [draftAudience, setDraftAudience] = useState<Audience>("Executive Sponsor");
  const [draftPeriod, setDraftPeriod] = useState("Last 30 Days");
  const [generatedReports, setGeneratedReports] = useState<ReportEntry[]>(() =>
    KIRO_DATA.reports.map((report) => ({
      ...report,
      ...resolveScopeReference(report.scopeLabel),
    })),
  );

  const scopeOptions = useMemo(() => {
    const options = [{ id: "enterprise", label: "Enterprise", scopeType: "Enterprise" as const }];
    return [
      ...options,
      ...KIRO_DATA.costCenters.map((costCenter) => ({
        id: `cost-center:${costCenter.id}`,
        label: `${costCenter.name} · Cost Center`,
        scopeType: "Cost Center" as const,
      })),
      ...KIRO_DATA.teams.slice(0, 8).map((team) => ({
        id: `team:${team.id}`,
        label: `${team.name} · Team`,
        scopeType: "Team" as const,
      })),
      ...KIRO_DATA.engineers.slice(0, 8).map((engineer) => ({
        id: `engineer:${engineer.userId}`,
        label: `${engineer.name} · Engineer`,
        scopeType: "Engineer" as const,
      })),
    ];
  }, []);

  const selectedReport = generatedReports.find((report) => report.id === selectedReportId) ?? generatedReports[0];
  const reportScope = useMemo(
    () => resolveScopedDataset(selectedReport?.scopeType ?? "Enterprise", selectedReport?.scopeId ?? "enterprise"),
    [selectedReport],
  );
  const topUseCaseMax = reportScope.useCases[0]?.totalConsumption ?? 0;

  const evidencePacks = useMemo(
    () =>
      KIRO_DATA.recommendations
        .filter((recommendation) => recommendation.evidenceInteractionIds.length > 0)
        .slice(0, 5)
        .map((recommendation) => ({
          id: recommendation.id,
          title: recommendation.title,
          scopeLabel: recommendation.scopeLabel,
          interactionId: recommendation.evidenceInteractionIds[0],
          itemCount: recommendation.evidenceInteractionIds.length,
        })),
    [],
  );
  const maxEvidencePackItems = evidencePacks[0]?.itemCount ?? 0;

  const promptInspections = useMemo(
    () =>
      KIRO_DATA.interactions
        .filter((interaction) => interaction.evidence.chatCount > 0)
        .slice(0, 6),
    [],
  );
  const maxPromptInspectionCredits = promptInspections[0]?.estimatedCredits ?? 0;
  const reportStatusMix = useMemo(
    () =>
      [
        { name: "Completed", value: generatedReports.filter((report) => report.status === "Completed").length, color: "#14b8a6" },
        { name: "Processing", value: generatedReports.filter((report) => report.status === "Processing").length, color: "#3b82f6" },
        { name: "Stale", value: generatedReports.filter((report) => report.status === "Stale").length, color: "#f59e0b" },
      ].filter((item) => item.value > 0),
    [generatedReports],
  );
  const headerStats = [
    {
      label: "Report Queue",
      value: `${generatedReports.length} outputs`,
      note: `${reportStatusMix.find((item) => item.name === "Processing")?.value ?? 0} are currently refreshing.`,
    },
    {
      label: "Evidence Packs",
      value: `${evidencePacks.length} curated`,
      note: `${maxEvidencePackItems} linked items in the richest evidence pack.`,
    },
    {
      label: "Prompt Inspections",
      value: `${promptInspections.length} traces`,
      note: maxPromptInspectionCredits
        ? `${formatConsumption(maxPromptInspectionCredits)} credits is the heaviest inspection in view.`
        : "No prompt inspections are currently attached.",
    },
    {
      label: "Scope Consumption",
      value: `${formatConsumption(reportScope.totalConsumption)} credits`,
      note: `${reportScope.recommendations.length} linked recommendations support the active report scope.`,
    },
  ];
  const reportJourney = [
    {
      label: "Queue",
      detail: "Select or generate the report you want to package.",
      state: "complete" as const,
    },
    {
      label: "Summarize",
      detail: "Read the executive conclusion and the scoped operating metrics.",
      state: "active" as const,
    },
    {
      label: "Evidence",
      detail: "Open the supporting prompt, interaction, and recommendation packs.",
      state: "upcoming" as const,
    },
    {
      label: "Export",
      detail: "Turn the recommendation path into a reusable stakeholder artifact.",
      state: "upcoming" as const,
    },
  ];

  const handleGenerate = () => {
    const option = scopeOptions.find((item) => item.id === draftScopeId);
    if (!option) return;

    setIsGenerating(true);
    window.setTimeout(() => {
      const scopeType = option.scopeType;
      const scopeId = scopeType === "Enterprise" ? "enterprise" : option.id.split(":")[1] ?? "enterprise";
      const dataset = resolveScopedDataset(scopeType, scopeId);
      const nextReport: ReportEntry = {
        id: `rep-${Date.now()}`,
        title: buildReportTitle(scopeType, dataset.label),
        scopeLabel: dataset.label,
        audience: draftAudience,
        status: "Processing",
        generatedAt: `${KIRO_DATA.meta.lastUpdated} · ${draftPeriod}`,
        executiveSummary: buildExecutiveSummary(dataset, draftAudience),
        scopeType,
        scopeId,
      };

      setGeneratedReports((current) => [nextReport, ...current]);
      setSelectedReportId(nextReport.id);
      setIsGenerating(false);
      setShowGenerateModal(false);
    }, 900);
  };

  return (
    <div className="p-8 max-w-[1640px] mx-auto space-y-8 animate-in fade-in duration-500 relative">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      {showGenerateModal ? (
        <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center px-4">
          <Card className="w-full max-w-xl bg-[#121A2B] border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20">
              <div>
                <h3 className="font-semibold text-white">Generate Strategic Report</h3>
                <p className="text-xs text-slate-400 mt-1">Build a focused report from the current telemetry snapshot.</p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setShowGenerateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-5">
              <ModalField label="Scope">
                <select
                  value={draftScopeId}
                  onChange={(event) => setDraftScopeId(event.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {scopeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="Audience">
                <select
                  value={draftAudience}
                  onChange={(event) => setDraftAudience(event.target.value as Audience)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Executive Sponsor">Executive Sponsor</option>
                  <option value="Delivery Manager">Delivery Manager</option>
                  <option value="Architect">Architect</option>
                </select>
              </ModalField>

              <ModalField label="Reporting Period">
                <select
                  value={draftPeriod}
                  onChange={(event) => setDraftPeriod(event.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Quarter to Date">Quarter to Date</option>
                  <option value="Year to Date">Year to Date</option>
                </select>
              </ModalField>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5 bg-black/20">
              <Button
                variant="outline"
                className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-500 text-white min-w-36"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Report"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <ExperienceHeader
        eyebrow="Executive Output"
        title="Reports & Evidence"
        lead="Choose a report, scan the conclusion, and open the supporting evidence without breaking the decision narrative."
        stats={headerStats}
        journey={reportJourney}
        actions={
          <>
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share Hub
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              onClick={() => setShowGenerateModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Strategic Report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <CardTitle className="dashboard-card-title text-slate-200">Report Production Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid gap-3 md:grid-cols-3">
              {reportStatusMix.map((item) => (
                <SummaryRail key={item.name} label={item.name} value={item.value} max={generatedReports.length} color={item.color} />
              ))}
            </div>
            <div className="rounded-2xl border border-white/6 bg-[#0b1120] px-4 py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                {reportStatusMix.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-center gap-2">
                    {index > 0 ? <span className="text-slate-600">→</span> : null}
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-1">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The reporting surface now reads as a production flow rather than a static pie, making it easier to understand what is fresh, what is in motion, and what needs regeneration.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-white/6 bg-[#0d1526] px-4 py-3">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <SummaryChip label="Reports" value={String(generatedReports.length)} />
            <SummaryChip label="Evidence Packs" value={String(evidencePacks.length)} />
            <SummaryChip label="Inspections" value={String(promptInspections.length)} />
            <SummaryChip label="Scope Consumption" value={`${formatConsumption(reportScope.totalConsumption)} credits`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.25fr_0.8fr] gap-6">
        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <p className="dashboard-eyebrow">1. Select Report</p>
            <CardTitle className="dashboard-card-title text-slate-200">Report Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {generatedReports.map((report) => {
                const isActive = report.id === selectedReportId;
                const statusClass =
                  report.status === "Completed"
                    ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                    : report.status === "Processing"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/20";

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full text-left p-4 transition-colors ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">{report.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{report.scopeLabel}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className="bg-white/5 text-slate-300 border-white/10">{report.audience}</Badge>
                          <Badge className={statusClass}>{report.status}</Badge>
                        </div>
                      </div>
                      <span className="max-w-28 text-right text-xs leading-5 text-slate-500">{report.generatedAt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <p className="dashboard-eyebrow">2. Read Summary</p>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <CardTitle className="dashboard-card-title text-slate-200">
                  {selectedReport?.title ?? "Report Preview"}
                </CardTitle>
                <CardDescription className="text-slate-400">{selectedReport?.scopeLabel ?? "Enterprise"} · {selectedReport?.audience ?? "Executive Sponsor"}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <section className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
              <p className="dashboard-eyebrow mb-3">Conclusion</p>
              <p className="text-sm leading-relaxed text-slate-300">
                {selectedReport ? selectedReport.executiveSummary : "Select a report to preview the strategic summary."}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard label="Scope AI Consumption" value={`${formatConsumption(reportScope.totalConsumption)} credits`} />
              <MetricCard label="Scope Overrun" value={`${formatConsumption(reportScope.overrun)} credits`} />
              <MetricCard label="Top Cost Driver" value={reportScope.topUseCase} />
              <MetricCard label="Primary Model Pressure" value={reportScope.topModel} />
            </div>

            <section className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="dashboard-eyebrow mb-3">Actions</p>
              <div className="space-y-3">
                {reportScope.recommendations.slice(0, 2).map((recommendation) => (
                  <div key={recommendation.id} className="rounded-xl border border-white/5 bg-[#0b1120] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{recommendation.title}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{recommendation.recommendedAction}</p>
                      </div>
                      <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendation.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="dashboard-eyebrow mb-3">Cost Drivers</p>
              <div className="space-y-3">
                {reportScope.useCases.slice(0, 3).map((useCase) => (
                  <div key={useCase.key} className="rounded-xl border border-white/5 bg-[#0b1120] p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-100">{useCase.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{useCase.dominantModel}</p>
                      </div>
                      <span className="text-sm text-slate-200 whitespace-nowrap">
                        {formatConsumption(useCase.totalConsumption)} credits
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-white/6 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#14b8a6)]"
                        style={{
                          width: `${topUseCaseMax ? Math.max(20, (useCase.totalConsumption / topUseCaseMax) * 100) : 20}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <p className="dashboard-eyebrow">3. Open Evidence</p>
              <CardTitle className="dashboard-card-title text-slate-200">Evidence Packs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
                {evidencePacks.map((pack) => (
                  <div key={pack.id} className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-100">{pack.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{pack.scopeLabel}</p>
                      </div>
                      <Badge className="bg-white/5 text-slate-300 border-white/10">{pack.itemCount} items</Badge>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-white/6 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                        style={{
                          width: `${maxEvidencePackItems ? Math.max(18, (pack.itemCount / maxEvidencePackItems) * 100) : 18}%`,
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
                      onClick={() => setEvidenceInteractionId(pack.interactionId)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Open Evidence
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200">Recent Prompt Inspections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="grid grid-cols-2 gap-3">
                <SummaryChip label="Inspections" value={String(promptInspections.length)} />
                <SummaryChip
                  label="Peak Inspection"
                  value={maxPromptInspectionCredits ? `${formatConsumption(maxPromptInspectionCredits)} credits` : "None"}
                />
              </div>
              <div className="space-y-3">
                {promptInspections.map((interaction) => {
                  const width = maxPromptInspectionCredits
                    ? Math.max(18, (interaction.estimatedCredits / maxPromptInspectionCredits) * 100)
                    : 18;

                  return (
                    <button
                      key={interaction.id}
                      type="button"
                      onClick={() => setEvidenceInteractionId(interaction.id)}
                      className="w-full rounded-2xl border border-white/6 bg-[#0b1120] p-4 text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-100">{interaction.useCaseLabel}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {interaction.engineerName} · {interaction.costCenterName}
                          </p>
                        </div>
                        <Badge className="bg-white/5 text-slate-300 border-white/10 shrink-0">
                          {interaction.modelName}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-2.5 flex-1 rounded-full bg-white/6 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
                          {formatConsumption(interaction.estimatedCredits)} credits
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/6 bg-black/20 px-4 py-3 min-h-[76px]">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-sm md:text-[0.98rem] font-semibold leading-snug text-slate-100 text-balance">{value}</p>
    </div>
  );
}

function SummaryRail({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-black/20 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <span className="text-xs text-slate-400">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/6 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${max ? Math.max(12, (value / max) * 100) : 12}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function resolveScopeReference(scopeLabel: string): { scopeType: ScopeType; scopeId: string } {
  if (scopeLabel === "Enterprise") {
    return { scopeType: "Enterprise", scopeId: "enterprise" };
  }

  const costCenter = KIRO_DATA.costCenters.find((item) => item.name === scopeLabel);
  if (costCenter) {
    return { scopeType: "Cost Center", scopeId: costCenter.id };
  }

  const team = KIRO_DATA.teams.find((item) => item.name === scopeLabel);
  if (team) {
    return { scopeType: "Team", scopeId: team.id };
  }

  const engineer = KIRO_DATA.engineers.find((item) => item.name === scopeLabel);
  if (engineer) {
    return { scopeType: "Engineer", scopeId: engineer.userId };
  }

  return { scopeType: "Enterprise", scopeId: "enterprise" };
}

function resolveScopedDataset(scopeType: ScopeType, scopeId: string) {
  if (scopeType === "Enterprise") {
    return {
      label: "Enterprise",
      totalConsumption: KIRO_DATA.kpis.totalConsumption,
      overrun: KIRO_DATA.kpis.overrun,
      topUseCase: KIRO_DATA.kpis.topUseCase,
      topModel: KIRO_DATA.costCenters[0]?.topModel ?? "N/A",
      useCases: KIRO_DATA.useCases,
      recommendations: KIRO_DATA.recommendations,
      interactions: KIRO_DATA.interactions,
    };
  }

  if (scopeType === "Cost Center") {
    const costCenter = KIRO_DATA.costCenters.find((item) => item.id === scopeId) ?? KIRO_DATA.costCenters[0];
    return {
      label: costCenter?.name ?? "Cost Center",
      totalConsumption: costCenter?.totalConsumption ?? 0,
      overrun: costCenter?.overrun ?? 0,
      topUseCase: costCenter?.topUseCase ?? "N/A",
      topModel: costCenter?.topModel ?? "N/A",
      useCases: getUseCaseSummariesForScope({ costCenterId: costCenter?.id }),
      recommendations: getRecommendationsForScope("Cost Center", costCenter?.id ?? ""),
      interactions: getInteractionsForScope({ costCenterId: costCenter?.id }),
    };
  }

  if (scopeType === "Team") {
    const team = KIRO_DATA.teams.find((item) => item.id === scopeId) ?? KIRO_DATA.teams[0];
    return {
      label: team?.name ?? "Team",
      totalConsumption: team?.totalConsumption ?? 0,
      overrun: team?.overrun ?? 0,
      topUseCase: team?.topUseCase ?? "N/A",
      topModel: team?.topModel ?? "N/A",
      useCases: getUseCaseSummariesForScope({ teamId: team?.id }),
      recommendations: getRecommendationsForScope("Team", team?.id ?? ""),
      interactions: getInteractionsForScope({ teamId: team?.id }),
    };
  }

  const engineer = KIRO_DATA.engineers.find((item) => item.userId === scopeId) ?? KIRO_DATA.engineers[0];
  return {
    label: engineer?.name ?? "Engineer",
    totalConsumption: engineer?.totalConsumption ?? 0,
    overrun: engineer?.overrun ?? 0,
    topUseCase: engineer?.topUseCase ?? "N/A",
    topModel: engineer?.topModel ?? "N/A",
    useCases: getUseCaseSummariesForScope({ engineerId: engineer?.userId }),
    recommendations: [
      ...getRecommendationsForScope("Engineer", engineer?.userId ?? ""),
      ...getRecommendationsForScope("Team", engineer?.teamId ?? ""),
    ].filter((recommendation, index, all) => all.findIndex((item) => item.id === recommendation.id) === index),
    interactions: getInteractionsForScope({ engineerId: engineer?.userId }),
  };
}

function buildReportTitle(scopeType: ScopeType, label: string) {
  if (scopeType === "Enterprise") return "Enterprise AI Governance Review";
  if (scopeType === "Cost Center") return `${label} Strategic Governance Review`;
  if (scopeType === "Team") return `${label} Team Optimization Report`;
  return `${label} Engineer Activity Review`;
}

function buildExecutiveSummary(
  dataset: ReturnType<typeof resolveScopedDataset>,
  audience: Audience,
) {
  const action = dataset.recommendations[0];
  const audienceLead =
    audience === "Executive Sponsor"
      ? "Leadership should focus first on concentration, overrun posture, and route-to-value controls."
      : audience === "Delivery Manager"
        ? "Delivery leadership should focus on workflow ownership, prompt discipline, and team-level model choices."
        : "Architecture review should focus on use-case fit, model routing, and tool-driven context expansion.";

  return `${audienceLead} ${dataset.label} currently drives ${formatConsumption(dataset.totalConsumption)} credits with ${formatConsumption(dataset.overrun)} overrun credits. ${
    action ? `Top recommended action: ${action.title}.` : "No single recommendation dominates this slice."
  }`;
}

function ModalField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="dashboard-body">{label}</label>
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
      <p className="dashboard-metric-label">{label}</p>
      <p className="dashboard-metric-value mt-3">{value}</p>
    </div>
  );
}
