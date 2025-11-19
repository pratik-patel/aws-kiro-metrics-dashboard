import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import UnifiedPortfolio from "@/pages/UnifiedPortfolio";
import DataMigration from "@/pages/DataMigration";
import PrivateCreditDrillDown from "@/pages/PrivateCreditDrillDown";
import DataDictionary from "@/pages/DataDictionary";
import Analytics from "@/pages/Analytics";
import ReportingCompliance from "@/pages/ReportingCompliance";

// New Migration Module Pages
import MigrationWorkspace from "@/pages/migration/MigrationWorkspace";
import MigrationDesigner from "@/pages/migration/MigrationDesigner";
import MigrationExecution from "@/pages/migration/MigrationExecution";
import ValidationConsole from "@/pages/migration/ValidationConsole";
import DataLineage from "@/pages/migration/DataLineage";
import MigrationSummary from "@/pages/migration/MigrationSummary";

function Router() {
  return (
    <Switch>
      {/* Investment Office Context */}
      <Route path="/unified-portfolio" component={UnifiedPortfolio} />
      <Route path="/private-credit" component={PrivateCreditDrillDown} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/reporting-compliance" component={ReportingCompliance} />
      
      {/* Shared / Demo */}
      <Route path="/data-migration" component={DataMigration} />
      <Route path="/data-dictionary" component={DataDictionary} />
      
      {/* Data Operations Context (Migration Module) */}
      <Route path="/migration-workspace" component={MigrationWorkspace} />
      <Route path="/migration-designer" component={MigrationDesigner} />
      <Route path="/migration-execution" component={MigrationExecution} />
      <Route path="/migration-validation" component={ValidationConsole} />
      <Route path="/migration-lineage" component={DataLineage} />
      <Route path="/migration-summary" component={MigrationSummary} />

      <Route path="/">
        <Redirect to="/unified-portfolio" />
      </Route>
      <Route component={NotFound} />
    </Switch>
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
