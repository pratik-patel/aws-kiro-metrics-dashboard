import * as React from "react";
import { initialPublicTicks } from "@/lib/mockData";
import { motion } from "framer-motion";

export function PublicMarketsStrip() {
  const [ticks, setTicks] = React.useState(initialPublicTicks);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTicks(current => 
        current.map(tick => ({
          ...tick,
          price: tick.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: tick.change + (Math.random() * 0.1 - 0.05)
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-12 bg-black/20 border-t border-border/50 flex items-center overflow-hidden relative backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex gap-8 animate-ticker whitespace-nowrap pl-[100%]">
        {/* Duplicate list for seamless loop */}
        {[...ticks, ...ticks, ...ticks].map((tick, i) => (
          <div key={`${tick.symbol}-${i}`} className="flex items-center gap-2 text-sm font-mono">
            <span className="font-bold text-muted-foreground">{tick.symbol}</span>
            <span className="text-foreground">{tick.price.toFixed(2)}</span>
            <span className={tick.change >= 0 ? "text-green-500" : "text-red-500"}>
              {tick.change >= 0 ? "+" : ""}{tick.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex gap-2">
         <div className="px-2 py-0.5 bg-background/80 border border-border rounded text-[10px] uppercase text-muted-foreground font-medium">
            Live
         </div>
      </div>
    </div>
  );
}
