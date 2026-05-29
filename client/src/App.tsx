import { useState } from "react";
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
import PolicySimulationStudio from "@/pages/PolicySimulationStudio";
import ReportEvidenceConsole from "@/pages/ReportEvidenceConsole";
import Recommendations from "@/pages/Recommendations";
import LoginScreen from "@/pages/LoginScreen";

const STATIC_USERNAME = "admin";
const STATIC_PASSWORD = "lumpysoda11";
const AUTH_STORAGE_KEY = "kiro-governance-authenticated";

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof window !== "undefined" && window.sessionStorage.getItem(AUTH_STORAGE_KEY) === "true",
  );

  function handleLogin(username: string, password: string) {
    const isValid = username === STATIC_USERNAME && password === STATIC_PASSWORD;
    if (isValid) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
    }
    return isValid;
  }

  function handleLogout() {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <Switch>
        <Route path="/" component={GovernanceOverview} />
        <Route path="/explorer" component={UsageExplorer} />
        <Route path="/detail/:entityType/:entityId" component={DetailWorkspace} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/studio" component={PolicySimulationStudio} />
        <Route path="/reports" component={ReportEvidenceConsole} />
        <Route path="/findings">
          <Redirect to="/recommendations" />
        </Route>
        <Route path="/execution">
          <Redirect to="/recommendations" />
        </Route>
        <Route path="/analytics">
          <Redirect to="/explorer" />
        </Route>
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
