import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioAllocation } from "@/lib/mockData";
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

  const totalValueB = (portfolioAllocation.total_value / 1000000000).toFixed(1) + "B";

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
              data={portfolioAllocation.allocation}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="weight"
              nameKey="asset_class"
              onMouseEnter={onPieEnter}
              onClick={(data) => {
                onSelectSegment(data.asset_class);
              }}
              className="cursor-pointer focus:outline-none"
            >
              {portfolioAllocation.allocation.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  strokeWidth={selectedSegment === entry.asset_class ? 2 : 0}
                  stroke="#fff"
                  className={cn(
                    "transition-all duration-300 ease-out",
                    selectedSegment === entry.asset_class ? "opacity-100 scale-105" : "opacity-80 hover:opacity-100"
                  )}
                  style={{
                    transformOrigin: 'center',
                    transform: selectedSegment === entry.asset_class ? 'scale(1.05)' : 'scale(1)'
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
              formatter={(value: number) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums tracking-tight">
              ${totalValueB}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">AUM</div>
          </div>
        </div>
      </CardContent>
      
      {/* Legend */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-2">
        {portfolioAllocation.allocation.map((item) => (
          <div 
            key={item.asset_class} 
            className={cn(
              "flex items-center gap-2 text-sm cursor-pointer transition-colors p-1 rounded hover:bg-white/5",
              selectedSegment === item.asset_class ? "text-foreground font-medium" : "text-muted-foreground"
            )}
            onClick={() => onSelectSegment(item.asset_class)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.fill }} 
            />
            <span>{item.asset_class}</span>
            <span className="ml-auto font-mono text-xs opacity-70">{item.weight}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
