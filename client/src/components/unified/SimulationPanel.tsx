import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, PlayCircle, ArrowRight } from "lucide-react";

export function SimulationPanel() {
  const [allocation, setAllocation] = React.useState(5);
  const [simulatedValues, setSimulatedValues] = React.useState({
    volatility: 12.4,
    liquidity: 85, // High liquidity score
    returns: 7.2
  });
  const [isSimulating, setIsSimulating] = React.useState(false);

  const handleSliderChange = (values: number[]) => {
    setAllocation(values[0]);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Logic: 
      // Allocation 5% -> 8%
      // Volatility: Decreases (Diversification)
      // Liquidity: Decreases (Private assets are illiquid)
      // Returns: Increases (Illiquidity premium)
      
      const delta = allocation - 5; // 0 to 3
      const factor = delta / 3; // 0 to 1

      setSimulatedValues({
        volatility: parseFloat((12.4 - (factor * 1.5)).toFixed(1)),
        liquidity: Math.round(85 - (factor * 15)),
        returns: parseFloat((7.2 + (factor * 1.2)).toFixed(1))
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <Card className="h-full border-border/50 bg-gradient-to-br from-card to-card/90 overflow-hidden relative flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Zap className="w-32 h-32" />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Allocation Simulator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1 flex flex-col">
        {/* Controls */}
        <div className="space-y-4 p-4 bg-background/30 rounded-lg border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Target Private Credit</span>
            <span className="text-xl font-bold text-primary font-mono">{allocation}%</span>
          </div>
          
          <Slider
            defaultValue={[5]}
            min={5}
            max={8}
            step={0.5}
            onValueChange={handleSliderChange}
            className="py-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>5% (Current)</span>
            <span>8% (Target)</span>
          </div>

          <Button 
            onClick={runSimulation} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            disabled={isSimulating}
          >
            {isSimulating ? "Computing..." : <><PlayCircle className="w-4 h-4 mr-2" /> Run Simulation</>}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-3 flex-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Projected Impact</div>
          
          {/* Volatility Card */}
          <MetricResult 
             label="Portfolio Volatility" 
             current="12.4%" 
             simulated={`${simulatedValues.volatility}%`} 
             delta={simulatedValues.volatility - 12.4}
             inverse={true} // Lower is better
          />

          {/* Liquidity Card */}
          <MetricResult 
             label="Liquidity Score" 
             current="85" 
             simulated={`${simulatedValues.liquidity}`} 
             delta={simulatedValues.liquidity - 85}
             inverse={false}
          />

           {/* Return Card */}
           <MetricResult 
             label="Expected Return" 
             current="7.2%" 
             simulated={`${simulatedValues.returns}%`} 
             delta={simulatedValues.returns - 7.2}
             inverse={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricResult({ label, current, simulated, delta, inverse }: { label: string, current: string, simulated: string, delta: number, inverse: boolean }) {
  const isNeutral = delta === 0;
  // For standard metrics: Positive delta is Green (Good). 
  // For inverse metrics (Volatility): Negative delta is Green (Good).
  
  let colorClass = "text-muted-foreground";
  if (!isNeutral) {
    if (inverse) {
       colorClass = delta < 0 ? "text-emerald-500" : "text-red-500";
    } else {
       colorClass = delta > 0 ? "text-emerald-500" : "text-red-500";
    }
  }

  return (
    <div className="flex items-center justify-between p-3 rounded bg-card/50 border border-border/50">
       <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2 text-sm">
             <span className="font-mono text-muted-foreground/70">{current}</span>
             <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
             <span className="font-mono font-bold text-foreground">{simulated}</span>
          </div>
       </div>
       {!isNeutral && (
          <div className={`text-xs font-bold ${colorClass} bg-background/50 px-2 py-1 rounded`}>
             {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </div>
       )}
    </div>
  )
}
