import { useState } from "react";
import { AlertTriangle, ArrowUpRight, Check, Compass, Sparkles, X, Zap } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KIRO_DATA, formatConsumption } from "@/lib/kiro-data";

const TREEMAP_COLORS = ["#1D4ED8", "#4F46E5", "#0F766E", "#0369A1", "#7C3AED", "#2563EB"];

type OverviewMetricCard = {
  label: string;
  value: string;
  hint: string;
  href: string;
  tone?: "default" | "amber";
};

type OverviewSummaryChip = {
  label: string;
  value: string;
  href?: string;
};

type OverviewInsight = {
  title: string;
  metric: string;
  detail: string;
  href: string;
  emphasis?: "default" | "alert";
};

const OVERVIEW_AI_DELIVERY_TEAM_SPLITS = [
  { name: "AI SDLC Enablement Team", credits: 8300 },
  { name: "Backend API Team", credits: 4700 },
  { name: "Frontend Web Team", credits: 3100 },
  { name: "QA & Automation Team", credits: 2100 },
] as const;

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
  const leadRecommendation = topRecommendations[0];
  const supportingRecommendations = topRecommendations.slice(1, 4);
  const aiDeliveryCostCenterId = KIRO_DATA.costCenters[0]?.id ?? "CC-4402";
  const aiDeliveryCostCenterName = KIRO_DATA.costCenters[0]?.name ?? "AI Delivery Acceleration";
  const aiDeliveryTeamSplits = OVERVIEW_AI_DELIVERY_TEAM_SPLITS.map((team) => ({
    ...team,
    href: `/detail/cost-center/${aiDeliveryCostCenterId}`,
  }));
  const aiDeliveryCostCenterCredits = aiDeliveryTeamSplits.reduce((sum, team) => sum + team.credits, 0);

  const peakDailyConsumption = KIRO_DATA.dailyTrend.reduce(
    (currentPeak, entry) => (entry.consumption > currentPeak.consumption ? entry : currentPeak),
    KIRO_DATA.dailyTrend[0],
  );
  const peakDailyOverrun = KIRO_DATA.dailyTrend.reduce(
    (currentPeak, entry) => (entry.overrun > currentPeak.overrun ? entry : currentPeak),
    KIRO_DATA.dailyTrend[0],
  );

  const executiveKpis: OverviewMetricCard[] = [
    {
      label: "Total AI Consumption",
      value: `${formatConsumption(KIRO_DATA.kpis.totalConsumption)} credits`,
      hint: "Enterprise credits",
      href: "/explorer",
    },
    {
      label: "Overrun",
      value: `${formatConsumption(KIRO_DATA.kpis.overrun)} credits`,
      hint: "Current overage",
      href: "/recommendations",
      tone: "amber",
    },
    {
      label: "Active License Adoption",
      value: `${adoptedLicenses} / ${totalLicenses}`,
      hint: `${unusedLicenses} idle licenses`,
      href: "/recommendations",
    },
    {
      label: "Priority Risks",
      value: String(highSeverityRecommendations.length),
      hint: "High-severity findings",
      href: "/recommendations",
    },
  ];

  const secondarySummary: OverviewSummaryChip[] = [
    {
      label: "Active Engineers",
      value: String(KIRO_DATA.kpis.activeEngineers),
      href: "/explorer",
    },
    {
      label: "Consumption / Engineer",
      value: `${formatConsumption(KIRO_DATA.kpis.consumptionPerEngineer)} credits`,
      href: "/explorer",
    },
    {
      label: "Other Active Alerts",
      value: String(otherActiveAlerts),
      href: "/recommendations",
    },
    {
      label: "Advisor Runs",
      value: String(KIRO_DATA.runs.length),
      href: "/reports",
    },
  ];

  const insightCards: OverviewInsight[] = [
    {
      title: "Top Cost Center",
      metric: aiDeliveryCostCenterName,
      detail: `${formatConsumption(aiDeliveryCostCenterCredits)} credits`,
      href: `/detail/cost-center/${aiDeliveryCostCenterId}`,
    },
    {
      title: "Lead Team in Cost Center",
      metric: aiDeliveryTeamSplits[0]?.name ?? "AI SDLC Enablement Team",
      detail: `${formatConsumption(aiDeliveryTeamSplits[0]?.credits ?? 0)} credits`,
      href: `/detail/cost-center/${aiDeliveryCostCenterId}`,
    },
    {
      title: "Top Use Case",
      metric: KIRO_DATA.kpis.topUseCase,
      detail: `${formatConsumption(KIRO_DATA.useCases[0]?.totalConsumption ?? 0)} credits`,
      href: "/explorer",
    },
    {
      title: "Top Risk Signal",
      metric: leadRecommendation?.title ?? "Review concentration risk",
      detail: `${topRecommendations.length} priority actions`,
      href: "/recommendations",
      emphasis: "alert",
    },
  ];

  return (
    <div className="p-8 max-w-[1680px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="rounded-[28px] border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(7,12,24,0.98))] px-7 py-7 shadow-[0_24px_70px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="dashboard-page-title mb-2">Kiro AI Consumption Governance</h1>
              <p className="dashboard-page-lead max-w-4xl">
                Executive posture for Kiro consumption, license efficiency, and the next actions most likely to reduce
                overrun.
              </p>
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {executiveKpis.map((item) => (
          <KpiCard key={item.label} label={item.label} value={item.value} hint={item.hint} href={item.href} tone={item.tone} />
        ))}
      </div>

      <div className="rounded-2xl border border-white/6 bg-[#0d1526] px-4 py-3">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {secondarySummary.map((item) => (
            <SummaryChip key={item.label} label={item.label} value={item.value} href={item.href} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="dashboard-eyebrow">Drill-Down Insights</p>
            <h2 className="dashboard-section-title mt-1">Ownership, spend, and action hotspots</h2>
          </div>
          <Link href="/explorer">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
              Open Explorer
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 items-start">
          {insightCards.map((item) => (
            <OverviewTile
              key={item.title}
              title={item.title}
              metric={item.metric}
              detail={item.detail}
              href={item.href}
              emphasis={item.emphasis}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.28fr_0.92fr] gap-6 items-start">
        <div className="space-y-6">
          <Card className="bg-[#111827] border-white/5 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle className="dashboard-card-title text-slate-200">Daily AI Consumption Trend</CardTitle>
                <CardDescription className="text-slate-400">
                  Trendline for usage and overrun across the exported activity window.
                </CardDescription>
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
                    formatter={(value: number, name: string) => [
                      formatChartValue(Number(value)),
                      name === "Consumption" ? "Consumption" : "Overrun",
                    ]}
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
                <CardDescription className="text-slate-400">Where enterprise consumption is clustered.</CardDescription>
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
                <CardDescription className="text-slate-400">IDE, CLI, and plugin balance by cost center.</CardDescription>
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
              <CardTitle className="dashboard-card-title text-slate-200">Next Ownership Queues</CardTitle>
              <CardDescription className="text-slate-400">Follow-on cost centers and representative AI Delivery teams.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 items-start">
                <RankedList
                  title="Cost Centers"
                  items={KIRO_DATA.costCenters.slice(1, 4).map((item) => ({
                    id: item.id,
                    label: item.name,
                    value: `${formatConsumption(item.totalConsumption)} credits`,
                    href: `/detail/cost-center/${item.id}`,
                  }))}
                />
                <RankedList
                  title="AI Delivery Teams"
                  items={aiDeliveryTeamSplits.map((item) => ({
                    id: item.name,
                    label: item.name,
                    value: `${formatConsumption(item.credits)} credits`,
                    href: item.href,
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#1a1646] via-[#141c33] to-[#0b1222] border-indigo-500/20 shadow-[0_20px_60px_rgba(30,41,59,0.45)] overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="dashboard-card-title text-indigo-200 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Executive Brief
              </CardTitle>
              <CardDescription className="text-slate-400">The clearest story from posture to action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-indigo-400/15 bg-black/20 p-4">
                <p className="dashboard-eyebrow text-indigo-200">Top Recommendation</p>
                <p className="mt-2 text-lg font-semibold leading-tight text-white text-balance">
                  {leadRecommendation?.title ?? "Review concentration risk"}
                </p>
                <p className="dashboard-muted-body mt-3 text-pretty">
                  {leadRecommendation?.expectedImpact ?? "Use the top drill paths to reduce overrun and improve governance posture."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <BriefSignal
                  label="Recommendation Type"
                  value={leadRecommendation?.type ?? "Governance review"}
                  note={leadRecommendation?.scopeLabel ?? "Enterprise"}
                />
                <BriefSignal
                  label="Expected Impact"
                  value={leadRecommendation?.expectedImpact ?? "Reduce overrun and tighten policy-controlled workflows."}
                  note="Modeled from current telemetry and usage patterns"
                />
              </div>
              <div className="rounded-2xl border border-white/6 bg-black/20 p-4">
                <p className="dashboard-eyebrow mb-2">Next Move</p>
                <p className="dashboard-body text-slate-100 text-pretty">
                  Open <span className="font-medium text-white">{aiDeliveryCostCenterName}</span> in Explorer, then follow the
                  top use case into the highest-cost engineer interactions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/explorer">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40">
                    <Compass className="w-4 h-4 mr-2" />
                    Open Guided Explorer
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/5 hover:text-white">
                    Review Recommendations
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-white/5 shadow-lg">
            <CardHeader className="bg-black/20 border-b border-white/5">
              <CardTitle className="dashboard-card-title text-slate-200">Supporting Actions</CardTitle>
              <CardDescription className="text-slate-400">Related high-priority actions beyond the lead recommendation.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 p-0">
              {supportingRecommendations.map((recommendation) => (
                <Link key={recommendation.id} href="/recommendations">
                  <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
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
                        <p className="dashboard-item-title text-balance">{recommendation.title}</p>
                        <p className="dashboard-muted-body mt-1">{recommendation.scopeLabel}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>
                  </div>
                </Link>
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
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
  tone?: "default" | "amber";
}) {
  return (
    <Link href={href}>
      <Card className="border-white/6 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(10,15,28,0.98))] shadow-lg transition-colors hover:bg-[#131c2d] hover:border-blue-500/18 cursor-pointer">
        <CardContent className="pt-5 pb-5">
          <p className="dashboard-eyebrow">{label}</p>
          <p
            className={`mt-3 text-[1.52rem] md:text-[1.74rem] leading-[1.05] font-semibold text-balance ${
              tone === "amber" ? "text-amber-200" : "text-white"
            }`}
          >
            {value}
          </p>
          <p className="dashboard-muted-body mt-3">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function SummaryChip({ label, value, href }: OverviewSummaryChip) {
  const content = (
    <div className="rounded-xl border border-white/6 bg-black/20 px-4 py-3 min-h-[76px] transition-colors hover:border-white/10 hover:bg-white/[0.03]">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-sm md:text-[0.98rem] font-semibold leading-snug text-slate-100 text-balance">{value}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

function OverviewTile({
  title,
  metric,
  detail,
  href,
  emphasis = "default",
}: {
  title: string;
  metric: string;
  detail: string;
  href: string;
  emphasis?: "default" | "alert";
}) {
  return (
    <Link href={href}>
      <Card
        className={`shadow-lg transition-colors cursor-pointer ${
          emphasis === "alert"
            ? "border-amber-500/18 bg-[linear-gradient(180deg,rgba(32,22,8,0.55),rgba(17,24,39,0.98))] hover:border-amber-500/30 hover:bg-[linear-gradient(180deg,rgba(55,35,8,0.62),rgba(17,24,39,0.98))]"
            : "border-white/5 bg-[#111827] hover:border-blue-500/20 hover:bg-[#131c2d]"
        }`}
      >
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <p className={`dashboard-eyebrow ${emphasis === "alert" ? "text-amber-200" : ""}`}>{title}</p>
              <p className="mt-3 text-[1.14rem] md:text-[1.26rem] font-semibold leading-[1.16] text-white text-balance">{metric}</p>
              <p className={`mt-2 text-sm font-medium ${emphasis === "alert" ? "text-amber-200" : "text-slate-300"}`}>{detail}</p>
            </div>
            {emphasis === "alert" ? (
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

function BriefSignal({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/6 bg-black/20 px-4 py-3">
      <p className="dashboard-eyebrow">{label}</p>
      <p className="mt-2 text-base font-semibold text-white leading-tight text-balance">{value}</p>
      <p className="dashboard-muted-body mt-1">{note}</p>
    </div>
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
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-300 shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 text-balance">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
