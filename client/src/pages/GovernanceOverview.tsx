import { AlertTriangle, ArrowUpRight, Compass, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KIRO_DATA, formatConsumption } from "@/lib/kiro-data";

const TREEMAP_COLORS = ["#1D4ED8", "#4F46E5", "#0F766E", "#0369A1", "#7C3AED", "#2563EB"];

export default function GovernanceOverview() {
  const treemapData = KIRO_DATA.costCenters.map((costCenter, index) => ({
    name: costCenter.name,
    size: Number(costCenter.totalConsumption.toFixed(2)),
    fill: TREEMAP_COLORS[index % TREEMAP_COLORS.length],
  }));

  const topRecommendations = KIRO_DATA.recommendations.slice(0, 4);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Kiro AI Consumption Governance</h1>
          <p className="text-slate-400 text-lg">Enterprise visibility, accountability, and optimization for Kiro telemetry.</p>
          <p className="text-slate-500 text-sm mt-3 max-w-3xl leading-relaxed">
            Start with current posture, then move straight into Cost Center ownership, use-case pressure, and the
            policy decisions most likely to reduce overrun and prompt bloat.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/reports">
            <Button variant="outline" className="bg-black/20 border-white/10 hover:bg-white/5 hover:text-white">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-300" />
              Generate Strategic Report
            </Button>
          </Link>
          <Link href="/studio">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.18)]">
              <Zap className="w-4 h-4 mr-2" />
              Run AI Advisor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Total AI Consumption" value={`${formatConsumption(KIRO_DATA.kpis.totalConsumption)} credits`} hint="Across exported Kiro activity" />
        <KpiCard label="Overrun" value={`${formatConsumption(KIRO_DATA.kpis.overrun)} credits`} hint="Observed in current dataset" tone="amber" />
        <KpiCard label="Active Engineers" value={String(KIRO_DATA.kpis.activeEngineers)} hint="Mapped through team and cost center" />
        <KpiCard label="Consumption / Engineer" value={`${formatConsumption(KIRO_DATA.kpis.consumptionPerEngineer)} credits`} hint="Average across active users" />
        <KpiCard label="Top Cost Center" value={KIRO_DATA.kpis.topCostCenter} hint="Highest AI consumption" compact />
        <KpiCard label="Top Use Case" value={KIRO_DATA.kpis.topUseCase} hint="Most expensive SDLC workflow" compact />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <OverviewTile
          title="Top Cost Centers"
          metric={KIRO_DATA.kpis.topCostCenter}
          detail={`${formatConsumption(KIRO_DATA.costCenters[0]?.totalConsumption ?? 0)} credits`}
          description="Largest concentration of spend in the current period."
          href={`/detail/cost-center/${KIRO_DATA.costCenters[0]?.id ?? ""}`}
        />
        <OverviewTile
          title="Top Teams"
          metric={KIRO_DATA.kpis.topTeam}
          detail={`${formatConsumption(KIRO_DATA.teams[0]?.totalConsumption ?? 0)} credits`}
          description="Best next drill point for ownership review."
          href={`/detail/team/${KIRO_DATA.teams[0]?.id ?? ""}`}
        />
        <OverviewTile
          title="Top Use Cases"
          metric={KIRO_DATA.kpis.topUseCase}
          detail={`${formatConsumption(KIRO_DATA.useCases[0]?.totalConsumption ?? 0)} credits`}
          description="Where optimization and routing guidance will matter most."
          href="/explorer"
        />
        <OverviewTile
          title="Top Risk Signals"
          metric={topRecommendations[0]?.title ?? "Review concentration risk"}
          detail={`${topRecommendations.length} priority actions`}
          description="Action-oriented recommendations synthesized from telemetry."
          href="/recommendations"
          alert
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6">
        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-slate-200">Daily AI Consumption Trend</CardTitle>
              <CardDescription className="text-slate-400">Credit usage and overrun trend across the exported activity window.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={KIRO_DATA.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickFormatter={(value) => value.slice(5)} />
                  <YAxis stroke="#cbd5e1" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                  />
                  <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} dot={false} name="Consumption" />
                  <Line type="monotone" dataKey="overrun" stroke="#f59e0b" strokeWidth={2} dot={false} name="Overrun" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Spend Concentration</CardTitle>
                <CardDescription className="text-slate-400">Cost center-level view of where AI consumption is clustered.</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={treemapData} dataKey="size" aspectRatio={4 / 3} stroke="rgba(255,255,255,0.08)">
                    {treemapData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Client Type Mix by Cost Center</CardTitle>
                <CardDescription className="text-slate-400">IDE, CLI, and plugin balance across the organization.</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] border-t border-white/5 bg-[#0c1220]/50 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={KIRO_DATA.clientMixByCostCenter} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} width={110} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="ide" stackId="a" fill="#3b82f6" name="IDE" />
                    <Bar dataKey="cli" stackId="a" fill="#8b5cf6" name="CLI" />
                    <Bar dataKey="plugin" stackId="a" fill="#14b8a6" name="Plugin" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Top Cost Centers & Teams</CardTitle>
              <CardDescription className="text-slate-400">Best starting points for deeper ownership analysis.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                <RankedList
                  title="Cost Centers"
                  items={KIRO_DATA.costCenters.slice(0, 4).map((item) => ({
                    id: item.id,
                    label: item.name,
                    value: `${formatConsumption(item.totalConsumption)} credits`,
                    href: `/detail/cost-center/${item.id}`,
                  }))}
                />
                <RankedList
                  title="Teams"
                  items={KIRO_DATA.teams.slice(0, 4).map((item) => ({
                    id: item.id,
                    label: item.name,
                    value: `${formatConsumption(item.totalConsumption)} credits`,
                    href: `/detail/team/${item.id}`,
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#1a1646] to-[#111827] border-indigo-500/20 shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-indigo-300 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Next Recommended Move
              </CardTitle>
              <CardDescription className="text-slate-400">The fastest path from posture to governance action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-sm text-slate-200 leading-relaxed">
                  Start in Explorer, open <span className="font-medium text-white">{KIRO_DATA.costCenters[0]?.name}</span>, and follow the
                  top use-case path into the highest-cost engineer interactions. That route gives the strongest model-routing and prompt-discipline story.
                </p>
              </div>
              <Link href="/explorer">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                  <Compass className="w-4 h-4 mr-2" />
                  Open Guided Explorer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Recent Recommendations</CardTitle>
              <CardDescription className="text-slate-400">Evidence-backed actions synthesized from the current dataset.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 p-0">
              {topRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
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
                      <p className="font-medium text-slate-100">{recommendation.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{recommendation.scopeLabel}</p>
                    </div>
                    <Link href="/recommendations">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/10">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="text-lg font-medium text-slate-200">Advisor Runs & Status</CardTitle>
              <CardDescription className="text-slate-400">Most recent AI Advisor, simulation, and report activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {KIRO_DATA.runs.map((run) => (
                <div key={run.id} className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{run.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{run.scopeLabel}</p>
                    </div>
                    <Badge
                      className={
                        run.status === "Completed"
                          ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                          : run.status === "Running"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                      }
                    >
                      {run.status}
                    </Badge>
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

function KpiCard({
  label,
  value,
  hint,
  compact = false,
  tone = "text-white",
}: {
  label: string;
  value: string;
  hint: string;
  compact?: boolean;
  tone?: string;
}) {
  return (
    <Card className="bg-[#111827] border-white/5 shadow-lg">
      <CardContent className="pt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className={`mt-3 ${compact ? "text-xl" : "text-3xl"} font-semibold ${tone}`}>{value}</p>
        <p className="text-sm text-slate-500 mt-2">{hint}</p>
      </CardContent>
    </Card>
  );
}

function OverviewTile({
  title,
  metric,
  detail,
  description,
  href,
  alert = false,
}: {
  title: string;
  metric: string;
  detail: string;
  description: string;
  href: string;
  alert?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="bg-[#111827] border-white/5 shadow-lg hover:border-blue-500/20 hover:bg-[#131c2d] transition-colors cursor-pointer">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
              <p className="text-xl font-semibold text-white mt-3">{metric}</p>
              <p className={`text-sm mt-1 ${alert ? "text-amber-300" : "text-slate-300"}`}>{detail}</p>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">{description}</p>
            </div>
            {alert ? (
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RankedList({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; label: string; value: string; href: string }>;
}) {
  return (
    <div className="p-5">
      <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Link key={item.id} href={item.href}>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-300">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
