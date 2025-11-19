import { ChartConfig } from "@/components/ui/chart";

// 📁 portfolio_allocation.json
export const portfolioAllocation = {
  "as_of": "2025-01-31",
  "total_value": 2500000000,
  "allocation": [
    { "asset_class": "Public Equities", "weight": 45, "fill": "var(--color-chart-1)", "isInteractive": true },
    { "asset_class": "Fixed Income", "weight": 30, "fill": "var(--color-chart-2)", "isInteractive": true },
    { "asset_class": "Private Equity", "weight": 20, "fill": "var(--color-chart-3)", "isInteractive": true },
    { "asset_class": "Private Credit", "weight": 5, "fill": "var(--color-chart-4)", "isInteractive": true }
  ]
};

// 📁 private_credit_metrics.json
export const privateCreditMetrics = {
  "nav_movement_monthly": [
    { "month": "2024-02", "nav": 120 },
    { "month": "2024-03", "nav": 122 },
    { "month": "2024-04", "nav": 125 },
    { "month": "2024-05", "nav": 130 },
    { "month": "2024-06", "nav": 131 },
    { "month": "2024-07", "nav": 133 },
    { "month": "2024-08", "nav": 135 },
    { "month": "2024-09", "nav": 138 },
    { "month": "2024-10", "nav": 140 },
    { "month": "2024-11", "nav": 142 },
    { "month": "2024-12", "nav": 145 },
    { "month": "2025-01", "nav": 148 }
  ],
  "capital_breakdown": {
    "drawn": 80000000,
    "undrawn": 20000000
  },
  "vintage_year_mix": [
    { "vintage": 2015, "percent": 10 },
    { "vintage": 2017, "percent": 25 },
    { "vintage": 2019, "percent": 40 },
    { "vintage": 2021, "percent": 25 }
  ]
};

export const privateCreditFunds = [
  { name: "North America Direct Lending IV", vintage: 2019, commitment: 45000000, nav: 42000000, irr: 11.2 },
  { name: "European Senior Debt II", vintage: 2021, commitment: 25000000, nav: 12000000, irr: 9.8 },
  { name: "Asia Pacific Special Situations", vintage: 2017, commitment: 15000000, nav: 18500000, irr: 14.5 },
  { name: "Global Mezzanine Fund VI", vintage: 2015, commitment: 15000000, nav: 7500000, irr: 10.1 },
];

export const cashFlowWaterfall = [
  { category: "Commitment", value: 100, type: "total" },
  { category: "Called", value: -80, type: "negative" },
  { category: "Fees", value: -5, type: "negative" },
  { category: "Distributions", value: 15, type: "positive" },
  { category: "Appreciation", value: 25, type: "positive" },
  { category: "Ending NAV", value: 55, type: "total" },
];

// NEW: Public Equities Metrics
export const publicEquitiesMetrics = {
  performance_monthly: [
    { month: "2024-02", value: 100 },
    { month: "2024-03", value: 103 },
    { month: "2024-04", value: 101 },
    { month: "2024-05", value: 105 },
    { month: "2024-06", value: 108 },
    { month: "2024-07", value: 110 },
    { month: "2024-08", value: 109 },
    { month: "2024-09", value: 112 },
    { month: "2024-10", value: 115 },
    { month: "2024-11", value: 118 },
    { month: "2024-12", value: 120 },
    { month: "2025-01", value: 122 }
  ],
  sector_allocation: [
    { name: "Technology", value: 35 },
    { name: "Healthcare", value: 15 },
    { name: "Financials", value: 20 },
    { name: "Consumer", value: 10 },
    { name: "Energy", value: 5 },
    { name: "Others", value: 15 }
  ],
  top_holdings: [
    { symbol: "AAPL", name: "Apple Inc.", weight: 5.2, return: 12.4 },
    { symbol: "MSFT", name: "Microsoft Corp.", weight: 4.8, return: 10.1 },
    { symbol: "AMZN", name: "Amazon.com Inc.", weight: 3.5, return: 8.5 },
    { symbol: "NVDA", name: "NVIDIA Corp.", weight: 3.1, return: 25.4 },
    { symbol: "GOOGL", name: "Alphabet Inc.", weight: 2.9, return: 9.2 },
  ]
};

// NEW: Fixed Income Metrics
export const fixedIncomeMetrics = {
  yield_curve: [
    { tenor: "1M", yield: 5.3 },
    { tenor: "3M", yield: 5.25 },
    { tenor: "6M", yield: 5.1 },
    { tenor: "1Y", yield: 4.8 },
    { tenor: "2Y", yield: 4.2 },
    { tenor: "5Y", yield: 3.9 },
    { tenor: "10Y", yield: 4.0 },
    { tenor: "30Y", yield: 4.3 }
  ],
  credit_quality: [
    { rating: "AAA", percent: 40 },
    { rating: "AA", percent: 25 },
    { rating: "A", percent: 20 },
    { rating: "BBB", percent: 10 },
    { rating: "HY", percent: 5 }
  ],
  duration_stats: {
    avg_duration: 6.4,
    yield_to_maturity: 4.85,
    convexity: 0.45
  }
};

// NEW: Private Equity Metrics
export const privateEquityMetrics = {
  nav_growth: [
    { year: "2020", value: 100 },
    { year: "2021", value: 125 },
    { year: "2022", value: 140 },
    { year: "2023", value: 155 },
    { year: "2024", value: 180 }
  ],
  strategy_mix: [
    { strategy: "Buyout", value: 50 },
    { strategy: "Growth", value: 30 },
    { strategy: "Venture", value: 15 },
    { strategy: "Distressed", value: 5 }
  ],
  top_funds: [
    { name: "Blackstone Capital Partners VIII", vintage: 2019, irr: 18.5, multiple: 1.6 },
    { name: "KKR North America XIII", vintage: 2020, irr: 16.2, multiple: 1.4 },
    { name: "Thoma Bravo Fund XV", vintage: 2021, irr: 22.1, multiple: 1.3 },
    { name: "Sequoia Global Growth III", vintage: 2018, irr: 25.4, multiple: 2.1 }
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
