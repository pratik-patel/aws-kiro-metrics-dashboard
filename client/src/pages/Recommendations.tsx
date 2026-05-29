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
import { Link } from "wouter";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { ExperienceHeader } from "@/components/experience/ExperienceHeader";
import { LollipopRanking } from "@/components/experience/LollipopRanking";
import { SignalRing } from "@/components/experience/SignalRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KIRO_DATA, formatConsumption, getInteractionById } from "@/lib/kiro-data";
import type { Recommendation } from "@/lib/kiro-data";

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

export default function Recommendations() {
  const sortedRecommendations = useMemo(
    () =>
      [...KIRO_DATA.recommendations].sort((a, b) => {
        const severityDelta = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDelta !== 0) return severityDelta;
        return b.evidenceInteractionIds.length - a.evidenceInteractionIds.length;
      }),
    [],
  );

  const [selectedRecommendationId, setSelectedRecommendationId] = useState(sortedRecommendations[0]?.id ?? "");
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);

  const selectedRecommendation =
    sortedRecommendations.find((recommendation) => recommendation.id === selectedRecommendationId) ?? sortedRecommendations[0];

  useEffect(() => {
    if (!selectedRecommendationId && sortedRecommendations[0]) {
      setSelectedRecommendationId(sortedRecommendations[0].id);
    }
  }, [selectedRecommendationId, sortedRecommendations]);

  const recommendationSections = useMemo(
    () => [
      {
        title: "Leadership",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "High"),
      },
      {
        title: "Program",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "Medium"),
      },
      {
        title: "Background",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "Low"),
      },
    ].filter((section) => section.recommendations.length > 0),
    [sortedRecommendations],
  );

  const actionTypeCount = useMemo(
    () => new Set(sortedRecommendations.map((recommendation) => recommendation.type)).size,
    [sortedRecommendations],
  );

  const severityMix = useMemo(
    () => [
      { name: "High", value: sortedRecommendations.filter((item) => item.severity === "High").length, color: "#f97316" },
      { name: "Medium", value: sortedRecommendations.filter((item) => item.severity === "Medium").length, color: "#f59e0b" },
      { name: "Low", value: sortedRecommendations.filter((item) => item.severity === "Low").length, color: "#3b82f6" },
    ].filter((item) => item.value > 0),
    [sortedRecommendations],
  );

  const actionMix = useMemo(
    () =>
      Array.from(
        sortedRecommendations.reduce((acc, recommendation) => {
          acc.set(recommendation.type, (acc.get(recommendation.type) || 0) + 1);
          return acc;
        }, new Map<string, number>()),
      )
        .map(([type, count]) => ({ type, count }))
        .sort((left, right) => right.count - left.count)
        .slice(0, 6),
    [sortedRecommendations],
  );

  const totalEvidenceLinks = useMemo(
    () => sortedRecommendations.reduce((sum, recommendation) => sum + recommendation.evidenceInteractionIds.length, 0),
    [sortedRecommendations],
  );
  const maxEvidenceLinks = sortedRecommendations[0]?.evidenceInteractionIds.length ?? 0;
  const primaryEvidence = selectedRecommendation ? getInteractionById(selectedRecommendation.evidenceInteractionIds[0]) : null;
  const highSeverityCount = sortedRecommendations.filter((recommendation) => recommendation.severity === "High").length;
  const topSignals = selectedRecommendation?.supportingSignals.slice(0, 3) ?? [];
  const recentRuns = KIRO_DATA.runs.slice(0, 3);
  const headerStats = [
    {
      label: "Decision Queue",
      value: `${sortedRecommendations.length} actions`,
      note: `${highSeverityCount} items are in leadership focus right now.`,
    },
    {
      label: "Evidence Strength",
      value: `${totalEvidenceLinks} links`,
      note: `${maxEvidenceLinks} linked interactions support the strongest single recommendation.`,
    },
    {
      label: "Intervention Breadth",
      value: `${actionTypeCount} action types`,
      note: `${actionMix[0]?.type ?? "Model Routing"} appears most often in the active queue.`,
    },
    {
      label: "Current Lead Motion",
      value: selectedRecommendation?.type ?? "Governance action",
      note: selectedRecommendation?.title ?? "Select a recommendation to inspect the action brief.",
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
                  centerValue={String(sortedRecommendations.length)}
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
                  <p className="mt-2 text-sm text-slate-400">Scan by urgency, then open a recommendation to inspect the action brief.</p>
                </div>
                <Badge className="bg-white/5 text-slate-300 border-white/10">{sortedRecommendations.length}</Badge>
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
                    {section.recommendations.map((recommendation) => (
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
                            </div>
                            <p className="dashboard-item-title">{recommendation.title}</p>
                            <p className="dashboard-muted-body">{recommendation.scopeLabel}</p>
                            <div className="flex items-center gap-3">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/6">
                                <div
                                  className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                                  style={{
                                    width: `${maxEvidenceLinks ? Math.max(16, (recommendation.evidenceInteractionIds.length / maxEvidenceLinks) * 100) : 16}%`,
                                  }}
                                />
                              </div>
                              <span className="whitespace-nowrap text-xs text-slate-500">
                                {recommendation.evidenceInteractionIds.length} evidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedRecommendation ? (
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
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <SummaryChip label="Scope" value={selectedRecommendation.scopeLabel} />
                  <SummaryChip label="Type" value={selectedRecommendation.type} />
                  <SummaryChip label="Evidence" value={`${selectedRecommendation.evidenceInteractionIds.length} linked`} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <p className="mb-3 dashboard-eyebrow">Action</p>
                      <p className="dashboard-body text-slate-100">{selectedRecommendation.recommendedAction}</p>
                    </div>

                    <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="dashboard-section-title">Evidence Signals</h3>
                        <span className="dashboard-eyebrow">{topSignals.length}</span>
                      </div>
                      <div className="space-y-3">
                        {topSignals.map((signal) => (
                          <div key={signal} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                            <span className="dashboard-body">{signal}</span>
                          </div>
                        ))}
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
                    {primaryEvidence ? (
                      <div className="rounded-2xl border border-white/6 bg-black/20 p-5">
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
                    ) : null}

                    <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
                      <CardHeader className="bg-black/20 border-b border-white/5">
                        <CardTitle className="dashboard-card-title text-slate-100">Decision Runs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-5">
                        {recentRuns.map((run) => (
                          <div key={run.id} className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-slate-100">{run.title}</p>
                                <p className="mt-1 text-sm text-slate-400">{run.scopeLabel}</p>
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
                centerValue={String(sortedRecommendations.length)}
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
              </div>
            </div>
          ) : null}

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Decision Runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {recentRuns.map((run) => (
                <div key={run.id} className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{run.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{run.scopeLabel}</p>
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
