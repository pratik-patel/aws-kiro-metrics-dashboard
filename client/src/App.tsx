import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import UnifiedPortfolio from "@/pages/UnifiedPortfolio";
import DataMigration from "@/pages/DataMigration";

function Router() {
  return (
    <Switch>
      <Route path="/unified-portfolio" component={UnifiedPortfolio} />
      <Route path="/data-migration" component={DataMigration} />
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
