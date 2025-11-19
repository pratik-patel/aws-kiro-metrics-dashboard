import { ChartConfig } from "@/components/ui/chart";

// 📁 portfolio_allocation.json
export const portfolioAllocation = {
  "as_of": "2025-01-31",
  "total_value": 2500000000,
  "allocation": [
    { "asset_class": "Public Equities", "weight": 45, "fill": "var(--color-chart-1)" },
    { "asset_class": "Fixed Income", "weight": 30, "fill": "var(--color-chart-2)" },
    { "asset_class": "Private Equity", "weight": 15, "fill": "var(--color-chart-3)" },
    { "asset_class": "Private Credit", "weight": 10, "fill": "var(--color-chart-4)", "isInteractive": true }
  ]
};

// 📁 private_credit_metrics.json
export const privateCreditMetrics = {
  "nav_movement_monthly": [
    { "month": "2024-02", "nav": 210 },
    { "month": "2024-03", "nav": 212 },
    { "month": "2024-04", "nav": 215 },
    { "month": "2024-05", "nav": 218 },
    { "month": "2024-06", "nav": 220 },
    { "month": "2024-07", "nav": 223 },
    { "month": "2024-08", "nav": 226 },
    { "month": "2024-09", "nav": 229 },
    { "month": "2024-10", "nav": 231 },
    { "month": "2024-11", "nav": 234 },
    { "month": "2024-12", "nav": 238 },
    { "month": "2025-01", "nav": 241 }
  ],
  "capital_breakdown": {
    "drawn": 180000000,
    "undrawn": 70000000
  },
  "vintage_year_mix": [
    { "vintage": 2018, "percent": 25 },
    { "vintage": 2019, "percent": 20 },
    { "vintage": 2020, "percent": 30 },
    { "vintage": 2021, "percent": 25 }
  ]
};

// 📁 public_market_ticks.json
export const publicMarketTicks = {
  "timestamp": "2025-01-31T12:00:00Z",
  "tickers": [
    { "symbol": "AAPL", "price": 195.23, "change": 0.12 },
    { "symbol": "MSFT", "price": 412.10, "change": -0.05 },
    { "symbol": "TSLA", "price": 258.40, "change": 0.88 }
  ],
  "bond_yields": [
    { "tenor": "2Y", "yield": 3.88 },
    { "tenor": "10Y", "yield": 4.21 },
    { "tenor": "30Y", "yield": 4.33 }
  ]
};

// 📁 legacy_report.json
export const legacyReport = {
  "data_status": "Delayed (T+2)",
  "load_time_seconds": 5,
  "trades": [
    {
      "trade_id": "T-1001",
      "asset": "AAPL",
      "quantity": 1200,
      "status": "Pending",
      "settlement_date": "2025-01-27" 
    },
    {
      "trade_id": "T-1002",
      "asset": "MSFT",
      "quantity": 800,
      "status": "Mismatch",
      "settlement_date": "2025-01-26"
    },
    {
      "trade_id": "T-1003",
      "asset": "TSLA",
      "quantity": 150,
      "status": "Pending",
      "settlement_date": "2025-01-28"
    }
  ]
};

// 📁 modern_report.json
export const modernReport = {
  "data_status": "Live",
  "latency_ms": 420,
  "heatmap_summary": {
    "clean": 12,
    "pending": 2,
    "exceptions": 1
  },
  "trades": [
    {
      "trade_id": "T-1001",
      "asset": "AAPL",
      "quantity": 1200,
      "status": "Settled",
      "settlement_date": "2025-01-31"
    },
    {
      "trade_id": "T-1002",
      "asset": "MSFT",
      "quantity": 800,
      "status": "Settled",
      "settlement_date": "2025-01-31"
    },
    {
      "trade_id": "T-1003",
      "asset": "TSLA",
      "quantity": 150,
      "status": "Pending",
      "settlement_date": "2025-01-31"
    },
    {
       "trade_id": "T-1004",
       "asset": "NVDA",
       "quantity": 500,
       "status": "Settled",
       "settlement_date": "2025-01-31"
    },
    {
       "trade_id": "T-1005",
       "asset": "GOOGL",
       "quantity": 1000,
       "status": "Settled",
       "settlement_date": "2025-01-31"
    }
  ]
};

export const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
