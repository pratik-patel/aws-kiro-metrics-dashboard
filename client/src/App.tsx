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

function Router() {
  return (
    <Switch>
      <Route path="/unified-portfolio" component={UnifiedPortfolio} />
      <Route path="/private-credit" component={PrivateCreditDrillDown} />
      <Route path="/data-migration" component={DataMigration} />
      <Route path="/data-dictionary" component={DataDictionary} />
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
