import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  History,
  PlayCircle,
  Settings2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  KIRO_DATA,
  formatConsumption,
  getInteractionsForScope,
  getRecommendationsForScope,
  getUseCaseSummariesForScope,
  type EngineerSummary,
  type InteractionSummary,
  type Recommendation,
} from "@/lib/kiro-data";

type ScopeKind = "Enterprise" | "Cost Center" | "Team" | "Engineer";
type AdvisorMode =
  | "Executive Summary"
  | "Cost Concentration Review"
  | "License Hygiene Review"
  | "Optimization Recommendations"
  | "Model Routing Review"
  | "Use Case Risk Review";

interface SimulationLevers {
  modelTierCeiling: 1 | 2 | 3;
  promptTokenCeiling: number;
  maxActiveMcpServers: number;
  contextCompactionTrigger: number;
  maxAgenticSteps: number;
  toolOutputTruncation: number;
}

const advisorModes: AdvisorMode[] = [
  "Executive Summary",
  "Cost Concentration Review",
  "License Hygiene Review",
  "Optimization Recommendations",
  "Model Routing Review",
  "Use Case Risk Review",
];

const defaultLevers: Record<AdvisorMode, SimulationLevers> = {
  "Executive Summary": {
    modelTierCeiling: 2,
    promptTokenCeiling: 4000,
    maxActiveMcpServers: 4,
    contextCompactionTrigger: 70,
    maxAgenticSteps: 10,
    toolOutputTruncation: 2000,
  },
  "Cost Concentration Review": {
    modelTierCeiling: 2,
    promptTokenCeiling: 4200,
    maxActiveMcpServers: 4,
    contextCompactionTrigger: 72,
    maxAgenticSteps: 11,
    toolOutputTruncation: 2200,
  },
  "License Hygiene Review": {
    modelTierCeiling: 3,
    promptTokenCeiling: 5200,
    maxActiveMcpServers: 6,
    contextCompactionTrigger: 82,
    maxAgenticSteps: 15,
    toolOutputTruncation: 2800,
  },
  "Optimization Recommendations": {
    modelTierCeiling: 2,
    promptTokenCeiling: 4000,
    maxActiveMcpServers: 4,
    contextCompactionTrigger: 70,
    maxAgenticSteps: 10,
    toolOutputTruncation: 2000,
  },
  "Model Routing Review": {
    modelTierCeiling: 2,
    promptTokenCeiling: 4600,
    maxActiveMcpServers: 5,
    contextCompactionTrigger: 74,
    maxAgenticSteps: 12,
    toolOutputTruncation: 2400,
  },
  "Use Case Risk Review": {
    modelTierCeiling: 2,
    promptTokenCeiling: 3600,
    maxActiveMcpServers: 3,
    contextCompactionTrigger: 68,
    maxAgenticSteps: 9,
    toolOutputTruncation: 1800,
  },
};

const MODEL_TIER_LABELS: Record<SimulationLevers["modelTierCeiling"], string> = {
  1: "Qwen3 Coder Next",
  2: "Sonnet",
  3: "Opus",
};

