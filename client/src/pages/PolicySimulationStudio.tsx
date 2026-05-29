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
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  routingStrictness: number;
  promptThreshold: number;
  lowUtilizationThreshold: number;
  pluginReviewThreshold: number;
  mcpReviewThreshold: number;
  steeringScope: number;
  overrunAlertThreshold: number;
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
    routingStrictness: 70,
    promptThreshold: 6200,
    lowUtilizationThreshold: 3,
    pluginReviewThreshold: 55,
    mcpReviewThreshold: 55,
    steeringScope: 45,
    overrunAlertThreshold: 180,
  },
  "Cost Concentration Review": {
    routingStrictness: 78,
    promptThreshold: 6500,
    lowUtilizationThreshold: 4,
    pluginReviewThreshold: 50,
    mcpReviewThreshold: 50,
    steeringScope: 40,
    overrunAlertThreshold: 145,
  },
  "License Hygiene Review": {
    routingStrictness: 45,
    promptThreshold: 7000,
    lowUtilizationThreshold: 5,
    pluginReviewThreshold: 35,
    mcpReviewThreshold: 35,
    steeringScope: 30,
    overrunAlertThreshold: 220,
  },
  "Optimization Recommendations": {
    routingStrictness: 82,
    promptThreshold: 5600,
    lowUtilizationThreshold: 3,
    pluginReviewThreshold: 65,
    mcpReviewThreshold: 58,
    steeringScope: 52,
    overrunAlertThreshold: 160,
  },
  "Model Routing Review": {
    routingStrictness: 92,
    promptThreshold: 6000,
    lowUtilizationThreshold: 3,
    pluginReviewThreshold: 45,
    mcpReviewThreshold: 42,
    steeringScope: 38,
    overrunAlertThreshold: 170,
  },
  "Use Case Risk Review": {
    routingStrictness: 74,
    promptThreshold: 5400,
    lowUtilizationThreshold: 3,
    pluginReviewThreshold: 70,
    mcpReviewThreshold: 62,
    steeringScope: 60,
    overrunAlertThreshold: 150,
  },
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
            Choose a scope, tune the guardrails, and compare projected impact before changing live behavior.
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
                label="Model Routing Strictness"
                value={levers.routingStrictness}
                min={25}
                max={100}
                suffix="%"
                onChange={(value) => setLevers((current) => ({ ...current, routingStrictness: value }))}
              />
              <SliderField
                label="Prompt Threshold"
                value={levers.promptThreshold}
                min={3000}
                max={9000}
                step={250}
                suffix=" chars"
                onChange={(value) => setLevers((current) => ({ ...current, promptThreshold: value }))}
              />
              <SliderField
                label="Low-utilization Seat Threshold"
                value={levers.lowUtilizationThreshold}
                min={1}
                max={8}
                suffix=" days"
                onChange={(value) => setLevers((current) => ({ ...current, lowUtilizationThreshold: value }))}
              />
              <SliderField
                label="Plugin Review Threshold"
                value={levers.pluginReviewThreshold}
                min={10}
                max={100}
                suffix="%"
                onChange={(value) => setLevers((current) => ({ ...current, pluginReviewThreshold: value }))}
              />
              <SliderField
                label="MCP Review Threshold"
                value={levers.mcpReviewThreshold}
                min={10}
                max={100}
                suffix="%"
                onChange={(value) => setLevers((current) => ({ ...current, mcpReviewThreshold: value }))}
              />
              <SliderField
                label="Steering Scope Controls"
                value={levers.steeringScope}
                min={5}
                max={100}
                suffix="%"
                onChange={(value) => setLevers((current) => ({ ...current, steeringScope: value }))}
              />
              <SliderField
                label="Overrun Alert Threshold"
                value={levers.overrunAlertThreshold}
                min={60}
                max={300}
                suffix=" credits"
                onChange={(value) => setLevers((current) => ({ ...current, overrunAlertThreshold: value }))}
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
                    <h3 className="text-sm font-medium text-blue-100">Recommended next move</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {topRecommendation?.title ??
                        "Use the current simulation summary to prioritize which recommendation bundle should be reviewed next."}
                    </p>
                    {topRecommendation?.recommendedAction && (
                      <p className="mt-2 text-xs leading-6 text-slate-400">{topRecommendation.recommendedAction}</p>
                    )}
                  </div>
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
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simulation.interventionChart} margin={{ bottom: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          label={{ value: "Intervention", position: "insideBottom", offset: -6, fill: "#94A3B8", fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          label={{ value: "Projected credits", angle: -90, position: "insideLeft", fill: "#94A3B8", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          contentStyle={{
                            backgroundColor: "#0B1120",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                          }}
                          formatter={(value: number) => [`${formatConsumption(value)} credits`, "Projected delta"]}
                        />
                        <Bar dataKey="delta" fill="url(#simulationGradient)" radius={[10, 10, 0, 0]} />
                        <defs>
                          <linearGradient id="simulationGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#A855F7" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
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
                            <p className="text-xs text-slate-500 mt-1">{useCase.category}</p>
                          </div>
                          <Badge className="bg-white/5 text-slate-300 border-white/10">
                            {formatConsumption(useCase.totalConsumption)}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-400">
                          <div>Model: <span className="text-slate-200">{useCase.dominantModel}</span></div>
                          <div>Prompt avg: <span className="text-slate-200">{useCase.avgPromptChars.toLocaleString()}</span></div>
                          <div>Plugin: <span className="text-slate-200">{useCase.dominantPlugin}</span></div>
                          <div>MCP: <span className="text-slate-200">{useCase.dominantMcp}</span></div>
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
                {simulation.summary.map((item) => (
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
                      This simulation uses observed Kiro telemetry for prompts, models, tools, and use cases. Steering,
                      retrieved context, and instruction overhead remain estimated.
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
  const promptHeavyInteractions = scope.interactions.filter((interaction) => interaction.promptChars >= levers.promptThreshold);
  const modelMismatchInteractions = scope.interactions.filter(
    (interaction) =>
      ["test-generation", "guardrail-evaluation"].includes(interaction.useCaseKey) &&
      interaction.modelCategory === "High Reasoning",
  );
  const pluginHeavyInteractions = scope.interactions.filter((interaction) => interaction.pluginName !== "Direct Kiro");
  const mcpHeavyInteractions = scope.interactions.filter((interaction) => interaction.mcpServer !== "No MCP Invoked");
  const steeringHeavyInteractions = scope.interactions.filter((interaction) =>
    interaction.inputDrivers.some((driver) => driver.label === "Instruction / Steering Overhead"),
  );
  const lowUtilizationSeats = scope.engineers.filter(
    (engineer) => engineer.subscriptionStatus.toLowerCase() === "active" && engineer.activeDays <= levers.lowUtilizationThreshold,
  );

  const modelSavings = modelMismatchInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) * (levers.routingStrictness / 100) * 0.26;
  const promptSavings =
    promptHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    Math.max(0, (8200 - levers.promptThreshold) / 5200) *
    0.16;
  const pluginSavings =
    pluginHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    (levers.pluginReviewThreshold / 100) *
    0.07;
  const mcpSavings =
    mcpHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    (levers.mcpReviewThreshold / 100) *
    0.05;
  const steeringSavings =
    steeringHeavyInteractions.reduce((sum, interaction) => sum + interaction.estimatedCredits, 0) *
    (levers.steeringScope / 100) *
    0.09;

  const totalDelta = Math.min(
    scope.totalConsumption * 0.38,
    Math.round(modelSavings + promptSavings + pluginSavings + mcpSavings + steeringSavings),
  );
  const overrunDelta = Math.min(scope.overrun, Math.round(totalDelta * 0.18 + scope.overrun * 0.12));
  const flaggedBefore = scope.interactions.filter(
    (interaction) => interaction.estimatedCredits >= levers.overrunAlertThreshold,
  ).length;
  const flaggedAfter = Math.max(
    0,
    flaggedBefore -
      Math.round(
        (modelMismatchInteractions.length * (levers.routingStrictness / 100)) / 2 +
          (promptHeavyInteractions.length * Math.max(0, (7000 - levers.promptThreshold) / 4000)) / 2,
      ),
  );

  const interventionChart = [
    { name: "Model routing", delta: Math.round(modelSavings) },
    { name: "Prompt discipline", delta: Math.round(promptSavings) },
    { name: "Plugin review", delta: Math.round(pluginSavings) },
    { name: "MCP review", delta: Math.round(mcpSavings) },
    { name: "Steering scope", delta: Math.round(steeringSavings) },
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
    pluginHeavyCount: pluginHeavyInteractions.length,
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
      `${modelMismatchInteractions.length} interactions use a high-reasoning tier for lower-complexity workflows.`,
      `The strongest candidate for lighter routing is ${topUseCase?.label ?? "the dominant use case"} based on current prompt and response patterns.`,
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
      `${scope.label} shows a mix of prompt bloat, model mismatch, and tool-driven context expansion.`,
      topRecommendation
        ? `Top action: ${topRecommendation.title}.`
        : "No single recommendation dominates; the opportunity is distributed across multiple usage patterns.",
      ...shared,
    ];
  }

  return [
    `${promptHeavyInteractions.length} interactions exceed the chosen prompt threshold and are likely carrying repeated context.`,
    `${modelMismatchInteractions.length} interactions could shift to a lighter model tier with limited quality risk.`,
    ...shared,
  ];
}

function SliderField({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix: string;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-slate-300">{label}</label>
        <span className="text-xs font-mono text-blue-300">
          {value.toLocaleString()}
          {suffix}
        </span>
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
