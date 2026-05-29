import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Eye,
  PlayCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { ExperienceHeader } from "@/components/experience/ExperienceHeader";
import { LollipopRanking } from "@/components/experience/LollipopRanking";
import { SignalRing } from "@/components/experience/SignalRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KIRO_DATA, formatConsumption, getInteractionById } from "@/lib/kiro-data";
import type { AdvisorRun, InteractionSummary, Recommendation } from "@/lib/kiro-data";

const severityStyles = {
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Low: "bg-blue-500/10 text-blue-300 border-blue-500/20",
} as const;

const statusStyles = {
  Completed: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  Running: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  Queued: "bg-amber-500/10 text-amber-300 border-amber-500/20",
} as const;

const severityOrder = {
  High: 0,
  Medium: 1,
  Low: 2,
} as const;

const confidenceStyles = {
  High: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Low: "bg-slate-500/10 text-slate-300 border-slate-500/20",
} as const;

type RecommendationInsight = {
  recommendation: Recommendation;
  evidence: InteractionSummary[];
  scopeExposure: number;
  overrunExposure: number;
  proofCredits: number;
  confidence: "High" | "Medium" | "Low";
  owner: string;
  horizon: string;
  nextStep: string;
  proofSummary: string;
  scopeSummary: string;
  priorityScore: number;
  relevantRuns: AdvisorRun[];
};

