
// 📁 compliance_reporting.json
export const complianceRules = [
  { id: "R-101", name: "Global Equity Concentration", limit: "Max 60%", current: "45%", status: "Pass", category: "Allocation" },
  { id: "R-102", name: "Single Issuer Limit", limit: "Max 5%", current: "5.2% (AAPL)", status: "Fail", category: "Risk" },
  { id: "R-103", name: "Liquidity Coverage Ratio", limit: "Min 110%", current: "145%", status: "Pass", category: "Liquidity" },
  { id: "R-104", name: "ESG Exclusion List", limit: "0 Violations", current: "0 Violations", status: "Pass", category: "ESG" },
  { id: "R-105", name: "Private Markets Cap", limit: "Max 30%", current: "25%", status: "Pass", category: "Allocation" },
  { id: "R-106", name: "Currency Hedging (EUR)", limit: "Min 50%", current: "48%", status: "Warning", category: "Risk" },
];

export const reportsList = [
  { id: "REP-001", name: "Monthly CIO Pack", type: "PDF", date: "2025-01-31", size: "4.2 MB", status: "Ready" },
  { id: "REP-002", name: "Quarterly Investor Letter", type: "PDF", date: "2024-12-31", size: "12.5 MB", status: "Ready" },
  { id: "REP-003", name: "Risk Exposure Daily", type: "CSV", date: "2025-02-19", size: "850 KB", status: "Ready" },
  { id: "REP-004", name: "Regulatory Filing (Form PF)", type: "XML", date: "2024-12-31", size: "1.1 MB", status: "Pending Review" },
  { id: "REP-005", name: "Private Fund Audit", type: "PDF", date: "2024-12-31", size: "8.9 MB", status: "Ready" },
];

export const complianceHistory = [
  { date: "Jan 15", violations: 2 },
  { date: "Jan 22", violations: 1 },
  { date: "Jan 29", violations: 0 },
  { date: "Feb 05", violations: 0 },
  { date: "Feb 12", violations: 1 },
  { date: "Feb 19", violations: 1 },
];
