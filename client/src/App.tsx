import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";

import GovernanceOverview from "@/pages/GovernanceOverview";
import UsageExplorer from "@/pages/UsageExplorer";
import DetailWorkspace from "@/pages/DetailWorkspace";
import GovernanceFindings from "@/pages/GovernanceFindings";
import PolicySimulationStudio from "@/pages/PolicySimulationStudio";
import ExecutionMonitor from "@/pages/ExecutionMonitor";
import AnalyticsDeepDive from "@/pages/AnalyticsDeepDive";
import ReportEvidenceConsole from "@/pages/ReportEvidenceConsole";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={GovernanceOverview} />
        <Route path="/explorer" component={UsageExplorer} />
        <Route path="/detail/:entityType/:entityId" component={DetailWorkspace} />
        <Route path="/findings" component={GovernanceFindings} />
        <Route path="/studio" component={PolicySimulationStudio} />
        <Route path="/execution" component={ExecutionMonitor} />
        <Route path="/analytics" component={AnalyticsDeepDive} />
        <Route path="/reports" component={ReportEvidenceConsole} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