export default function PolicySimulationStudio() {
  const [scopeKind, setScopeKind] = useState<ScopeKind>("Cost Center");
  const [scopeId, setScopeId] = useState(KIRO_DATA.costCenters[0]?.id ?? "enterprise");
  const [advisorMode, setAdvisorMode] = useState<AdvisorMode>("Optimization Recommendations");
  const [simulationRunCount, setSimulationRunCount] = useState(0);
  const [levers, setLevers] = useState<SimulationLevers>(defaultLevers["Optimization Recommendations"]);

  const scopeOptions = useMemo(() => getScopeOptions(scopeKind), [scopeKind]);

  useEffect(() => {
    setLevers(defaultLevers[advisorMode]);
  }, [advisorMode]);

  useEffect(() => {
    if (!scopeOptions.find((option) => option.id === scopeId)) {
      setScopeId(scopeOptions[0]?.id ?? "enterprise");
    }
  }, [scopeId, scopeOptions]);

  const resolvedScope = useMemo(
    () => resolveScope(scopeKind, scopeId),
    [scopeId, scopeKind],
  );

  const simulation = useMemo(
    () => buildSimulation(resolvedScope, advisorMode, levers),
    [advisorMode, levers, resolvedScope],
  );
  const topRecommendation = resolvedScope.recommendations[0];
  const flaggedReduction = Math.max(0, simulation.flaggedBefore - simulation.flaggedAfter);
  const projectedConsumption = Math.max(0, resolvedScope.totalConsumption - simulation.totalDelta);
  const projectedOverrun = Math.max(0, resolvedScope.overrun - simulation.overrunDelta);

  const runSimulation = () => setSimulationRunCount((count) => count + 1);

  return (
    <div className="p-6 md:p-8 max-w-[1640px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-blue-200">
            <Beaker className="w-3.5 h-3.5" />
            Simulation studio
          </div>
          <h1 className="dashboard-page-title mb-1">Policy & Simulation Studio</h1>
          <p className="dashboard-page-lead max-w-4xl">
            Adjust policy levers, compare projected impact, and decide before changing live behavior.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/recommendations">
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
              <History className="w-4 h-4 mr-2" />
              Review Recommendations
            </Button>
          </Link>
          <Button
            onClick={runSimulation}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-[0_0_24px_rgba(99,102,241,0.24)]"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-white/5 bg-[linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.95)_45%,rgba(15,23,42,0.72))] shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
        <CardContent className="p-6 md:p-7">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StudioChip label="Scope" value={resolvedScope.label} />
            <StudioChip label="Lens" value={advisorMode} />
            <StudioChip label="Interactions" value={String(resolvedScope.interactions.length)} />
            <StudioChip label="Runs" value={String(simulationRunCount)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[0.92fr_1.28fr] gap-6 items-start">
        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden xl:sticky xl:top-24">
          <CardHeader className="bg-black/20 border-b border-white/5 pb-5">
            <CardTitle className="dashboard-card-title text-slate-200 flex items-center">
              <Settings2 className="w-4 h-4 mr-2 text-slate-400" />
              Scenario Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current simulation</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="border-blue-400/20 bg-blue-500/10 text-blue-100 hover:bg-blue-500/10">
                  {resolvedScope.label}
                </Badge>
                <Badge className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/5">
                  {advisorMode}
                </Badge>
                <Badge className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/5">
                  {resolvedScope.affectedScopesLabel}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">1. Scope</p>
              <label className="text-xs uppercase tracking-[0.18em] text-slate-400">Scope Type</label>
              <select
                value={scopeKind}
                onChange={(event) => setScopeKind(event.target.value as ScopeKind)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Cost Center">Cost Center</option>
                <option value="Team">Team</option>
                <option value="Engineer">Engineer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] text-slate-400">Scope</label>
              <select
                value={scopeId}
                onChange={(event) => setScopeId(event.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {scopeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">2. Lens</p>
              <label className="text-xs uppercase tracking-[0.18em] text-slate-400">Advisor Mode</label>
              <select
                value={advisorMode}
                onChange={(event) => setAdvisorMode(event.target.value as AdvisorMode)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {advisorModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-5 border-t border-white/5 pt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">3. Policy levers</p>
              <SliderField
                section="Per-request cost"
                label="Model tier ceiling"
                value={4 - levers.modelTierCeiling}
                min={1}
                max={3}
                minLabel="Opus"
                maxLabel="Qwen3 Coder Next"
                displayValue={MODEL_TIER_LABELS[levers.modelTierCeiling]}
                description="Routes task types to the highest model tier allowed for a single request."
                badge="Highest leverage"
                onChange={(value) =>
                  setLevers((current) => ({
                    ...current,
                    modelTierCeiling: Math.max(1, Math.min(3, 4 - value)) as 1 | 2 | 3,
                  }))
                }
              />
              <SliderField
                label="Prompt token ceiling"
                value={levers.promptTokenCeiling}
                min={1000}
                max={32000}
                step={500}
                minLabel="1K"
                maxLabel="32K"
                displayValue={`${levers.promptTokenCeiling.toLocaleString()} tokens`}
                description="Hard cap on input size per request. This is measured in tokens, not characters."
                badge={`${simulation.promptHeavyCount} offenders`}
                onChange={(value) => setLevers((current) => ({ ...current, promptTokenCeiling: value }))}
              />
              <SliderField
                label="Max active MCP servers"
                value={levers.maxActiveMcpServers}
                min={1}
                max={12}
                minLabel="1"
                maxLabel="12"
                displayValue={`${levers.maxActiveMcpServers} servers`}
                description="Limits how many MCP servers can stay active before request context starts inflating."
                badge={`${simulation.mcpHeavyCount} requests`}
                onChange={(value) => setLevers((current) => ({ ...current, maxActiveMcpServers: value }))}
              />
              <SliderField
                section="Session-level cost"
                label="Context compaction trigger"
                value={levers.contextCompactionTrigger}
                min={50}
                max={95}
                minLabel="50%"
                maxLabel="95%"
                displayValue={`${levers.contextCompactionTrigger}%`}
                description="Determines when long sessions should compact before they become expensive to reload."
                badge="Session control"
                onChange={(value) => setLevers((current) => ({ ...current, contextCompactionTrigger: value }))}
              />
              <SliderField
                label="Max agentic steps"
                value={levers.maxAgenticSteps}
                min={3}
                max={30}
                minLabel="3"
                maxLabel="30"
                displayValue={`${levers.maxAgenticSteps} steps`}
                description="Caps how many autonomous steps an agentic workflow can take before it should stop or hand off."
                badge={`${simulation.agenticCount} agentic`}
                onChange={(value) => setLevers((current) => ({ ...current, maxAgenticSteps: value }))}
              />
              <SliderField
                label="Tool output truncation"
                value={levers.toolOutputTruncation}
                min={500}
                max={10000}
                step={250}
                minLabel="500"
                maxLabel="10K"
                displayValue={`${levers.toolOutputTruncation.toLocaleString()} tokens`}
                description="Caps how much tool output can return into context before it starts inflating downstream requests."
                badge={`${simulation.toolOutputHeavyCount} oversized`}
                onChange={(value) => setLevers((current) => ({ ...current, toolOutputTruncation: value }))}
              />

              <Button
                onClick={runSimulation}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-[0_0_24px_rgba(99,102,241,0.24)]"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-950/35 to-transparent border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-300" />
                Projected Outcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <ImpactCard label="Projected Consumption Delta" value={`-${formatConsumption(simulation.totalDelta)}`} hint="Estimated credits avoided" tone="blue" />
                <ImpactCard label="Projected Overrun Delta" value={`-${formatConsumption(simulation.overrunDelta)}`} hint="Potential overrun avoided" tone="amber" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImpactCard label="Flags Reduced" value={String(flaggedReduction)} hint={`${simulation.flaggedAfter} remaining`} tone="violet" />
                <ImpactCard label="Affected Scopes" value={`${simulation.affectedScopes}`} hint={resolvedScope.affectedScopesLabel} tone="teal" />
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-300 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-100">Next move</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {topRecommendation?.title ??
                        "Use the simulation outcome to choose the next recommendation bundle."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/6 bg-[#0b1120] p-4">
                <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-4">Before / After</h3>
                <div className="space-y-4">
                  <OutcomeBullet
                    label="Consumption"
                    before={resolvedScope.totalConsumption}
                    after={projectedConsumption}
                    formatter={(value) => `${formatConsumption(value)} credits`}
                    tone="blue"
                  />
                  <OutcomeBullet
                    label="Overrun"
                    before={resolvedScope.overrun}
                    after={projectedOverrun}
                    formatter={(value) => `${formatConsumption(value)} credits`}
                    tone="amber"
                  />
                  <OutcomeBullet
                    label="Flagged risks"
                    before={simulation.flaggedBefore}
                    after={simulation.flaggedAfter}
                    formatter={(value) => `${value}`}
                    tone="violet"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200">Current Baseline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard label="AI Consumption" value={`${formatConsumption(resolvedScope.totalConsumption)} credits`} />
                <MetricCard label="Overrun" value={`${formatConsumption(resolvedScope.overrun)} credits`} />
                <MetricCard label="High-cost Alerts" value={String(simulation.flaggedBefore)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MiniMetric label="Prompt-heavy" value={String(simulation.promptHeavyCount)} tone="text-amber-300" />
                <MiniMetric label="Model Mismatch" value={String(simulation.modelMismatchCount)} tone="text-blue-300" />
                <MiniMetric label="Plugin-heavy" value={String(simulation.pluginHeavyCount)} tone="text-violet-300" />
                <MiniMetric label="Low-utilization Seats" value={String(simulation.lowUtilizationSeats)} tone="text-teal-300" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
                  <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-4">Intervention Breakdown</h3>
                  <div className="space-y-4">
                    {simulation.interventionChart.map((item, index) => (
                      <InterventionRail
                        key={item.name}
                        label={item.name}
                        value={item.delta}
                        max={simulation.interventionChart[0]?.delta ?? item.delta}
                        tone={index % 2 === 0 ? "blue" : "violet"}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
                  <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-4">Use-case Pressure</h3>
                  <div className="space-y-3">
                    {resolvedScope.useCases.slice(0, 4).map((useCase) => (
                      <div key={useCase.key} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-100">{useCase.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{useCase.dominantModel}</p>
                          </div>
                          <Badge className="bg-white/5 text-slate-300 border-white/10">
                            {formatConsumption(useCase.totalConsumption)} credits
                          </Badge>
                        </div>
                        <div className="mt-3 h-2.5 rounded-full bg-white/6 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,#3b82f6,#14b8a6)]"
                            style={{
                              width: `${resolvedScope.useCases[0]?.totalConsumption ? Math.max(18, (useCase.totalConsumption / resolvedScope.useCases[0].totalConsumption) * 100) : 18}%`,
                            }}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className="rounded-full border border-white/8 bg-black/20 px-2.5 py-1">
                            {useCase.interactionCount} interactions
                          </span>
                          <span className="rounded-full border border-white/8 bg-black/20 px-2.5 py-1">
                            {useCase.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200">Advisor Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-3">
                {simulation.summary.slice(0, 2).map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/20 px-4 py-4 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="w-5 h-5 text-red-300 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-200">Caveat</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Uses observed Kiro telemetry; steering, retrieved context, and instruction overhead remain estimated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/reports">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                    Generate Strategic Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
                    Review Recommendations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getScopeOptions(scopeKind: ScopeKind) {
  if (scopeKind === "Enterprise") {
    return [{ id: "enterprise", label: "Enterprise" }];
  }
  if (scopeKind === "Cost Center") {
    return KIRO_DATA.costCenters.map((costCenter) => ({ id: costCenter.id, label: costCenter.name }));
  }
  if (scopeKind === "Team") {
    return KIRO_DATA.teams.map((team) => ({ id: team.id, label: `${team.name} · ${team.costCenterName}` }));
  }
  return KIRO_DATA.engineers.map((engineer) => ({ id: engineer.userId, label: `${engineer.name} · ${engineer.teamName}` }));
}

function resolveScope(scopeKind: ScopeKind, scopeId: string) {
  if (scopeKind === "Enterprise") {
    return {
      label: "Enterprise",
      interactions: KIRO_DATA.interactions,
      engineers: KIRO_DATA.engineers,
      recommendations: KIRO_DATA.recommendations,
      useCases: KIRO_DATA.useCases,
      totalConsumption: KIRO_DATA.kpis.totalConsumption,
      overrun: KIRO_DATA.kpis.overrun,
      affectedScopesLabel: "cost centers",
    };
  }

  if (scopeKind === "Cost Center") {
    const costCenter = KIRO_DATA.costCenters.find((item) => item.id === scopeId) ?? KIRO_DATA.costCenters[0];
    const interactions = getInteractionsForScope({ costCenterId: costCenter?.id });
    const engineers = KIRO_DATA.engineers.filter((engineer) => engineer.costCenterId === costCenter?.id);
    return {
      label: costCenter?.name ?? "Cost Center",
      interactions,
      engineers,
      recommendations: getRecommendationsForScope("Cost Center", costCenter?.id ?? ""),
      useCases: getUseCaseSummariesForScope({ costCenterId: costCenter?.id }),
      totalConsumption: costCenter?.totalConsumption ?? 0,
      overrun: costCenter?.overrun ?? 0,
      affectedScopesLabel: "teams",
    };
  }

  if (scopeKind === "Team") {
    const team = KIRO_DATA.teams.find((item) => item.id === scopeId) ?? KIRO_DATA.teams[0];
    const interactions = getInteractionsForScope({ teamId: team?.id });
    const engineers = KIRO_DATA.engineers.filter((engineer) => engineer.teamId === team?.id);
    return {
      label: team ? `${team.name} · ${team.costCenterName}` : "Team",
      interactions,
      engineers,
      recommendations: getRecommendationsForScope("Team", team?.id ?? ""),
      useCases: getUseCaseSummariesForScope({ teamId: team?.id }),
      totalConsumption: team?.totalConsumption ?? 0,
      overrun: team?.overrun ?? 0,
      affectedScopesLabel: "engineers",
    };
  }

  const engineer = KIRO_DATA.engineers.find((item) => item.userId === scopeId) ?? KIRO_DATA.engineers[0];
  const interactions = getInteractionsForScope({ engineerId: engineer?.userId });
  const recommendations = [
    ...getRecommendationsForScope("Engineer", engineer?.userId ?? ""),
    ...getRecommendationsForScope("Team", engineer?.teamId ?? ""),
  ].filter((recommendation, index, all) => all.findIndex((item) => item.id === recommendation.id) === index);

  return {
    label: engineer ? `${engineer.name} · ${engineer.teamName}` : "Engineer",
    interactions,
    engineers: engineer ? [engineer] : [],
    recommendations,
    useCases: getUseCaseSummariesForScope({ engineerId: engineer?.userId }),
    totalConsumption: engineer?.totalConsumption ?? 0,
    overrun: engineer?.overrun ?? 0,
    affectedScopesLabel: "workflows",
  };
}

function buildSimulation(
  scope: ReturnType<typeof resolveScope>,
  advisorMode: AdvisorMode,
  levers: SimulationLevers,
) {
  const promptHeavyInteractions = scope.interactions.filter(
    (interaction) => interaction.promptChars / 4 >= levers.promptTokenCeiling,
  );
  const modelMismatchInteractions = scope.interactions.filter((interaction) => {
    const modelName = interaction.modelName.toLowerCase();
    if (levers.modelTierCeiling === 3) return false;
    if (levers.modelTierCeiling === 2) return modelName.includes("opus");
    return modelName.includes("opus") || modelName.includes("sonnet");
  });
  const mcpHeavyInteractions = scope.interactions.filter((interaction) => interaction.mcpServer !== "No MCP Invoked");
  const longContextInteractions = scope.interactions.filter((interaction) =>
    interaction.inputDrivers.some(
      (driver) =>
        driver.label === "Instruction / Steering Overhead" || driver.label === "Specification / Workflow Context",
    ),
  );
  const agenticInteractions = scope.interactions.filter(
    (interaction) => interaction.agentPattern === "orchestrated-multi-agent" || interaction.toolInvocationCount >= levers.maxAgenticSteps,
  );
  const toolOutputHeavyInteractions = scope.interactions.filter(
    (interaction) => interaction.responseChars / 4 >= levers.toolOutputTruncation,
  );
  const lowUtilizationSeats = scope.engineers.filter(
    (engineer) => engineer.subscriptionStatus.toLowerCase() === "active" && engineer.activeDays <= 3,
  );

  const modelSavings =
    modelMismatchInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    (levers.modelTierCeiling === 2 ? 0.24 : 0.38);
  const promptSavings =
    promptHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (32000 - levers.promptTokenCeiling) / 28000) *
    0.18;
  const mcpSavings =
    mcpHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (12 - levers.maxActiveMcpServers) / 11) *
    0.08;
  const compactionSavings =
    longContextInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (95 - levers.contextCompactionTrigger) / 45) *
    0.1;
  const agenticSavings =
    agenticInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (30 - levers.maxAgenticSteps) / 27) *
    0.12;
  const toolOutputSavings =
    toolOutputHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (10000 - levers.toolOutputTruncation) / 9500) *
    0.08;

  const totalDelta = Math.min(
    scope.totalConsumption * 0.38,
    Math.round(modelSavings + promptSavings + mcpSavings + compactionSavings + agenticSavings + toolOutputSavings),
  );
  const overrunDelta = Math.min(scope.overrun, Math.round(totalDelta * 0.18 + scope.overrun * 0.12));
  const flaggedBefore = scope.interactions.filter(
    (interaction) => interaction.estimatedCredits >= 160,
  ).length;
  const flaggedAfter = Math.max(
    0,
    flaggedBefore -
      Math.round(
        modelMismatchInteractions.length * (levers.modelTierCeiling === 1 ? 0.7 : 0.45) +
          promptHeavyInteractions.length * Math.max(0, (8000 - levers.promptTokenCeiling) / 7000) * 0.55 +
          agenticInteractions.length * Math.max(0, (14 - levers.maxAgenticSteps) / 11) * 0.3,
      ),
  );

  const interventionChart = [
    { name: "Model routing", delta: Math.round(modelSavings) },
    { name: "Prompt token cap", delta: Math.round(promptSavings) },
    { name: "MCP ceiling", delta: Math.round(mcpSavings) },
    { name: "Context compaction", delta: Math.round(compactionSavings) },
    { name: "Agentic step guard", delta: Math.round(agenticSavings) },
    { name: "Tool output truncation", delta: Math.round(toolOutputSavings) },
  ].filter((item) => item.delta > 0);

  const topUseCase = scope.useCases[0];
  const topRecommendation = scope.recommendations[0];
  const summary = buildAdvisorSummary({
    advisorMode,
    scope,
    lowUtilizationSeats,
    modelMismatchInteractions,
    promptHeavyInteractions,
    topUseCase,
    topRecommendation,
    totalDelta,
    overrunDelta,
  });

  return {
    promptHeavyCount: promptHeavyInteractions.length,
    modelMismatchCount: modelMismatchInteractions.length,
    mcpHeavyCount: mcpHeavyInteractions.length,
    agenticCount: agenticInteractions.length,
    toolOutputHeavyCount: toolOutputHeavyInteractions.length,
    pluginHeavyCount: toolOutputHeavyInteractions.length,
    lowUtilizationSeats: lowUtilizationSeats.length,
    totalDelta,
    overrunDelta,
    flaggedBefore,
    flaggedAfter,
    interventionChart,
    summary,
    affectedScopes:
      scope.affectedScopesLabel === "cost centers"
        ? KIRO_DATA.costCenters.length
        : scope.affectedScopesLabel === "teams"
          ? Math.max(1, Math.min(6, Math.round(promptHeavyInteractions.length / 3)))
          : scope.affectedScopesLabel === "engineers"
            ? Math.max(1, Math.min(scope.engineers.length, Math.round(modelMismatchInteractions.length / 2) || scope.engineers.length))
            : Math.max(1, Math.round((promptHeavyInteractions.length + modelMismatchInteractions.length) / 3)),
  };
}

function buildAdvisorSummary({
  advisorMode,
  scope,
  lowUtilizationSeats,
  modelMismatchInteractions,
  promptHeavyInteractions,
  topUseCase,
  topRecommendation,
  totalDelta,
  overrunDelta,
}: {
  advisorMode: AdvisorMode;
  scope: ReturnType<typeof resolveScope>;
  lowUtilizationSeats: EngineerSummary[];
  modelMismatchInteractions: InteractionSummary[];
  promptHeavyInteractions: InteractionSummary[];
  topUseCase: ReturnType<typeof resolveScope>["useCases"][number] | undefined;
  topRecommendation: Recommendation | undefined;
  totalDelta: number;
  overrunDelta: number;
}) {
  const shared = [
    `This scenario suggests up to ${formatConsumption(totalDelta)} credits of potential reduction for ${scope.label}.`,
    `Projected overrun reduction is ${formatConsumption(overrunDelta)} credits if the proposed levers are adopted consistently.`,
  ];

  if (advisorMode === "License Hygiene Review") {
    return [
      `${lowUtilizationSeats.length} active seats are below the selected activity threshold and should be reviewed before the next billing cycle.`,
      `Low-utilization pressure is strongest where usage is intermittent but premium access remains active.`,
      ...(topRecommendation ? [`Related action already identified: ${topRecommendation.title}.`] : []),
    ];
  }

  if (advisorMode === "Model Routing Review") {
    return [
      `${modelMismatchInteractions.length} interactions currently exceed the selected model tier ceiling.`,
      `The strongest candidate for stricter model routing is ${topUseCase?.label ?? "the dominant use case"} based on current request cost and workflow fit.`,
      ...shared,
    ];
  }

  if (advisorMode === "Use Case Risk Review") {
    return [
      `${topUseCase?.label ?? "The dominant use case"} is carrying the most cost in this scope and should be treated as the first optimization target.`,
      `${promptHeavyInteractions.length} interactions cross the current prompt threshold, indicating repeated context or oversized workflow instructions.`,
      ...shared,
    ];
  }

  if (advisorMode === "Cost Concentration Review") {
    return [
      `Spend remains concentrated in a narrow slice of the scope, so routing and coaching should be targeted rather than broad.`,
      topRecommendation
        ? `${topRecommendation.title} is the most evidence-backed action for this concentration pattern.`
        : "The leading concentration signal comes from repeated high-cost interactions rather than seat sprawl.",
      ...shared,
    ];
  }

  if (advisorMode === "Executive Summary") {
    return [
      `${scope.label} shows a mix of prompt bloat, model-tier creep, and session-level context expansion.`,
      topRecommendation
        ? `Top action: ${topRecommendation.title}.`
        : "No single recommendation dominates; the opportunity is distributed across multiple usage patterns.",
      ...shared,
    ];
  }

  return [
    `${promptHeavyInteractions.length} interactions exceed the selected token ceiling and are likely carrying repeated context.`,
    `${modelMismatchInteractions.length} interactions could shift below the current model tier ceiling with limited quality risk.`,
    ...shared,
  ];
}

function SliderField({
  section,
  label,
  value,
  min,
  max,
  onChange,
  displayValue,
  description,
  badge,
  minLabel,
  maxLabel,
  step = 1,
}: {
  section?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  displayValue: string;
  description: string;
  badge?: string;
  minLabel: string;
  maxLabel: string;
  step?: number;
}) {
  return (
    <div className="space-y-3 border-t border-white/5 pt-5 first:border-t-0 first:pt-0">
      {section ? (
        <div className="rounded-xl bg-white/[0.03] px-3 py-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{section}</p>
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-slate-200">{label}</label>
            {badge ? (
              <Badge className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/5">
                {badge}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-blue-300">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function StudioChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-snug text-white text-balance">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-white mt-3">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0b1120] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`text-xl font-semibold mt-2 ${tone}`}>{value}</p>
    </div>
  );
}

function ImpactCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "blue" | "amber" | "violet" | "teal";
}) {
  const toneClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-200",
    violet: "bg-violet-500/10 border-violet-500/20 text-violet-200",
    teal: "bg-teal-500/10 border-teal-500/20 text-teal-200",
  } as const;

  return (
    <div className={`rounded-2xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-xs uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <p className="text-xs opacity-75 mt-2">{hint}</p>
    </div>
  );
}

function OutcomeBullet({
  label,
  before,
  after,
  formatter,
  tone,
}: {
  label: string;
  before: number;
  after: number;
  formatter: (value: number) => string;
  tone: "blue" | "amber" | "violet";
}) {
  const tones = {
    blue: "bg-blue-500",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
  } as const;
  const max = Math.max(before, after, 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-400">{formatter(after)}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-[11px] uppercase tracking-[0.18em] text-slate-500">Before</span>
          <div className="h-2 flex-1 rounded-full bg-white/6 overflow-hidden">
            <div className="h-full rounded-full bg-slate-500/70" style={{ width: `${(before / max) * 100}%` }} />
          </div>
          <span className="w-28 shrink-0 text-right text-xs text-slate-400">{formatter(before)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-[11px] uppercase tracking-[0.18em] text-slate-500">After</span>
          <div className="h-2 flex-1 rounded-full bg-white/6 overflow-hidden">
            <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${(after / max) * 100}%` }} />
          </div>
          <span className="w-28 shrink-0 text-right text-xs text-slate-200">{formatter(after)}</span>
        </div>
      </div>
    </div>
  );
}

function InterventionRail({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "blue" | "violet";
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <span className="text-xs text-slate-400">{formatConsumption(value)} credits</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/6 overflow-hidden">
        <div
          className={`h-full rounded-full ${tone === "blue" ? "bg-[linear-gradient(90deg,#3b82f6,#60a5fa)]" : "bg-[linear-gradient(90deg,#6366f1,#a855f7)]"}`}
          style={{ width: `${max ? Math.max(14, (value / max) * 100) : 14}%` }}
        />
      </div>
    </div>
  );
}
