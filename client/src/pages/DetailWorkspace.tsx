import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  Layers3,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  formatConsumption,
  formatPercent,
  getCostCenterById,
  getEngineerBySlug,
  getEngineersForTeam,
  getInteractionById,
  getInteractionsForScope,
  getRecommendationsForScope,
  getTeamById,
  getTeamsForCostCenter,
  getUseCaseSummariesForScope,
} from "@/lib/kiro-data";

export default function DetailWorkspace() {
  const params = useParams<{ entityType: string; entityId: string }>();
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);

  const entityType = params.entityType;
  const entityId = params.entityId;

  const resolved = useMemo(() => resolveScope(entityType, entityId), [entityId, entityType]);
  const interactions = useMemo(() => getInteractionsForScope(resolved.scope), [resolved.scope]);
  const useCases = useMemo(() => getUseCaseSummariesForScope(resolved.scope), [resolved.scope]);
  const recommendations = useMemo(
    () => getRecommendationsForScope(resolved.recommendationScopeType, resolved.recommendationScopeId),
    [resolved.recommendationScopeId, resolved.recommendationScopeType],
  );

  const modelsAndTools = useMemo(() => {
    const modelMap = new Map<string, number>();
    const pluginMap = new Map<string, number>();
    const mcpMap = new Map<string, number>();
    const channelMap = new Map<string, number>();

    interactions.forEach((interaction) => {
      modelMap.set(interaction.modelName, (modelMap.get(interaction.modelName) || 0) + interaction.estimatedCredits);
      if (interaction.pluginName !== "Direct Kiro") {
        pluginMap.set(interaction.pluginName, (pluginMap.get(interaction.pluginName) || 0) + interaction.estimatedCredits);
      }
      if (interaction.mcpServer !== "No MCP Invoked") {
        mcpMap.set(interaction.mcpServer, (mcpMap.get(interaction.mcpServer) || 0) + interaction.estimatedCredits);
      }
      channelMap.set(interaction.requestSource, (channelMap.get(interaction.requestSource) || 0) + interaction.estimatedCredits);
    });

    return {
      models: Array.from(modelMap.entries()).sort((a, b) => b[1] - a[1]),
      plugins: Array.from(pluginMap.entries()).sort((a, b) => b[1] - a[1]),
      mcps: Array.from(mcpMap.entries()).sort((a, b) => b[1] - a[1]),
      channels: Array.from(channelMap.entries()).sort((a, b) => b[1] - a[1]),
    };
  }, [interactions]);

  const scatterData = useMemo(
    () =>
      interactions.map((interaction) => ({
        x: interaction.promptChars,
        y: interaction.estimatedCredits,
        z: interaction.responseChars,
        name: interaction.useCaseLabel,
      })),
    [interactions],
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Link href="/explorer" className="hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Explorer
        </Link>
        <span>/</span>
        <span className="capitalize text-slate-300">{resolved.entityLabel}</span>
      </div>

      <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/5 text-slate-300 border-white/10">{resolved.entityLabel}</Badge>
            {resolved.scopeLabel ? <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">{resolved.scopeLabel}</Badge> : null}
          </div>
          <h1 className="dashboard-page-title mb-2">{resolved.title}</h1>
          <p className="dashboard-page-lead">{resolved.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/recommendations">
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
              View Recommendations
            </Button>
          </Link>
          <Link href="/studio">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
              <Zap className="w-4 h-4 mr-2" />
              Run Advisor on Scope
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resolved.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Tabs defaultValue={resolved.defaultTab} className="w-full">
        <TabsList className="bg-[#111827] border border-white/5 p-1 flex flex-wrap h-auto">
          {resolved.tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="summary" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="dashboard-card-title text-slate-200">Top Use Cases</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={useCases.slice(0, 6).map((item) => ({ name: item.label, consumption: Number(item.totalConsumption.toFixed(2)) }))}
                    layout="vertical"
                    margin={{ left: 20, bottom: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
                    <XAxis
                      type="number"
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                      height={22}
                      label={{ value: "Credits", position: "insideBottom", offset: -6, fill: "#94A3B8", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      stroke="#cbd5e1"
                      fontSize={11}
                      label={{ value: "Use case", angle: -90, position: "insideLeft", dx: -12, fill: "#94A3B8", fontSize: 12 }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                    <Bar dataKey="consumption" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="dashboard-card-title text-slate-200">Scope Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                {recommendations.slice(0, 4).map((recommendation) => (
                  <div key={recommendation.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">{recommendation.title}</p>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{recommendation.whyItMatters}</p>
                      </div>
                      <Badge
                        className={
                          recommendation.severity === "High"
                            ? "bg-red-500/10 text-red-300 border-red-500/20"
                            : recommendation.severity === "Medium"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                        }
                      >
                        {recommendation.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ownership" className="mt-6">
          <OwnershipPanel resolved={resolved} />
        </TabsContent>

        <TabsContent value="use-cases" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <Card key={useCase.key} className="bg-[#111827] border-white/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="dashboard-card-title text-slate-200">{useCase.label}</CardTitle>
                      <CardDescription className="text-slate-400">{useCase.category}</CardDescription>
                    </div>
                    <Badge className="bg-white/5 text-slate-300 border-white/10">
                      {formatConsumption(useCase.totalConsumption)} credits
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 border-t border-white/5 bg-[#0c1220]/50 pt-5">
                  <p className="text-sm text-slate-300 leading-relaxed">{useCase.summary}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniMetric label="Avg Prompt" value={`${useCase.avgPromptChars.toLocaleString()} chars`} />
                    <MiniMetric label="Avg Response" value={`${useCase.avgResponseChars.toLocaleString()} chars`} />
                    <MiniMetric label="Dominant Model" value={useCase.dominantModel} />
                    <MiniMetric label="Recommended Tier" value={useCase.recommendedModelTier} />
                    <MiniMetric label="Top Source" value={useCase.topRequestSource} />
                    <MiniMetric label="Execution Pattern" value={useCase.executionPattern} />
                    <MiniMetric label="Deterministic Share" value={formatPercent(useCase.deterministicShare)} />
                    <MiniMetric label="High-Reasoning Share" value={formatPercent(useCase.highReasoningShare)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models-tools" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
            <RankingCard
              title="Model Mix"
              description="Most expensive models in this scope."
              items={modelsAndTools.models.map(([label, value]) => ({ label, value: `${formatConsumption(value)} credits` }))}
            />
            <RankingCard
              title="Interaction Source"
              description="Which channels are contributing most to AI consumption."
              items={modelsAndTools.channels.map(([label, value]) => ({ label, value: `${formatConsumption(value)} credits` }))}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
            <RankingCard
              title="Plugin Impact"
              description="Named plugins only, excluding Direct Kiro."
              items={modelsAndTools.plugins.map(([label, value]) => ({ label, value: `${formatConsumption(value)} credits` }))}
            />
            <RankingCard
              title="MCP Impact"
              description="Named MCP servers only, excluding No MCP Invoked."
              items={modelsAndTools.mcps.map(([label, value]) => ({ label, value: `${formatConsumption(value)} credits` }))}
            />
          </div>
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader>
              <CardTitle className="dashboard-card-title text-slate-200">Prompt Size vs AI Consumption</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 16, right: 16, bottom: 24, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Prompt Chars"
                    stroke="#cbd5e1"
                    fontSize={12}
                    label={{ value: "Prompt chars", position: "insideBottom", offset: -6, fill: "#94A3B8", fontSize: 12 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="AI Consumption"
                    stroke="#cbd5e1"
                    fontSize={12}
                    label={{ value: "Credits", angle: -90, position: "insideLeft", fill: "#94A3B8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3", stroke: "#cbd5e1" }}
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  />
                  <Scatter data={scatterData} fill="#f59e0b" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader>
              <CardTitle className="dashboard-card-title text-slate-200">Recommendations in Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={
                            recommendation.severity === "High"
                              ? "bg-red-500/10 text-red-300 border-red-500/20"
                              : recommendation.severity === "Medium"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          }
                        >
                          {recommendation.severity}
                        </Badge>
                        <Badge className="bg-white/5 text-slate-300 border-white/10">{recommendation.type}</Badge>
                      </div>
                      <p className="text-lg font-medium text-slate-100">{recommendation.title}</p>
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">{recommendation.whyItMatters}</p>
                      <p className="text-sm text-slate-200 mt-3">{recommendation.recommendedAction}</p>
                    </div>
                    <span className="text-xs text-slate-500">{recommendation.scopeLabel}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200">Interaction Evidence</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="dashboard-table text-left">
                  <thead className="dashboard-table-head">
                    <tr>
                      <th className="dashboard-table-head-cell">Request ID</th>
                      <th className="dashboard-table-head-cell">Use Case</th>
                      <th className="dashboard-table-head-cell">Model</th>
                      <th className="dashboard-table-head-cell text-right">Prompt</th>
                      <th className="dashboard-table-head-cell text-right">Response</th>
                      <th className="dashboard-table-head-cell text-right">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interactions.slice(0, 10).map((interaction) => (
                      <tr key={interaction.id} className="dashboard-table-row hover:bg-white/[0.02]">
                        <td className="dashboard-table-cell font-mono text-[0.8rem] text-blue-300">{interaction.id.slice(0, 14)}…</td>
                        <td className="dashboard-table-cell">{interaction.useCaseLabel}</td>
                        <td className="dashboard-table-cell text-slate-400">{interaction.modelName}</td>
                        <td className="dashboard-table-cell text-right">{interaction.promptChars.toLocaleString()}</td>
                        <td className="dashboard-table-cell text-right">{interaction.responseChars.toLocaleString()}</td>
                        <td className="dashboard-table-cell text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-300 hover:text-teal-200 hover:bg-teal-500/10"
                            onClick={() => setEvidenceInteractionId(interaction.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {interaction.evidence.chatCount} / {interaction.evidence.inlineCount}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader>
              <CardTitle className="dashboard-card-title text-slate-200">Reports & Exports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="flex flex-wrap gap-3">
                <Link href="/reports">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Open Reports & Evidence
                  </Button>
                </Link>
                <Link href="/studio">
                  <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 hover:text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate from Studio
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg">
      <CardContent className="pt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className={`mt-3 ${compact ? "text-sm" : "text-2xl"} font-semibold text-white`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-100 mt-2">{value}</p>
    </div>
  );
}

function RankingCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg">
      <CardHeader>
        <CardTitle className="dashboard-card-title text-slate-200">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {items.length ? (
          items.slice(0, 6).map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-300">
                  {index + 1}
                </div>
                <span className="text-sm text-slate-100">{item.label}</span>
              </div>
              <span className="text-sm text-slate-400">{item.value}</span>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-slate-500">
            No ranked items were present in this scope.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OwnershipPanel({
  resolved,
}: {
  resolved: ReturnType<typeof resolveScope>;
}) {
  if (resolved.entityType === "cost-center") {
    const teams = resolved.costCenter ? getTeamsForCostCenter(resolved.costCenter.id) : [];
    return (
      <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/5">
          <CardTitle className="dashboard-card-title text-slate-200">Teams in Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {teams.map((team) => (
            <div key={team.id} className="rounded-2xl border border-white/5 bg-black/20 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-100 font-medium">{team.name}</p>
                <p className="text-sm text-slate-400 mt-1">{team.activeEngineers} engineers · {team.topUseCase}</p>
              </div>
              <Link href={`/detail/team/${team.id}`}>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/10">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (resolved.entityType === "team") {
    const engineers = resolved.team ? getEngineersForTeam(resolved.team.id) : [];
    return (
      <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/5">
          <CardTitle className="dashboard-card-title text-slate-200">Engineers in Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          {engineers.map((engineer) => (
            <div key={engineer.userId} className="rounded-2xl border border-white/5 bg-black/20 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-100 font-medium">{engineer.name}</p>
                <p className="text-sm text-slate-400 mt-1">{engineer.activeDays} active days · {engineer.topUseCase}</p>
              </div>
              <Link href={`/detail/engineer/${engineer.id}`}>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/10">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (resolved.entityType === "engineer" && resolved.engineer) {
    return (
      <Card className="bg-[#111827] border-white/5 shadow-lg">
        <CardHeader>
          <CardTitle className="dashboard-card-title text-slate-200">Engineer Activity Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <MiniMetric label="Subscription Tier" value={resolved.engineer.subscriptionTier} />
            <MiniMetric label="Plan Source" value={resolved.engineer.planSource} />
            <MiniMetric label="Top Model" value={resolved.engineer.topModel} />
            <MiniMetric label="Top Plugin" value={resolved.engineer.topPlugin} />
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Client Mix</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(resolved.engineer.clientMix).map(([key, value]) => (
                <Badge key={key} className="bg-white/5 text-slate-300 border-white/10">
                  {key.replace("KIRO_", "")}: {formatPercent(value)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg">
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400">Ownership detail is not applicable for this entity.</p>
      </CardContent>
    </Card>
  );
}

function resolveScope(entityType: string, entityId: string) {
  const costCenter = entityType === "cost-center" ? getCostCenterById(entityId) : null;
  const team = entityType === "team" ? getTeamById(entityId) : null;
  const engineer = entityType === "engineer" ? getEngineerBySlug(entityId) : null;
  const interaction = entityType === "interaction" ? getInteractionById(entityId) : null;

  if (costCenter) {
    return {
      entityType,
      entityLabel: "Cost Center",
      title: costCenter.name,
      description: "Ownership, use-case, and interaction analysis for the selected cost center.",
      scope: { costCenterId: costCenter.id },
      scopeLabel: costCenter.code,
      recommendationScopeType: "Cost Center" as const,
      recommendationScopeId: costCenter.id,
      costCenter,
      team: null,
      engineer: null,
      interaction: null,
      metrics: [
        { label: "AI Consumption", value: `${formatConsumption(costCenter.totalConsumption)} credits` },
        { label: "Overrun", value: `${formatConsumption(costCenter.overrun)} credits` },
        { label: "Teams", value: String(costCenter.teamCount) },
        { label: "Top Engineer", value: costCenter.topEngineer, compact: true },
      ],
      tabs: [
        { value: "summary", label: "Summary" },
        { value: "ownership", label: "Teams" },
        { value: "use-cases", label: "Use Cases" },
        { value: "models-tools", label: "Models & Tools" },
        { value: "recommendations", label: "Recommendations" },
        { value: "evidence", label: "Evidence" },
        { value: "reports", label: "Reports" },
      ],
      defaultTab: "summary",
    };
  }

  if (team) {
    return {
      entityType,
      entityLabel: "Team",
      title: team.name,
      description: "Team-level ownership, use-case behavior, and model/tool pressure.",
      scope: { costCenterId: team.costCenterId, teamId: team.id },
      scopeLabel: team.costCenterName,
      recommendationScopeType: "Team" as const,
      recommendationScopeId: team.id,
      costCenter: null,
      team,
      engineer: null,
      interaction: null,
      metrics: [
        { label: "AI Consumption", value: `${formatConsumption(team.totalConsumption)} credits` },
        { label: "Overrun", value: `${formatConsumption(team.overrun)} credits` },
        { label: "Active Engineers", value: String(team.activeEngineers) },
        { label: "Top Use Case", value: team.topUseCase, compact: true },
      ],
      tabs: [
        { value: "summary", label: "Summary" },
        { value: "ownership", label: "Engineers" },
        { value: "use-cases", label: "Use Cases" },
        { value: "models-tools", label: "Models & Tools" },
        { value: "recommendations", label: "Recommendations" },
        { value: "evidence", label: "Evidence" },
        { value: "reports", label: "Reports" },
      ],
      defaultTab: "summary",
    };
  }

  if (engineer) {
    return {
      entityType,
      entityLabel: "Engineer",
      title: engineer.name,
      description: "Engineer-level activity, use-case, and high-cost interaction review.",
      scope: { costCenterId: engineer.costCenterId, teamId: engineer.teamId, engineerId: engineer.userId },
      scopeLabel: `${engineer.teamName} · ${engineer.costCenterName}`,
      recommendationScopeType: "Engineer" as const,
      recommendationScopeId: engineer.userId,
      costCenter: null,
      team: null,
      engineer,
      interaction: null,
      metrics: [
        { label: "AI Consumption", value: `${formatConsumption(engineer.totalConsumption)} credits` },
        { label: "Overrun", value: `${formatConsumption(engineer.overrun)} credits` },
        { label: "Active Days", value: String(engineer.activeDays) },
        { label: "Top Use Case", value: engineer.topUseCase, compact: true },
      ],
      tabs: [
        { value: "summary", label: "Summary" },
        { value: "ownership", label: "Activity" },
        { value: "use-cases", label: "Use Cases" },
        { value: "models-tools", label: "Models & Tools" },
        { value: "recommendations", label: "Recommendations" },
        { value: "evidence", label: "Evidence" },
        { value: "reports", label: "Reports" },
      ],
      defaultTab: "summary",
    };
  }

  if (interaction) {
    return {
      entityType,
      entityLabel: "Interaction",
      title: interaction.id,
      description: "Prompt evidence, model/tool metadata, and the drivers behind this single interaction.",
      scope: { engineerId: interaction.userId },
      scopeLabel: interaction.useCaseLabel,
      recommendationScopeType: "Interaction" as const,
      recommendationScopeId: interaction.id,
      costCenter: null,
      team: null,
      engineer: null,
      interaction,
      metrics: [
        { label: "AI Consumption", value: `${formatConsumption(interaction.estimatedCredits)} credits` },
        { label: "Prompt Chars", value: interaction.promptChars.toLocaleString() },
        { label: "Response Chars", value: interaction.responseChars.toLocaleString() },
        { label: "Model", value: interaction.modelName, compact: true },
      ],
      tabs: [
        { value: "summary", label: "Summary" },
        { value: "models-tools", label: "Input Drivers" },
        { value: "evidence", label: "Evidence" },
        { value: "recommendations", label: "Recommendations" },
        { value: "reports", label: "Reports" },
      ],
      defaultTab: "evidence",
    };
  }

  return {
    entityType,
    entityLabel: "Scope",
    title: "Unknown Scope",
    description: "The selected entity could not be resolved from the Kiro dataset.",
    scope: {},
    scopeLabel: "",
    recommendationScopeType: "Enterprise" as const,
    recommendationScopeId: "enterprise",
    costCenter: null,
    team: null,
    engineer: null,
    interaction: null,
    metrics: [],
    tabs: [{ value: "summary", label: "Summary" }],
    defaultTab: "summary",
  };
}
