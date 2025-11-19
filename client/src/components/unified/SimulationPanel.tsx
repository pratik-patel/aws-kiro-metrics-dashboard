import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export function SimulationPanel() {
  const [allocation, setAllocation] = React.useState(10);
  const [volatility, setVolatility] = React.useState(11.7);
  const [prevVolatility, setPrevVolatility] = React.useState(11.7);

  const handleSliderChange = (values: number[]) => {
    const val = values[0];
    setAllocation(val);
    
    // Simple mock calculation logic
    // 5% -> 12.4%
    // 10% -> 11.7%
    // 15% -> 11.1%
    const newVol = 12.4 - ((val - 5) * (1.3 / 10));
    setPrevVolatility(volatility);
    setVolatility(parseFloat(newVol.toFixed(1)));
  };

  const delta = volatility - 11.7; // Baseline 10%

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/90 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap className="w-24 h-24" />
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Portfolio Simulation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Target PC Allocation</span>
            <span className="text-xl font-bold text-primary font-mono">{allocation}%</span>
          </div>
          
          <Slider
            defaultValue={[10]}
            min={5}
            max={15}
            step={1}
            onValueChange={handleSliderChange}
            className="py-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>5% (Conservative)</span>
            <span>15% (Aggressive)</span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-background/50 border border-border/50 flex items-center justify-between">
          <div>
             <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Projected Volatility</div>
             <div className="text-3xl font-bold font-mono tracking-tighter flex items-baseline gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={volatility}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {volatility}%
                  </motion.span>
                </AnimatePresence>
             </div>
          </div>
          
          <div className="text-right">
             <div className="text-xs text-muted-foreground mb-1">Impact</div>
             <div className={`text-sm font-medium ${delta < 0 ? 'text-green-500' : delta > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
               {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
