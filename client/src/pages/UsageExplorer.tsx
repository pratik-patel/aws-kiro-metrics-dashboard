import { useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Eye,
  Layers3,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  KIRO_DATA,
  formatConsumption,
  getEngineersForTeam,
  getInteractionsForScope,
  getRecommendationsForScope,
  getTeamById,
  getTeamsForCostCenter,
  getUseCaseSummariesForScope,
} from "@/lib/kiro-data";

export default function UsageExplorer() {
  const [search, setSearch] = useState("");
  const [selectedCostCenterId, setSelectedCostCenterId] = useState(KIRO_DATA.costCenters[0]?.id ?? "");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedEngineerId, setSelectedEngineerId] = useState("");
  const [evidenceInteractionId, setEvidenceInteractionId] = useState<string | null>(null);

  const costCenters = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return KIRO_DATA.costCenters;
    return KIRO_DATA.costCenters.filter((item) => item.name.toLowerCase().includes(query));
  }, [search]);

  const selectedCostCenter = KIRO_DATA.costCenters.find((item) => item.id === selectedCostCenterId) ?? KIRO_DATA.costCenters[0];
  const teamsForCostCenter = selectedCostCenter ? getTeamsForCostCenter(selectedCostCenter.id) : [];
  const selectedTeam = teamsForCostCenter.find((item) => item.id === selectedTeamId) ?? null;
  const engineersForTeam = selectedTeam ? getEngineersForTeam(selectedTeam.id) : [];
  const selectedEngineer =
    engineersForTeam.find((engineer) => engineer.userId === selectedEngineerId || engineer.id === selectedEngineerId) ?? null;

  const scopedUseCases = selectedCostCenter
    ? getUseCaseSummariesForScope({
        costCenterId: selectedCostCenter.id,
        teamId: selectedTeam?.id,
        engineerId: selectedEngineer?.userId,
      })
    : [];

  const scopedInteractions = selectedEngineer
    ? getInteractionsForScope({ engineerId: selectedEngineer.userId })
    : selectedTeam
      ? getInteractionsForScope({ teamId: selectedTeam.id })
      : selectedCostCenter
        ? getInteractionsForScope({ costCenterId: selectedCostCenter.id })
        : [];

  const scopedRecommendations = selectedEngineer
    ? getRecommendationsForScope("Engineer", selectedEngineer.userId)
    : selectedTeam
      ? getRecommendationsForScope("Team", selectedTeam.id)
      : selectedCostCenter
        ? getRecommendationsForScope("Cost Center", selectedCostCenter.id)
        : [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <EvidenceDrawer
        open={Boolean(evidenceInteractionId)}
        onOpenChange={(open) => !open && setEvidenceInteractionId(null)}
        interactionId={evidenceInteractionId}
      />

      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Usage Explorer</h1>
          <p className="text-slate-400 text-lg">
            Start with Cost Centers, then drill into Teams, Engineers, and evidence-backed interactions.
          </p>
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
              Simulate Policy
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Filter cost centers by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9 bg-[#111827] border-white/10 text-slate-200 placeholder:text-slate-500 focus-visible:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Compass className="w-4 h-4" />
          <span>Scope path:</span>
          <span className="text-slate-300">{selectedCostCenter?.name ?? "Cost Center"}</span>
          {selectedTeam ? <ArrowRight className="w-4 h-4" /> : null}
          {selectedTeam ? <span className="text-slate-300">{selectedTeam.name}</span> : null}
          {selectedEngineer ? <ArrowRight className="w-4 h-4" /> : null}
          {selectedEngineer ? <span className="text-slate-300">{selectedEngineer.name}</span> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <CardTitle className="text-lg font-medium text-slate-200">Cost Center Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Select a Cost Center to reveal its teams, engineers, use cases, and interaction pressure.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {costCenters.map((costCenter) => (
              <button
                key={costCenter.id}
                type="button"
                onClick={() => {
                  setSelectedCostCenterId(costCenter.id);
                  setSelectedTeamId("");
                  setSelectedEngineerId("");
                }}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  selectedCostCenter?.id === costCenter.id
                    ? "border-blue-500/30 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.08)]"
                    : "border-white/5 bg-black/20 hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{costCenter.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{costCenter.code || "Cost Center"}</p>
                  </div>
                  <Badge className="bg-white/5 text-slate-300 border-white/10">{costCenter.teamCount} teams</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <ExplorerMetric label="AI Consumption" value={`${formatConsumption(costCenter.totalConsumption)} credits`} />
                  <ExplorerMetric label="Overrun" value={`${formatConsumption(costCenter.overrun)} credits`} tone="text-amber-300" />
                  <ExplorerMetric label="Top Use Case" value={costCenter.topUseCase} compact />
                  <ExplorerMetric label="Top Model" value={costCenter.topModel} compact />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
          <CardHeader className="bg-black/20 border-b border-white/5">
            <CardTitle className="text-lg font-medium text-slate-200">Current Scope Summary</CardTitle>
            <CardDescription className="text-slate-400">The active drill path and its most important governance signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="grid grid-cols-2 gap-4">
              <ExplorerMetric label="Cost Center" value={selectedCostCenter?.name ?? "N/A"} compact />
              <ExplorerMetric label="Recommendations" value={String(scopedRecommendations.length)} />
              <ExplorerMetric label="Top Use Case" value={scopedUseCases[0]?.label ?? selectedCostCenter?.topUseCase ?? "N/A"} compact />
              <ExplorerMetric label="Evidence-rich Interactions" value={String(scopedInteractions.filter((item) => item.evidence.chatCount > 0).length)} />
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Why this scope matters</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedEngineer
                  ? `${selectedEngineer.name} is a high-signal engineer to inspect because they combine ${selectedEngineer.topUseCase} work with ${selectedEngineer.topModel} usage and ${selectedEngineer.activeDays} active days.`
                  : selectedTeam
                    ? `${selectedTeam.name} is the best team-level review point inside ${selectedCostCenter?.name} because it concentrates ${formatConsumption(selectedTeam.totalConsumption)} credits and points to ${selectedTeam.topUseCase}.`
                    : `${selectedCostCenter?.name} is the best starting point because it carries the strongest cost and recommendation signal in the current dataset.`}
              </p>
            </div>
            {selectedCostCenter ? (
              <Link href={`/detail/cost-center/${selectedCostCenter.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                  <Layers3 className="w-4 h-4 mr-2" />
                  Open Detailed Workspace
                </Button>
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {selectedCostCenter ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Teams in {selectedCostCenter.name}</CardTitle>
              <CardDescription className="text-slate-400">
                Click a team to reveal its engineers and related use-case pressure.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 p-0">
              {teamsForCostCenter.map((team) => {
                const isSelected = selectedTeam?.id === team.id;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setSelectedEngineerId("");
                    }}
                    className={`w-full p-5 text-left transition-colors ${isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-100">{team.name}</p>
                        <p className="text-sm text-slate-400 mt-1">{team.engineeringManager} · {team.activeEngineers} engineers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-100 font-semibold">{formatConsumption(team.totalConsumption)} credits</p>
                        <p className="text-xs text-slate-500 mt-1">{team.topUseCase}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Use Cases in Scope</CardTitle>
              <CardDescription className="text-slate-400">
                SDLC-oriented breakdown of what is driving the current slice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {scopedUseCases.slice(0, 4).map((useCase) => (
                <div key={useCase.key} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-100">{useCase.label}</p>
                      <p className="text-sm text-slate-400 mt-1">{useCase.category}</p>
                    </div>
                    <Badge className="bg-white/5 text-slate-300 border-white/10">
                      {formatConsumption(useCase.totalConsumption)} credits
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">{useCase.summary}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="text-slate-400">
                      Avg prompt: <span className="text-slate-200">{useCase.avgPromptChars.toLocaleString()} chars</span>
                    </div>
                    <div className="text-slate-400">
                      Recommended tier: <span className="text-slate-200">{useCase.recommendedModelTier}</span>
                    </div>
                    <div className="text-slate-400">
                      Model: <span className="text-slate-200">{useCase.dominantModel}</span>
                    </div>
                    <div className="text-slate-400">
                      Tooling: <span className="text-slate-200">{useCase.dominantPlugin}</span>
                    </div>
                    <div className="text-slate-400">
                      Top source: <span className="text-slate-200">{useCase.topRequestSource}</span>
                    </div>
                    <div className="text-slate-400">
                      Execution: <span className="text-slate-200">{useCase.executionPattern}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {selectedTeam ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Engineers in {selectedTeam.name}</CardTitle>
              <CardDescription className="text-slate-400">
                Choose an engineer to inspect activity, high-cost interactions, and input drivers.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 p-0">
              {engineersForTeam.map((engineer) => {
                const isSelected = selectedEngineer?.userId === engineer.userId;
                return (
                  <button
                    key={engineer.userId}
                    type="button"
                    onClick={() => setSelectedEngineerId(engineer.userId)}
                    className={`w-full p-5 text-left transition-colors ${isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-100">{engineer.name}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {engineer.activeDays} active days · {engineer.subscriptionStatus} · {engineer.subscriptionTier}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-100 font-semibold">{formatConsumption(engineer.totalConsumption)} credits</p>
                        <p className="text-xs text-slate-500 mt-1">{engineer.topUseCase}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Current Engineer Snapshot</CardTitle>
              <CardDescription className="text-slate-400">The most useful context before opening interaction evidence or a detail page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {selectedEngineer ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <ExplorerMetric label="Engineer" value={selectedEngineer.name} compact />
                    <ExplorerMetric label="Manager" value={selectedEngineer.engineeringManager} compact />
                    <ExplorerMetric label="Top Model" value={selectedEngineer.topModel} compact />
                    <ExplorerMetric label="Top Plugin" value={selectedEngineer.topPlugin} compact />
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-3">Client Mix</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedEngineer.clientMix).map(([key, value]) => (
                        <Badge key={key} className="bg-white/5 text-slate-300 border-white/10">
                          {key.replace("KIRO_", "")}: {value}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={`/detail/engineer/${selectedEngineer.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                      <Users className="w-4 h-4 mr-2" />
                      Open Engineer Detail
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-slate-500">
                  Select a team member to continue the drill path.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {selectedEngineer ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">High-Cost Interactions for {selectedEngineer.name}</CardTitle>
              <CardDescription className="text-slate-400">
                Click evidence to inspect prompt logs, inline completions, and input drivers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 bg-black/40 uppercase border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 font-medium">Request ID</th>
                      <th className="px-6 py-4 font-medium">Use Case</th>
                      <th className="px-6 py-4 font-medium">Model</th>
                      <th className="px-6 py-4 font-medium text-right">Prompt Chars</th>
                      <th className="px-6 py-4 font-medium text-right">AI Consumption</th>
                      <th className="px-6 py-4 font-medium text-right">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {scopedInteractions.slice(0, 8).map((interaction) => (
                      <tr key={interaction.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-blue-300">{interaction.id.slice(0, 14)}…</td>
                        <td className="px-6 py-4 text-slate-300">{interaction.useCaseLabel}</td>
                        <td className="px-6 py-4 text-slate-400">{interaction.modelName}</td>
                        <td className="px-6 py-4 text-right text-slate-300">{interaction.promptChars.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-slate-100 font-semibold">{formatConsumption(interaction.estimatedCredits)}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-300 hover:text-teal-200 hover:bg-teal-500/10"
                            onClick={() => setEvidenceInteractionId(interaction.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {interaction.evidence.chatCount} chat / {interaction.evidence.inlineCount} inline
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Recommendations in Scope</CardTitle>
              <CardDescription className="text-slate-400">The actions most relevant to the current drill path.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {scopedRecommendations.slice(0, 4).map((recommendation) => (
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
              <Link href="/recommendations">
                <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5 hover:text-white">
                  <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
                  Open Full Recommendations Workspace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function ExplorerMetric({
  label,
  value,
  compact = false,
  tone = "text-white",
}: {
  label: string;
  value: string;
  compact?: boolean;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-2 ${compact ? "text-sm" : "text-base"} font-semibold ${tone}`}>{value}</p>
    </div>
  );
}
