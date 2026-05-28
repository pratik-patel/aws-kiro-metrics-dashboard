import { useMemo, useState } from "react";
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
  Zap,
} from "lucide-react";
import { Link } from "wouter";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KIRO_DATA, formatConsumption, getInteractionById } from "@/lib/kiro-data";
import type { Recommendation } from "@/lib/kiro-data";

const severityStyles = {
  High: "bg-red-500/10 text-red-300 border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Low: "bg-blue-500/10 text-blue-300 border-blue-500/20",
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
  const [selectedRunId, setSelectedRunId] = useState(KIRO_DATA.runs[0]?.id ?? "");
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);

  const selectedRun = KIRO_DATA.runs.find((run) => run.id === selectedRunId) ?? KIRO_DATA.runs[0];
  const highSeverity = useMemo(
    () => KIRO_DATA.recommendations.filter((recommendation) => recommendation.severity === "High"),
    [],
  );
  const mediumSeverity = useMemo(
    () => KIRO_DATA.recommendations.filter((recommendation) => recommendation.severity === "Medium"),
    [],
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Recommendations</h1>
          <p className="text-slate-400 text-lg">
            Prioritized governance findings, advisor runs, and report-ready actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/studio">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.18)]">
              <PlayCircle className="w-4 h-4 mr-2" />
              Run New Scenario
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
              Generate Strategic Report
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SignalCard
          label="High Severity Recommendations"
          value={String(highSeverity.length)}
          hint="Needs leadership attention"
          icon={AlertTriangle}
          tone="text-red-300"
        />
        <SignalCard
          label="Enterprise Opportunities"
          value={String(KIRO_DATA.recommendations.length)}
          hint="Ranked by impact and evidence"
          icon={ShieldCheck}
          tone="text-blue-300"
        />
        <SignalCard
          label="Advisor / Report Runs"
          value={String(KIRO_DATA.runs.length)}
          hint="Completed, queued, and simulated"
          icon={Zap}
          tone="text-indigo-300"
        />
        <SignalCard
          label="Evidence-backed Interactions"
          value={String(KIRO_DATA.interactions.filter((item) => item.evidence.chatCount > 0).length)}
          hint="Available for prompt inspection"
          icon={Eye}
          tone="text-teal-300"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-6">
        <div className="space-y-6">
          <RecommendationSection
            title="Priority Actions"
            description="Highest-impact recommendations synthesized from observed Kiro telemetry and scoped heuristics."
            recommendations={highSeverity}
            onOpenEvidence={setEvidenceInteractionId}
          />
          <RecommendationSection
            title="Next Best Opportunities"
            description="Medium-severity changes that can reduce cost, tighten prompt discipline, or improve seat hygiene."
            recommendations={mediumSeverity}
            onOpenEvidence={setEvidenceInteractionId}
          />
        </div>

        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Advisor & Report Runs</CardTitle>
              <CardDescription className="text-slate-400">
                Unified history for findings synthesis, simulations, and report generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {KIRO_DATA.runs.map((run) => {
                  const isActive = run.id === selectedRunId;
                  const statusTone =
                    run.status === "Completed"
                      ? "text-teal-300 bg-teal-500/10 border-teal-500/20"
                      : run.status === "Running"
                        ? "text-blue-300 bg-blue-500/10 border-blue-500/20"
                        : "text-amber-300 bg-amber-500/10 border-amber-500/20";
                  return (
                    <button
                      key={run.id}
                      type="button"
                      onClick={() => setSelectedRunId(run.id)}
                      className={`w-full text-left p-4 transition-colors ${isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-100">{run.title}</p>
                          <p className="text-sm text-slate-400 mt-1">{run.summary}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge className="bg-white/5 text-slate-300 border-white/10">{run.mode}</Badge>
                            <Badge className={statusTone}>{run.status}</Badge>
                            <span className="text-xs text-slate-500">{run.scopeLabel}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">{run.startedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedRun && (
            <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
              <CardHeader className="bg-black/20 border-b border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-medium text-slate-200">{selectedRun.title}</CardTitle>
                    <CardDescription className="text-slate-400">{selectedRun.scopeLabel}</CardDescription>
                  </div>
                  <Badge
                    className={
                      selectedRun.status === "Completed"
                        ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                        : selectedRun.status === "Running"
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    }
                  >
                    {selectedRun.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RunMetric label="Started" value={selectedRun.startedAt} />
                  <RunMetric label="Mode" value={selectedRun.mode} />
                  <RunMetric label="Scope" value={selectedRun.scopeLabel} />
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0b1120] p-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400">Run Trace</h3>
                    <span className="text-xs text-slate-500 font-mono">{selectedRun.id}</span>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    {runLogTemplates[selectedRun.mode].map((message, index) => (
                      <div key={message} className="flex items-start gap-3 text-slate-300">
                        <span className="text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-blue-300">INFO</span>
                        <span>{message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Suggested Follow-through</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• Review the highest-cost interactions linked to this run before finalizing a governance policy.</p>
                    <p>• Confirm whether the recommended model tier change applies only to selected use cases or should be broader.</p>
                    <p>• Generate a strategic report after validating the top evidence artifacts below.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationSection({
  title,
  description,
  recommendations,
  onOpenEvidence,
}: {
  title: string;
  description: string;
  recommendations: Recommendation[];
  onOpenEvidence: (interactionId: string | null) => void;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
      <CardHeader className="bg-black/20 border-b border-white/5">
        <CardTitle className="text-lg font-medium text-slate-200">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {recommendations.map((recommendation) => {
          const firstEvidence = recommendation.evidenceInteractionIds[0];
          const interaction = getInteractionById(firstEvidence);
          return (
            <div key={recommendation.id} className="rounded-2xl border border-white/5 bg-[#0d1524] p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className={severityStyles[recommendation.severity]}>{recommendation.severity}</Badge>
                    <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendation.type}</Badge>
                    <span className="text-xs text-slate-500">{recommendation.scopeLabel}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{recommendation.title}</h3>
                  <p className="text-slate-400 mt-2 leading-relaxed">{recommendation.whyItMatters}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {interaction && (
                    <Button
                      variant="outline"
                      className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
                      onClick={() => onOpenEvidence(interaction.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Evidence
                    </Button>
                  )}
                  <Link href="/studio">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                      <Zap className="w-4 h-4 mr-2" />
                      Simulate Policy
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4 mt-5">
                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <h4 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Supporting Signals</h4>
                  <div className="space-y-2">
                    {recommendation.supportingSignals.map((signal: string) => (
                      <div key={signal} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" />
                        <span>{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <h4 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Recommended Action</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{recommendation.recommendedAction}</p>
                  <div className="mt-4 rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-blue-300">Expected Impact</span>
                    <p className="text-sm text-slate-200 mt-1">{recommendation.expectedImpact}</p>
                  </div>
                  {interaction && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>
                        Linked interaction: {interaction.id.slice(0, 14)}… · {formatConsumption(interaction.estimatedCredits)} credits
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
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
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="text-3xl font-semibold text-white mt-2">{value}</p>
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

function RunMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <p className="text-sm text-slate-200 mt-2">{value}</p>
    </div>
  );
}
