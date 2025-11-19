import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioAllocationData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface PortfolioAllocationProps {
  onSelectSegment: (segmentName: string) => void;
  selectedSegment: string | null;
}

export function PortfolioAllocation({ onSelectSegment, selectedSegment }: PortfolioAllocationProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-muted-foreground">
          Global Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={portfolioAllocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onClick={(data) => {
                if (data.name === "Private Credit") {
                  onSelectSegment(data.name);
                } else {
                  onSelectSegment(data.name); // Select others too for basic highlighting
                }
              }}
              className="cursor-pointer focus:outline-none"
            >
              {portfolioAllocationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  strokeWidth={selectedSegment === entry.name ? 2 : 0}
                  stroke="#fff"
                  className={cn(
                    "transition-all duration-300 ease-out",
                    selectedSegment === entry.name ? "opacity-100 scale-105" : "opacity-80 hover:opacity-100"
                  )}
                  style={{
                    transformOrigin: 'center',
                    transform: selectedSegment === entry.name ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums tracking-tight">
              $2.4B
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">AUM</div>
          </div>
        </div>
      </CardContent>
      
      {/* Legend */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-2">
        {portfolioAllocationData.map((item) => (
          <div 
            key={item.name} 
            className={cn(
              "flex items-center gap-2 text-sm cursor-pointer transition-colors p-1 rounded hover:bg-white/5",
              selectedSegment === item.name ? "text-foreground font-medium" : "text-muted-foreground"
            )}
            onClick={() => onSelectSegment(item.name)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.fill }} 
            />
            <span>{item.name}</span>
            <span className="ml-auto font-mono text-xs opacity-70">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