export default function Recommendations() {
  const recommendationInsights = useMemo(
    () =>
      [...KIRO_DATA.recommendations]
        .map((recommendation) => deriveRecommendationInsight(recommendation))
        .sort((left, right) => {
          const severityDelta = severityOrder[left.recommendation.severity] - severityOrder[right.recommendation.severity];
          if (severityDelta !== 0) return severityDelta;
          return right.priorityScore - left.priorityScore;
        }),
    [],
  );
  const insightById = useMemo(
    () => new Map(recommendationInsights.map((insight) => [insight.recommendation.id, insight])),
    [recommendationInsights],
  );

  const [location] = useLocation();
  const routeState = useMemo(() => parseRecommendationsUrlState(), [location]);
  const selectedRecommendationId = routeState.recId ?? recommendationInsights[0]?.recommendation.id ?? "";
  const evidenceInteractionId = routeState.evidenceId;

  const selectedInsight =
    insightById.get(selectedRecommendationId) ?? recommendationInsights[0];
  const selectedRecommendation = selectedInsight?.recommendation;

  useEffect(() => {
    if (!recommendationInsights[0]) return;
    if (!routeState.recId || !insightById.has(routeState.recId)) {
      navigateRecommendationsState({
        recId: recommendationInsights[0].recommendation.id,
        evidenceId: routeState.evidenceId,
        replace: true,
      });
    }
  }, [insightById, recommendationInsights, routeState.evidenceId, routeState.recId]);

  const recommendationSections = useMemo(
    () => [
      {
        title: "Leadership",
        recommendations: recommendationInsights.filter((insight) => insight.recommendation.severity === "High"),
      },
      {
        title: "Program",
        recommendations: recommendationInsights.filter((insight) => insight.recommendation.severity === "Medium"),
      },
      {
        title: "Background",
        recommendations: recommendationInsights.filter((insight) => insight.recommendation.severity === "Low"),
      },
    ].filter((section) => section.recommendations.length > 0),
    [recommendationInsights],
  );

  const actionTypeCount = useMemo(
    () => new Set(recommendationInsights.map((insight) => insight.recommendation.type)).size,
    [recommendationInsights],
  );

  const severityMix = useMemo(
    () => [
      { name: "High", value: recommendationInsights.filter((item) => item.recommendation.severity === "High").length, color: "#f97316" },
      { name: "Medium", value: recommendationInsights.filter((item) => item.recommendation.severity === "Medium").length, color: "#f59e0b" },
      { name: "Low", value: recommendationInsights.filter((item) => item.recommendation.severity === "Low").length, color: "#3b82f6" },
    ].filter((item) => item.value > 0),
    [recommendationInsights],
  );

  const actionMix = useMemo(
    () =>
      Array.from(
        recommendationInsights.reduce((acc, insight) => {
          acc.set(insight.recommendation.type, (acc.get(insight.recommendation.type) || 0) + 1);
          return acc;
        }, new Map<string, number>()),
      )
        .map(([type, count]) => ({ type, count }))
        .sort((left, right) => right.count - left.count)
        .slice(0, 6),
    [recommendationInsights],
  );

  const totalEvidenceLinks = useMemo(
    () => recommendationInsights.reduce((sum, insight) => sum + insight.evidence.length, 0),
    [recommendationInsights],
  );
  const maxEvidenceLinks = recommendationInsights.reduce((max, insight) => Math.max(max, insight.evidence.length), 0);
  const primaryEvidence = selectedInsight?.evidence[0] ?? null;
  const highSeverityCount = recommendationInsights.filter((insight) => insight.recommendation.severity === "High").length;
  const topSignals = selectedRecommendation?.supportingSignals.slice(0, 3) ?? [];
  const relevantRuns = selectedInsight?.relevantRuns ?? [];
  const headerStats = [
    {
      label: "Decision Queue",
      value: `${recommendationInsights.length} actions`,
      note: `${highSeverityCount} items are in leadership focus right now.`,
    },
    {
      label: "Protected Scope",
      value: `${formatConsumption(selectedInsight?.scopeExposure ?? 0)} credits`,
      note: selectedInsight ? `${selectedInsight.owner} owns the next move for the active recommendation.` : "Select a recommendation to inspect scope exposure.",
    },
    {
      label: "Proof Coverage",
      value: `${totalEvidenceLinks} direct traces`,
      note: `${maxEvidenceLinks} linked traces back the most heavily evidenced recommendation.`,
    },
    {
      label: "Intervention Breadth",
      value: `${actionTypeCount} action types`,
      note: `${actionMix[0]?.type ?? "Model Routing"} appears most often in the current queue.`,
    },
  ];
  const journey = [
    {
      label: "Prioritize",
      detail: "Separate leadership actions from background optimization noise.",
      state: "active" as const,
    },
    {
      label: "Inspect",
      detail: "Open the recommendation, then validate it against concrete signals and evidence.",
      state: "upcoming" as const,
    },
    {
      label: "Simulate",
      detail: "Send the selected action into the policy studio before rollout.",
      state: "upcoming" as const,
    },
    {
      label: "Execute",
      detail: "Publish the decision path into reports and operating handoffs.",
      state: "upcoming" as const,
    },
  ];

  return (
    <div className="p-8 max-w-[1760px] mx-auto space-y-6 animate-in fade-in duration-500">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      <ExperienceHeader
        eyebrow="Decision Queue"
        title="Recommendations"
        lead="Prioritize the interventions with the clearest business signal, inspect the evidence, and route the right actions into simulation or reporting."
        stats={headerStats}
        journey={journey}
        actions={
          <>
            <Link href="/explorer">
              <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
                <Target className="w-4 h-4 mr-2 text-slate-300" />
                Open Explorer Reference
              </Button>
            </Link>
            <Link href="/studio">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.18)]">
                <PlayCircle className="w-4 h-4 mr-2" />
                Run New Scenario
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
                <Sparkles className="w-4 h-4 mr-2 text-blue-300" />
                Generate Strategic Report
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)] 2xl:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.1fr)_minmax(280px,0.76fr)]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 2xl:hidden">
            <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-black/20 border-b border-white/5">
                <CardTitle className="dashboard-card-title text-slate-100">Priority Pressure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <SignalRing
                  title="Severity distribution"
                  centerLabel="total actions"
                  centerValue={String(recommendationInsights.length)}
                  items={severityMix.map((item) => ({
                    label: item.name,
                    value: item.value,
                    color: item.color,
                  }))}
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <SummaryChip label="Leadership" value={`${highSeverityCount} immediate`} />
                  <SummaryChip label="Program" value={String(recommendationSections.find((section) => section.title === "Program")?.recommendations.length ?? 0)} />
                  <SummaryChip label="Background" value={String(recommendationSections.find((section) => section.title === "Background")?.recommendations.length ?? 0)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="dashboard-card-title text-slate-100">Recommendation Queue</CardTitle>
                  <p className="mt-2 text-sm text-slate-400">Scan by urgency, then confirm scope exposure, proof coverage, and owner before taking action.</p>
                </div>
                <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendationInsights.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {recommendationSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <p className="dashboard-section-title">{section.title}</p>
                    <Badge className="bg-white/5 text-slate-300 border-white/10">{section.recommendations.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {section.recommendations.map((insight) => {
                      const recommendation = insight.recommendation;
                      const proofCoverageWidth = maxEvidenceLinks
                        ? Math.max(16, (insight.evidence.length / maxEvidenceLinks) * 100)
                        : 16;

                      return (
                        <button
                          key={recommendation.id}
                          type="button"
                          onClick={() => setSelectedRecommendationId(recommendation.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition-all ${
                            recommendation.id === selectedRecommendation?.id
                              ? "border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.16)]"
                              : "border-white/6 bg-[#0b1120] hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={severityStyles[recommendation.severity]}>{recommendation.severity}</Badge>
                                <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendation.type}</Badge>
                                <Badge className={confidenceStyles[insight.confidence]}>{insight.confidence} confidence</Badge>
                              </div>
                              <p className="dashboard-item-title">{recommendation.title}</p>
                              <p className="dashboard-muted-body">{recommendation.whyItMatters}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">{insight.scopeSummary}</span>
                                <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">{insight.owner}</span>
                                <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">{insight.horizon}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/6">
                                  <div
                                    className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                                    style={{ width: `${proofCoverageWidth}%` }}
                                  />
                                </div>
                                <span className="whitespace-nowrap text-xs text-slate-500">{insight.proofSummary}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedRecommendation && selectedInsight ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:hidden">
              <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
                <CardHeader className="bg-black/20 border-b border-white/5">
                  <CardTitle className="dashboard-card-title text-slate-100">Intervention Spectrum</CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <LollipopRanking
                    title="Action coverage ladder"
                    description="Shows which intervention types dominate the queue right now."
                    items={actionMix.map((item) => ({
                      label: item.type,
                      value: item.count,
                      displayValue: `${item.count}`,
                    }))}
                  />
                </CardContent>
              </Card>

              {primaryEvidence ? (
                <div className="rounded-2xl border border-white/6 bg-[#111827] p-5 shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="dashboard-eyebrow">Primary Evidence Anchor</p>
                      <p className="mt-2 text-sm font-medium text-slate-200">
                        {primaryEvidence.useCaseLabel} · {primaryEvidence.engineerName}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-white/5"
                      onClick={() => setEvidenceInteractionId(primaryEvidence.id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Inspect
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <MiniMetric label="Credits" value={`${formatConsumption(primaryEvidence.estimatedCredits)}`} />
                    <MiniMetric label="Model" value={primaryEvidence.modelName} />
                    <MiniMetric label="Source" value={primaryEvidence.requestSource} />
                  </div>
                </div>
              ) : (
                <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
                  <CardHeader className="bg-black/20 border-b border-white/5">
                    <CardTitle className="dashboard-card-title text-slate-100">Intervention Spectrum</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <LollipopRanking
                      title="Action coverage ladder"
                      description="Shows which intervention types dominate the queue right now."
                      items={actionMix.map((item) => ({
                        label: item.type,
                        value: item.count,
                        displayValue: `${item.count}`,
                      }))}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-black/20 border-b border-white/5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={severityStyles[selectedRecommendation.severity]}>{selectedRecommendation.severity}</Badge>
                      <Badge className="bg-white/5 text-slate-300 border-white/10">{selectedRecommendation.type}</Badge>
                      <Badge className="bg-white/5 text-slate-300 border-white/10">{selectedRecommendation.scopeType}</Badge>
                      <Badge className={confidenceStyles[selectedInsight.confidence]}>{selectedInsight.confidence} confidence</Badge>
                    </div>
                    <div>
                      <CardTitle className="text-[1.45rem] leading-tight text-white">{selectedRecommendation.title}</CardTitle>
                      <p className="mt-2 text-sm text-slate-400">{selectedRecommendation.scopeLabel}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {primaryEvidence ? (
                      <Button
                        variant="outline"
                        className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
                        onClick={() => setEvidenceInteractionId(primaryEvidence.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open Evidence
                      </Button>
                    ) : null}
                    <Link href="/studio">
                      <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                        <Zap className="w-4 h-4 mr-2" />
                        Simulate Policy
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <SummaryChip label="Scope Exposure" value={`${formatConsumption(selectedInsight.scopeExposure)} credits`} />
                  <SummaryChip
                    label="Overrun Pressure"
                    value={selectedInsight.overrunExposure > 0 ? `${formatConsumption(selectedInsight.overrunExposure)} credits` : "Within current plan"}
                  />
                  <SummaryChip label="Decision Owner" value={selectedInsight.owner} />
                  <SummaryChip label="Next Horizon" value={selectedInsight.horizon} />
                </div>

                {selectedInsight.evidence.length ? (
                  <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="dashboard-eyebrow">Evidence Links</p>
                        <p className="mt-2 text-sm text-slate-400">
                          Open the exact traces backing this recommendation without hunting through the page.
                        </p>
                      </div>
                      <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-slate-400">
                        {selectedInsight.evidence.length} linked traces
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedInsight.evidence.map((interaction, index) => (
                        <Button
                          key={interaction.id}
                          variant="outline"
                          size="sm"
                          className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
                          onClick={() => setEvidenceInteractionId(interaction.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Trace {index + 1}: {interaction.useCaseLabel}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <p className="mb-3 dashboard-eyebrow">Why It Matters</p>
                      <p className="dashboard-body text-slate-100">{selectedRecommendation.whyItMatters}</p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <p className="mb-3 dashboard-eyebrow">Action</p>
                      <p className="dashboard-body text-slate-100">{selectedRecommendation.recommendedAction}</p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="dashboard-section-title">Expected Outcome</h3>
                        <span className="dashboard-eyebrow">{selectedInsight.scopeSummary}</span>
                      </div>
                      <p className="dashboard-body text-slate-200">{selectedRecommendation.expectedImpact}</p>
                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <MiniMetric label="Proof Coverage" value={selectedInsight.proofSummary} />
                        <MiniMetric label="Next Step" value={selectedInsight.nextStep} />
                        <MiniMetric label="Escalation Window" value={selectedInsight.horizon} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="dashboard-section-title">Evidence Signals</h3>
                        <span className="dashboard-eyebrow">{topSignals.length}</span>
                      </div>
                      <div className="space-y-3">
                        {topSignals.map((signal, index) => {
                          const linkedEvidence = selectedInsight.evidence[index] ?? selectedInsight.evidence[0] ?? null;
                          return (
                            <div key={signal} className="rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                  <span className="dashboard-body">{signal}</span>
                                </div>
                                {linkedEvidence ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 text-slate-300 hover:text-white hover:bg-white/5"
                                    onClick={() => setEvidenceInteractionId(linkedEvidence.id)}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View trace
                                  </Button>
                                ) : null}
                              </div>
                              {linkedEvidence ? (
                                <p className="mt-3 text-xs text-slate-500">
                                  {linkedEvidence.useCaseLabel} · {linkedEvidence.engineerName} · {formatConsumption(linkedEvidence.estimatedCredits)} credits
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                        {!topSignals.length ? (
                          <div className="flex items-start gap-3 rounded-xl border border-dashed border-white/10 bg-black/20 px-3 py-3">
                            <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                            <span className="dashboard-muted-body">No stronger-than-baseline signals were attached to this recommendation.</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 2xl:hidden">
                    <ProofChainCard
                      evidence={selectedInsight.evidence}
                      onOpenEvidence={setEvidenceInteractionId}
                    />

                    <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
                      <CardHeader className="bg-black/20 border-b border-white/5">
                        <CardTitle className="dashboard-card-title text-slate-100">Relevant Decision Runs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-5">
                        {relevantRuns.map((run) => (
                          <div key={run.id} className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-slate-100">{run.title}</p>
                                <p className="mt-1 text-sm text-slate-400">{run.scopeLabel}</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500">{run.summary}</p>
                              </div>
                              <Badge className={statusStyles[run.status]}>{run.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="hidden space-y-6 2xl:block">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Priority Pressure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
                <SignalRing
                  title="Severity distribution"
                  centerLabel="total actions"
                  centerValue={String(recommendationInsights.length)}
                items={severityMix.map((item) => ({
                  label: item.name,
                  value: item.value,
                  color: item.color,
                }))}
              />
              <div className="grid gap-3">
                <SummaryChip label="Leadership" value={`${highSeverityCount} immediate`} />
                <SummaryChip label="Program" value={String(recommendationSections.find((section) => section.title === "Program")?.recommendations.length ?? 0)} />
                <SummaryChip label="Background" value={String(recommendationSections.find((section) => section.title === "Background")?.recommendations.length ?? 0)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Intervention Spectrum</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <LollipopRanking
                title="Action coverage ladder"
                description="Shows which intervention types dominate the queue right now."
                items={actionMix.map((item) => ({
                  label: item.type,
                  value: item.count,
                  displayValue: `${item.count}`,
                }))}
              />
            </CardContent>
          </Card>

          {primaryEvidence ? (
            <div className="rounded-2xl border border-white/6 bg-[#111827] p-5 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="dashboard-eyebrow">Primary Evidence Anchor</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {primaryEvidence.useCaseLabel} · {primaryEvidence.engineerName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/5"
                  onClick={() => setEvidenceInteractionId(primaryEvidence.id)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Inspect
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <MiniMetric label="Credits" value={`${formatConsumption(primaryEvidence.estimatedCredits)}`} />
                <MiniMetric label="Model" value={primaryEvidence.modelName} />
                <MiniMetric label="Source" value={primaryEvidence.requestSource} />
                <MiniMetric label="Proof Coverage" value={selectedInsight.proofSummary} />
              </div>
            </div>
          ) : null}

          <ProofChainCard
            evidence={selectedInsight.evidence}
            onOpenEvidence={setEvidenceInteractionId}
          />

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Relevant Decision Runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {relevantRuns.map((run) => (
                <div key={run.id} className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{run.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{run.scopeLabel}</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{run.summary}</p>
                    </div>
                    <Badge className={statusStyles[run.status]}>{run.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProofChainCard({
  evidence,
  onOpenEvidence,
}: {
  evidence: InteractionSummary[];
  onOpenEvidence: (interactionId: string) => void;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
      <CardHeader className="bg-black/20 border-b border-white/5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="dashboard-card-title text-slate-100">Proof Chain</CardTitle>
          <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs text-slate-400">
            {evidence.length} traces
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {evidence.map((interaction, index) => (
          <button
            key={interaction.id}
            type="button"
            onClick={() => onOpenEvidence(interaction.id)}
            className="w-full rounded-2xl border border-white/6 bg-[#0b1120] p-4 text-left transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100">
                  Trace {index + 1}: {interaction.useCaseLabel}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {interaction.engineerName} · {interaction.modelName} · {interaction.requestSource}
                </p>
              </div>
              <span className="whitespace-nowrap text-sm font-medium text-slate-200">
                {formatConsumption(interaction.estimatedCredits)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">
                {interaction.evidence.chatCount} chat traces
              </span>
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">
                {interaction.evidence.inlineCount} inline traces
              </span>
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1">
                {interaction.promptChars.toLocaleString()} prompt chars
              </span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-snug text-white text-balance">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/6 bg-[#0b1120] px-3 py-3">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function deriveRecommendationInsight(recommendation: Recommendation): RecommendationInsight {
  const evidence = recommendation.evidenceInteractionIds
    .map((interactionId) => getInteractionById(interactionId))
    .filter((interaction): interaction is InteractionSummary => Boolean(interaction));
  const scopeMetrics = resolveScopeMetrics(recommendation);
  const proofCredits = evidence.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0);
  const richEvidenceCount = evidence.filter((interaction) => interaction.evidence.chatCount > 0 || interaction.evidence.inlineCount > 0).length;
  const confidenceScore = evidence.length * 2 + Math.min(recommendation.supportingSignals.length, 3) + richEvidenceCount;
  const confidence: RecommendationInsight["confidence"] =
    confidenceScore >= 7 ? "High" : confidenceScore >= 4 ? "Medium" : "Low";
  const owner = resolveRecommendationOwner(recommendation);
  const horizon =
    recommendation.severity === "High"
      ? "Act before next report"
      : recommendation.severity === "Medium"
        ? "Plan this cycle"
        : "Monitor and coach";
  const nextStep = resolveNextStep(recommendation);
  const scopeSummary =
    scopeMetrics.overrun > 0
      ? `${formatConsumption(scopeMetrics.totalConsumption)} credits in scope · ${formatConsumption(scopeMetrics.overrun)} overrun`
      : `${formatConsumption(scopeMetrics.totalConsumption)} credits in scope`;
  const proofSummary = `${evidence.length} direct traces · ${recommendation.supportingSignals.length} signals`;
  const priorityScore =
    (recommendation.severity === "High" ? 300 : recommendation.severity === "Medium" ? 200 : 100) +
    scopeMetrics.totalConsumption +
    scopeMetrics.overrun * 2 +
    evidence.length * 35 +
    richEvidenceCount * 20;
  const relevantRuns = KIRO_DATA.runs.filter((run) => isRunRelevant(run, recommendation)).slice(0, 3);

  return {
    recommendation,
    evidence,
    scopeExposure: scopeMetrics.totalConsumption,
    overrunExposure: scopeMetrics.overrun,
    proofCredits,
    confidence,
    owner,
    horizon,
    nextStep,
    proofSummary,
    scopeSummary,
    priorityScore,
    relevantRuns: relevantRuns.length ? relevantRuns : KIRO_DATA.runs.slice(0, 2),
  };
}

function resolveScopeMetrics(recommendation: Recommendation) {
  if (recommendation.scopeType === "Enterprise") {
    return {
      totalConsumption: KIRO_DATA.kpis.totalConsumption,
      overrun: KIRO_DATA.kpis.overrun,
    };
  }

  if (recommendation.scopeType === "Cost Center") {
    const scope = KIRO_DATA.costCenters.find((item) => item.id === recommendation.scopeId);
    return {
      totalConsumption: scope?.totalConsumption ?? 0,
      overrun: scope?.overrun ?? 0,
    };
  }

  if (recommendation.scopeType === "Team") {
    const scope = KIRO_DATA.teams.find((item) => item.id === recommendation.scopeId);
    return {
      totalConsumption: scope?.totalConsumption ?? 0,
      overrun: scope?.overrun ?? 0,
    };
  }

  if (recommendation.scopeType === "Engineer") {
    const scope = KIRO_DATA.engineers.find((item) => item.userId === recommendation.scopeId);
    return {
      totalConsumption: scope?.totalConsumption ?? 0,
      overrun: scope?.overrun ?? 0,
    };
  }

  if (recommendation.scopeType === "Use Case") {
    const scope = KIRO_DATA.useCases.find((item) => item.key === recommendation.scopeId);
    return {
      totalConsumption: scope?.totalConsumption ?? 0,
      overrun: 0,
    };
  }

  if (recommendation.scopeType === "Interaction") {
    const interaction = getInteractionById(recommendation.scopeId);
    return {
      totalConsumption: interaction?.estimatedCredits ?? 0,
      overrun: 0,
    };
  }

  return { totalConsumption: 0, overrun: 0 };
}

function resolveRecommendationOwner(recommendation: Recommendation) {
  if (recommendation.scopeType === "Cost Center") return "Cost center lead";
  if (recommendation.scopeType === "Team" || recommendation.scopeType === "Engineer") return "Engineering manager";

  switch (recommendation.type) {
    case "Model Routing":
    case "Steering Scope":
    case "Prompt Discipline":
      return "AI platform lead";
    case "Use Case Optimization":
      return "Workflow owner";
    case "Plugin Governance":
    case "MCP Governance":
      return "Platform governance";
    case "License Hygiene":
      return "Operations admin";
    case "Spend Concentration":
    case "Overrun Risk":
      return "Cost center lead";
    default:
      return "Delivery lead";
  }
}

function resolveNextStep(recommendation: Recommendation) {
  switch (recommendation.type) {
    case "Model Routing":
      return "Simulate lighter-model routing on the linked traces.";
    case "Steering Scope":
      return "Break the workflow into smaller delivery packets.";
    case "Use Case Optimization":
      return "Automate the deterministic step before the next sprint.";
    case "Spend Concentration":
      return "Review the top traces with the scope owner and add guardrails.";
    case "Overrun Risk":
      return "Set threshold alerts and route repeatable work to lower-cost defaults.";
    case "Plugin Governance":
    case "MCP Governance":
      return "Review tool access and narrow the expensive path.";
    case "License Hygiene":
      return "Reassign or retire the idle seats before renewal.";
    case "Team Coaching":
      return "Coach the team on default model and workflow choices.";
    default:
      return "Validate the evidence chain, then move the action into policy simulation.";
  }
}

function isRunRelevant(run: AdvisorRun, recommendation: Recommendation) {
  if (run.scopeLabel === recommendation.scopeLabel) return true;
  if (recommendation.scopeType === "Enterprise" && run.scopeLabel === "Enterprise") return true;

  const searchTerms = [
    recommendation.type,
    recommendation.scopeLabel,
    ...recommendation.title.toLowerCase().split(/\s+/).filter((term) => term.length > 5),
  ].map((term) => term.toLowerCase());
  const haystack = `${run.title} ${run.summary}`.toLowerCase();

  return searchTerms.some((term) => haystack.includes(term));
}
