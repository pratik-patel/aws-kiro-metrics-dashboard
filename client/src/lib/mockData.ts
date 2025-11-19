import { ChartConfig } from "@/components/ui/chart";

// Use Case 1: Unified Portfolio Data

export const portfolioAllocationData = [
  { name: "Public Equities", value: 45, fill: "var(--color-chart-1)" },
  { name: "Fixed Income", value: 30, fill: "var(--color-chart-2)" },
  { name: "Private Equity", value: 15, fill: "var(--color-chart-3)" },
  { name: "Private Credit", value: 10, fill: "var(--color-chart-4)", isInteractive: true },
];

export const privateCreditMetrics = {
  navMovement: [
    { month: "Jan", value: 240 },
    { month: "Feb", value: 242 },
    { month: "Mar", value: 245 },
    { month: "Apr", value: 244 },
    { month: "May", value: 248 },
    { month: "Jun", value: 252 },
    { month: "Jul", value: 255 },
    { month: "Aug", value: 258 },
    { month: "Sep", value: 260 },
    { month: "Oct", value: 262 },
    { month: "Nov", value: 265 },
    { month: "Dec", value: 270 },
  ],
  capitalBreakdown: {
    drawn: 180,
    undrawn: 70,
  },
  vintageYearMix: [
    { year: "2018", percentage: 25 },
    { year: "2019", percentage: 20 },
    { year: "2020", percentage: 30 },
    { year: "2021", percentage: 25 },
  ]
};

export const initialPublicTicks = [
  { symbol: "SPX", price: 4120.50, change: 0.45 },
  { symbol: "NDX", price: 13400.20, change: 0.82 },
  { symbol: "VIX", price: 18.50, change: -2.10 },
  { symbol: "US10Y", price: 3.45, change: 0.05 },
  { symbol: "AAPL", price: 172.40, change: 1.20 },
  { symbol: "MSFT", price: 308.10, change: 0.95 },
];

// Use Case 2: Data Migration Data

export type TradeRecord = {
  id: string;
  asset: string;
  quantity: number;
  status: "Settled" | "Pending" | "Failed" | "Mismatch";
  date: string;
  latency: string;
};

export const legacyData: TradeRecord[] = [
  { id: "TRD-9921", asset: "US Treasury 10Y", quantity: 500000, status: "Pending", date: "T+2", latency: "Delayed" },
  { id: "TRD-9922", asset: "Corp Bond AAPL", quantity: 12000, status: "Mismatch", date: "T+1", latency: "Unknown" },
  { id: "TRD-9923", asset: "Muni Bond NY", quantity: 250000, status: "Settled", date: "T+3", latency: "Delayed" },
  { id: "TRD-9924", asset: "ABS Auto Loan", quantity: 1000000, status: "Failed", date: "T+2", latency: "Error" },
  { id: "TRD-9925", asset: "High Yield ETF", quantity: 5000, status: "Pending", date: "T+2", latency: "Delayed" },
];

export const modernData: TradeRecord[] = [
  { id: "TRD-9921", asset: "US Treasury 10Y", quantity: 500000, status: "Settled", date: "Real-time", latency: "<50ms" },
  { id: "TRD-9922", asset: "Corp Bond AAPL", quantity: 12000, status: "Settled", date: "Real-time", latency: "<45ms" },
  { id: "TRD-9923", asset: "Muni Bond NY", quantity: 250000, status: "Settled", date: "Real-time", latency: "<60ms" },
  { id: "TRD-9924", asset: "ABS Auto Loan", quantity: 1000000, status: "Settled", date: "Real-time", latency: "<55ms" },
  { id: "TRD-9925", asset: "High Yield ETF", quantity: 5000, status: "Settled", date: "Real-time", latency: "<40ms" },
];

export const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
