import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KIRO_DATA, formatConsumption, getInteractionById } from "@/lib/kiro-data";
import type { AdvisorRun, Recommendation } from "@/lib/kiro-data";

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

const runLogTemplates = {
  "AI Advisor": [
    "Loaded user activity and interaction telemetry.",
    "Calculated spend concentration by cost center and team.",
    "Scored model-routing mismatches against use case taxonomy.",
    "Compiled prioritized recommendations and evidence links.",
  ],
  "Strategic Report": [
    "Loaded scoped findings and supporting evidence.",
    "Summarized ownership, use-case, and model hotspots.",
    "Drafted executive summary and action sections.",
    "Prepared stakeholder-ready artifact output.",
  ],
  "Policy Simulation": [
    "Loaded current baseline for selected scope.",
    "Applied policy levers against prompt, model, and seat thresholds.",
    "Estimated projected AI consumption and overrun deltas.",
    "Published simulation findings for review.",
  ],
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
  const [selectedRunId, setSelectedRunId] = useState(KIRO_DATA.runs[0]?.id ?? "");
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);

  const selectedRecommendation =
    sortedRecommendations.find((recommendation) => recommendation.id === selectedRecommendationId) ?? sortedRecommendations[0];
  const selectedRun = KIRO_DATA.runs.find((run) => run.id === selectedRunId) ?? KIRO_DATA.runs[0];

  useEffect(() => {
    if (!selectedRecommendationId && sortedRecommendations[0]) {
      setSelectedRecommendationId(sortedRecommendations[0].id);
    }
  }, [selectedRecommendationId, sortedRecommendations]);

  const recommendationSections = useMemo(
    () => [
      {
        title: "Leadership Now",
        description: "Highest-severity items that should shape policy or funding decisions first.",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "High"),
      },
      {
        title: "Program Tune-ups",
        description: "Important optimization moves that improve routing, prompting, and workflow hygiene.",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "Medium"),
      },
      {
        title: "Background Opportunities",
        description: "Lower-friction improvements worth bundling into adjacent initiatives.",
        recommendations: sortedRecommendations.filter((recommendation) => recommendation.severity === "Low"),
      },
    ].filter((section) => section.recommendations.length > 0),
    [sortedRecommendations],
  );

  const categoryMix = useMemo(() => {
    const counts = new Map<string, number>();
    sortedRecommendations.forEach((recommendation) => {
      counts.set(recommendation.type, (counts.get(recommendation.type) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [sortedRecommendations]);

  const totalEvidenceLinks = useMemo(
    () => sortedRecommendations.reduce((sum, recommendation) => sum + recommendation.evidenceInteractionIds.length, 0),
    [sortedRecommendations],
  );

  const architectSummary = useMemo(() => {
    if (!selectedRecommendation) return null;

    const evidenceCount = selectedRecommendation.evidenceInteractionIds.length;
    const emphasis =
      selectedRecommendation.severity === "High"
        ? "Escalate this through leadership review and convert it into a governed standard."
        : selectedRecommendation.severity === "Medium"
          ? "Bundle this into the next operating cadence so teams can adopt it without disruption."
          : "Treat this as a background cleanup item and fold it into the nearest related initiative.";

    const shape =
      selectedRecommendation.type === "Use Case Optimization" || selectedRecommendation.type === "Model Routing"
        ? "Best handled as a repeatable engineering pattern rather than a one-off intervention."
        : selectedRecommendation.type === "License Hygiene" || selectedRecommendation.type === "Spend Concentration"
          ? "Needs ownership clarity first so the corrective action has a durable accountable team."
          : "Translate the insight into a narrow policy guardrail before broadening rollout.";

    return {
      emphasis,
      shape,
      evidenceLine:
        evidenceCount > 1
          ? `${evidenceCount} linked interactions give enough surface area to validate before rollout.`
          : "Validate the linked interaction before standardizing the recommendation.",
    };
  }, [selectedRecommendation]);

  const primaryEvidence = selectedRecommendation ? getInteractionById(selectedRecommendation.evidenceInteractionIds[0]) : null;

  return (
    <div className="p-8 max-w-[1760px] mx-auto space-y-6 animate-in fade-in duration-500">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      <div className="rounded-[28px] border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(7,12,24,0.98))] px-7 py-7 shadow-[0_24px_70px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl space-y-3">
            <div>
              <h1 className="dashboard-page-title mb-2">Recommendations</h1>
              <p className="dashboard-page-lead">
                Decision workspace for governance actions, simulation follow-through, and evidence-backed implementation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>{sortedRecommendations.length} total recommendations</span>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <span>{totalEvidenceLinks} evidence links in scope</span>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <span>{KIRO_DATA.runs.length} active decision artifacts</span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <HeroStat
                label="Top Priority"
                value={`${recommendationSections[0]?.recommendations.length ?? 0} leadership actions`}
                hint="High-severity actions to standardize first"
              />
              <HeroStat
                label="Dominant Pattern"
                value={categoryMix[0]?.label ?? "No pattern detected"}
                hint="Most common recommendation class in the queue"
              />
              <HeroStat
                label="Current Focus"
                value={selectedRecommendation?.scopeLabel ?? "No selection"}
                hint={selectedRecommendation?.type ?? "Select a recommendation to inspect"}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <SignalCard
          label="High Severity"
          value={String(sortedRecommendations.filter((recommendation) => recommendation.severity === "High").length)}
          hint="Needs leadership attention"
          icon={AlertTriangle}
          tone="text-red-300"
        />
        <SignalCard
          label="Operational Queue"
          value={String(sortedRecommendations.length)}
          hint="Ranked actions ready for review"
          icon={ShieldCheck}
          tone="text-blue-300"
        />
        <SignalCard
          label="Run Coverage"
          value={String(KIRO_DATA.runs.length)}
          hint="Advisors, simulations, and reports"
          icon={Zap}
          tone="text-indigo-300"
        />
        <SignalCard
          label="Evidence Reach"
          value={String(KIRO_DATA.interactions.filter((item) => item.evidence.chatCount > 0).length)}
          hint="Inspectable interactions across the estate"
          icon={Eye}
          tone="text-teal-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.88fr_1.12fr_0.86fr]">
        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <CardTitle className="dashboard-card-title text-slate-100">Recommendation Queue</CardTitle>
            <CardDescription className="text-slate-400">
              Scan the stack quickly, then keep the center panel focused on one decision at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {recommendationSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="dashboard-section-title">{section.title}</p>
                    <p className="dashboard-page-support mt-1">{section.description}</p>
                  </div>
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
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={severityStyles[recommendation.severity]}>{recommendation.severity}</Badge>
                            <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendation.type}</Badge>
                          </div>
                          <p className="dashboard-item-title">{recommendation.title}</p>
                          <p className="dashboard-muted-body">{recommendation.scopeLabel}</p>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          <p>{recommendation.evidenceInteractionIds.length} evidence</p>
                          <p className="mt-1">{recommendation.scopeType}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedRecommendation ? (
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
                    <CardDescription className="mt-2 text-slate-400">{selectedRecommendation.scopeLabel}</CardDescription>
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
                <FocusStat
                  label="Why This Matters"
                  value={selectedRecommendation.whyItMatters}
                />
                <FocusStat
                  label="Expected Impact"
                  value={selectedRecommendation.expectedImpact}
                />
                <FocusStat
                  label="Evidence Depth"
                  value={`${selectedRecommendation.evidenceInteractionIds.length} linked interactions`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="dashboard-section-title">Supporting Signals</h3>
                    <span className="dashboard-eyebrow">{selectedRecommendation.supportingSignals.length} observed cues</span>
                  </div>
                  <div className="space-y-3">
                    {selectedRecommendation.supportingSignals.map((signal) => (
                      <div key={signal} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                        <span className="dashboard-body">{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-5">
                    <h3 className="dashboard-section-title mb-3">Architect Recommendation</h3>
                    <p className="dashboard-body">{selectedRecommendation.recommendedAction}</p>
                  </div>

                  {architectSummary ? (
                    <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
                      <div className="flex items-center gap-2 mb-3 text-blue-300">
                        <Sparkles className="h-4 w-4" />
                        <span className="dashboard-eyebrow text-blue-300">Architect Read</span>
                      </div>
                      <div className="space-y-3 text-sm leading-relaxed text-slate-200">
                        <p>{architectSummary.emphasis}</p>
                        <p>{architectSummary.shape}</p>
                        <p>{architectSummary.evidenceLine}</p>
                      </div>
                    </div>
                  ) : null}

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
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Program Mix</CardTitle>
              <CardDescription className="text-slate-400">
                See where the recommendation queue is clustering before changing policy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {categoryMix.map((item) => {
                const width = `${(item.count / Math.max(sortedRecommendations.length, 1)) * 100}%`;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-200">{item.label}</p>
                      <span className="text-xs text-slate-500">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-100">Advisor & Report Runs</CardTitle>
              <CardDescription className="text-slate-400">
                Compact run control modeled after the denser explorer side panels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {KIRO_DATA.runs.map((run) => (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    run.id === selectedRun?.id
                      ? "border-blue-500/35 bg-blue-500/10"
                      : "border-white/6 bg-[#0b1120] hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{run.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{run.summary}</p>
                    </div>
                    <Badge className={statusStyles[run.status]}>{run.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge className="bg-white/5 text-slate-300 border-white/10">{run.mode}</Badge>
                    <span className="text-xs text-slate-500">{run.scopeLabel}</span>
                  </div>
                </button>
              ))}

              {selectedRun ? <RunDetail run={selectedRun} /> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

function FocusStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0b1120] px-4 py-4">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{value}</p>
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

function RunDetail({ run }: { run: AdvisorRun }) {
  return (
    <div className="rounded-2xl border border-white/6 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="dashboard-section-title">Run Trace</p>
          <p className="dashboard-page-support mt-1">{run.scopeLabel}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{run.startedAt}</span>
        </div>
      </div>
      <div className="space-y-3 font-mono text-sm">
        {runLogTemplates[run.mode].map((message, index) => (
          <div key={message} className="flex items-start gap-3 text-slate-300">
            <span className="text-slate-500">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-blue-300">INFO</span>
            <span>{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof AlertTriangle;
  tone: string;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="dashboard-eyebrow">{label}</p>
            <p className="dashboard-stat-value mt-2">{value}</p>
            <p className="text-sm text-slate-500 mt-2">{hint}</p>
          </div>
          <div className={`rounded-2xl border border-white/5 bg-black/20 p-3 ${tone}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
