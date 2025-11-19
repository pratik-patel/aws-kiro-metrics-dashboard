import * as React from "react";
import Layout from "@/components/Layout";
import { PortfolioAllocation } from "@/components/unified/PortfolioAllocation";
import { PrivateCreditPanel } from "@/components/unified/PrivateCreditPanel";
import { PublicEquitiesPanel } from "@/components/unified/PublicEquitiesPanel";
import { FixedIncomePanel } from "@/components/unified/FixedIncomePanel";
import { PrivateEquityPanel } from "@/components/unified/PrivateEquityPanel";
import { SimulationPanel } from "@/components/unified/SimulationPanel";
import { PublicMarketsStrip } from "@/components/unified/PublicMarketsStrip";
import { AnimatePresence, motion } from "framer-motion";

export default function UnifiedPortfolio() {
  const [selectedSegment, setSelectedSegment] = React.useState<string | null>("Private Credit");

  const renderPanel = () => {
    switch (selectedSegment) {
      case "Private Credit":
        return <PrivateCreditPanel key="pc-panel" />;
      case "Public Equities":
        return <PublicEquitiesPanel key="pe-panel" />;
      case "Fixed Income":
        return <FixedIncomePanel key="fi-panel" />;
      case "Private Equity":
        return <PrivateEquityPanel key="peq-panel" />;
      default:
        return (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-card/20"
          >
            <div className="text-center text-muted-foreground">
              <p>Select an asset class to view detailed metrics</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
              Unified Allocation View
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Holistic cross-asset portfolio management combining public markets and alternative investments.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border/50 px-3 py-1 rounded-full bg-card/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Real-time Pricing Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Allocation Chart */}
          <div className="lg:col-span-4 xl:col-span-3 h-[400px] lg:h-auto">
            <PortfolioAllocation 
              selectedSegment={selectedSegment} 
              onSelectSegment={setSelectedSegment} 
            />
          </div>

          {/* Right: Deep Dive Panels */}
          <div className="lg:col-span-8 xl:col-span-6 h-[500px] lg:h-auto relative">
            <AnimatePresence mode="wait">
              {renderPanel()}
            </AnimatePresence>
          </div>

           {/* Far Right: Simulation */}
           <div className="lg:col-span-12 xl:col-span-3">
              <SimulationPanel />
           </div>
        </div>

        {/* Ticker Strip */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <PublicMarketsStrip />
        </div>
      </div>
    </Layout>
  );
}
