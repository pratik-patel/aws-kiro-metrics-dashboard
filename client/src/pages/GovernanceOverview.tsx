import { useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, Compass, Sparkles, Users, X, Zap } from "lucide-react";
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

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatChartValue(value: number) {
  return `${value.toFixed(1).replace(".0", "")} credits`;
}

export default function GovernanceOverview() {
  const [isGovernanceBannerVisible, setIsGovernanceBannerVisible] = useState(true);
  const treemapData = KIRO_DATA.costCenters.map((costCenter, index) => ({
    name: costCenter.name,
    size: Number(costCenter.totalConsumption.toFixed(2)),
    fill: TREEMAP_COLORS[index % TREEMAP_COLORS.length],
  }));

  const topRecommendations = KIRO_DATA.recommendations.slice(0, 4);
  const highSeverityRecommendations = KIRO_DATA.recommendations.filter(
    (recommendation) => recommendation.severity === "High",
  );
  const { adoptedLicenses, idleThresholdDays, otherActiveAlerts, totalLicenses, unusedLicenses } =
    KIRO_DATA.licenseSummary;
  const hasUnusedLicenses = unusedLicenses > 0;
  const peakDailyConsumption = KIRO_DATA.dailyTrend.reduce(
    (currentPeak, entry) => (entry.consumption > currentPeak.consumption ? entry : currentPeak),
    KIRO_DATA.dailyTrend[0],
  );
  const peakDailyOverrun = KIRO_DATA.dailyTrend.reduce(
    (currentPeak, entry) => (entry.overrun > currentPeak.overrun ? entry : currentPeak),
    KIRO_DATA.dailyTrend[0],
  );

  return (
    <div className="p-8 max-w-[1720px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-5">
        <div>
          <h1 className="dashboard-page-title mb-2">Kiro AI Consumption Governance</h1>
          <p className="dashboard-page-lead">Enterprise visibility, accountability, and optimization for Kiro telemetry.</p>
          <p className="text-slate-500 text-sm mt-3 max-w-5xl leading-relaxed text-pretty">
            Start with current posture, then move straight into Cost Center ownership, use-case pressure, and the policy decisions most likely to reduce overrun and prompt bloat.
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

      {isGovernanceBannerVisible && (
        <Card
          className={
            hasUnusedLicenses
              ? "bg-amber-500/8 border-amber-500/18 shadow-lg"
              : "bg-blue-500/8 border-blue-500/18 shadow-lg"
          }
        >
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-4">
              <Link href="/recommendations">
                <div className="flex items-start gap-3 cursor-pointer">
                  <div
                    className={
                      hasUnusedLicenses
                        ? "mt-0.5 rounded-full bg-amber-500/12 p-2 text-amber-300"
                        : "mt-0.5 rounded-full bg-blue-500/12 p-2 text-blue-300"
                    }
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`dashboard-eyebrow ${hasUnusedLicenses ? "text-amber-300" : "text-blue-300"}`}>
                        {hasUnusedLicenses ? "Governance Warning" : "Governance Signal"}
                      </span>
                      <span className={`text-sm font-medium ${hasUnusedLicenses ? "text-amber-100" : "text-blue-100"}`}>
                        System Advice
                      </span>
                    </div>
                    <p className="dashboard-body text-slate-200">
                      {hasUnusedLicenses
                        ? `${unusedLicenses} current licenses have been idle for more than ${idleThresholdDays} days.`
                        : `${adoptedLicenses} / ${totalLicenses} active licenses show recent usage.`}
                      {otherActiveAlerts > 0 ? ` (+ ${otherActiveAlerts} other active alerts)` : ""}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-black/20 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsGovernanceBannerVisible(false)}
                >
                  <Check className="w-3.5 h-3.5 mr-2" />
                  Acknowledge
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-white/5"
                  onClick={() => setIsGovernanceBannerVisible(false)}
                  aria-label="Close governance signal"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start">
        <KpiCard
          label="Total AI Consumption"
          value={`${formatConsumption(KIRO_DATA.kpis.totalConsumption)} credits`}
          hint="Across exported Kiro activity"
          href="/explorer"
        />
        <KpiCard
          label="Overrun"
          value={`${formatConsumption(KIRO_DATA.kpis.overrun)} credits`}
          hint="Observed in current dataset"
          tone="amber"
          href="/recommendations"
        />
        <KpiCard
          label="Active License Adoption"
          value={`${adoptedLicenses} / ${totalLicenses}`}
          hint={`${unusedLicenses} currently unused licenses`}
          compact
          href="/recommendations"
        />
        <KpiCard
          label="Consumption / Engineer"
          value={`${formatConsumption(KIRO_DATA.kpis.consumptionPerEngineer)} credits`}
          hint="Average across active users"
          href="/explorer"
        />
        <KpiCard
          label="Priority Risks"
          value={String(highSeverityRecommendations.length)}
          hint="High-severity recommendations"
          compact
          href="/recommendations"
        />
        <KpiCard
          label="Recommended Actions"
          value={String(KIRO_DATA.recommendations.length)}
          hint="Evidence-backed actions in scope"
          compact
          href="/recommendations"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 items-start">
        <OverviewTile
          title="Top Cost Centers"
          metric={KIRO_DATA.kpis.topCostCenter}
          detail={`${formatConsumption(KIRO_DATA.costCenters[0]?.totalConsumption ?? 0)} credits`}
          description="Largest concentration of spend this period."
          href={`/detail/cost-center/${KIRO_DATA.costCenters[0]?.id ?? ""}`}
        />
        <OverviewTile
          title="Top Teams"
          metric={KIRO_DATA.kpis.topTeam}
          detail={`${formatConsumption(KIRO_DATA.teams[0]?.totalConsumption ?? 0)} credits`}
          description="Best drill point for ownership review."
          href={`/detail/team/${KIRO_DATA.teams[0]?.id ?? ""}`}
        />
        <OverviewTile
          title="Top Use Cases"
          metric={KIRO_DATA.kpis.topUseCase}
          detail={`${formatConsumption(KIRO_DATA.useCases[0]?.totalConsumption ?? 0)} credits`}
          description="Primary optimization hotspot for routing and prompt discipline."
          href="/explorer"
        />
        <OverviewTile
          title="Top Risk Signals"
          metric={topRecommendations[0]?.title ?? "Review concentration risk"}
          detail={`${topRecommendations.length} priority actions`}
          description="Priority actions synthesized from telemetry."
          href="/recommendations"
          alert
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6">
        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="dashboard-card-title text-slate-200">Daily AI Consumption Trend</CardTitle>
                <CardDescription className="text-slate-400">Credit usage and overrun trend across the exported activity window.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-200 border-blue-500/20">
                  Peak consumption: {formatConsumption(peakDailyConsumption.consumption)} on {formatChartDate(peakDailyConsumption.date)}
                </Badge>
                <Badge className="bg-amber-500/10 text-amber-200 border-amber-500/20">
                  Peak overrun: {formatConsumption(peakDailyOverrun.overrun)} on {formatChartDate(peakDailyOverrun.date)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="h-[360px] border-t border-white/5 bg-[#0c1220]/50 pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={KIRO_DATA.dailyTrend} margin={{ top: 12, right: 18, left: 4, bottom: 34 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "12px", fontSize: "12px", color: "#94a3b8" }}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={formatChartDate}
                    angle={-35}
                    textAnchor="end"
                    height={58}
                    tickMargin={10}
                    minTickGap={14}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(value) => formatConsumption(Number(value))}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelFormatter={(value) => formatChartDate(String(value))}
                    formatter={(value: number, name: string) => [formatChartValue(Number(value)), name === "Consumption" ? "Consumption" : "Overrun"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 7, fill: "#3b82f6", stroke: "#e2e8f0", strokeWidth: 2 }}
                    name="Consumption"
                  />
                  <Line
                    type="monotone"
                    dataKey="overrun"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 7, fill: "#f59e0b", stroke: "#f8fafc", strokeWidth: 2 }}
                    name="Overrun"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <Card className="bg-[#111827] border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="dashboard-card-title text-slate-200">Spend Concentration</CardTitle>
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
                <CardTitle className="dashboard-card-title text-slate-200">Client Type Mix by Cost Center</CardTitle>
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
              <CardTitle className="dashboard-card-title text-slate-200">Top Cost Centers & Teams</CardTitle>
              <CardDescription className="text-slate-400">Best starting points for deeper ownership analysis.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 items-start">
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
              <CardTitle className="dashboard-card-title text-indigo-300 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Next Recommended Move
              </CardTitle>
              <CardDescription className="text-slate-400">The fastest path from posture to governance action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-sm text-slate-200 leading-relaxed text-pretty">
                  Start in Explorer, open <span className="font-medium text-white">{KIRO_DATA.costCenters[0]?.name}</span>, then follow the top use-case path into the highest-cost engineer interactions for the clearest model-routing and prompt-discipline story.
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
              <CardTitle className="dashboard-card-title text-slate-200">Recent Recommendations</CardTitle>
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
              <CardTitle className="dashboard-card-title text-slate-200">Advisor Runs & Status</CardTitle>
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
  href,
}: {
  label: string;
  value: string;
  hint: string;
  compact?: boolean;
  tone?: string;
  href?: string;
}) {
  const card = (
    <Card className="bg-[#111827] border-white/5 shadow-lg transition-colors hover:bg-[#131c2d] hover:border-blue-500/18">
      <CardContent className="pt-5 pb-5">
        <p className="dashboard-eyebrow">{label}</p>
        <p
          className={`mt-3 ${compact ? "text-[1.08rem] md:text-[1.2rem]" : "text-[1.28rem] md:text-[1.42rem]"} leading-[1.16] font-semibold text-balance md:whitespace-nowrap ${tone}`}
        >
          {value}
        </p>
        <p className="dashboard-muted-body mt-2">{hint}</p>
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return <Link href={href}>{card}</Link>;
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
  const metricClassName = alert
    ? "text-[0.98rem] md:text-[1.08rem] leading-[1.24]"
    : "text-[1.08rem] md:text-[1.2rem] leading-[1.2]";

  return (
    <Link href={href}>
      <Card className="bg-[#111827] border-white/5 shadow-lg hover:border-blue-500/20 hover:bg-[#131c2d] transition-colors cursor-pointer">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <p className="dashboard-eyebrow">{title}</p>
              <p className={`${metricClassName} font-semibold text-white mt-3 text-balance`}>
                {metric}
              </p>
              <p className={`dashboard-body mt-1 ${alert ? "text-amber-300" : "text-slate-300"}`}>{detail}</p>
              <p className="dashboard-muted-body mt-2 text-pretty">{description}</p>
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
