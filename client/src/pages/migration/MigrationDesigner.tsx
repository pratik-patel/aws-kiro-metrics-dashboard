import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sourceSchema, targetSchema, mappingRules } from "@/lib/migrationMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GripVertical, Wand2, Save } from "lucide-react";
import { Link } from "wouter";

export default function MigrationDesigner() {
  return (
    <Layout>
      <div className="space-y-6 pb-20 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Schema Mapper</h1>
            <p className="text-sm text-muted-foreground">Global Private Credit Migration (MP-2025-001)</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" className="gap-2">
                <Wand2 className="w-4 h-4" /> Auto-Map
             </Button>
             <Link href="/migration-execution">
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                   <Save className="w-4 h-4" /> Save & Validate
                </Button>
             </Link>
          </div>
        </div>

        {/* Designer Canvas */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Source */}
          <Card className="col-span-3 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
             <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Source: Legacy Db2</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 overflow-auto p-2 space-y-2">
                {sourceSchema.map((field, i) => (
                   <div key={i} className="p-3 bg-background border border-border rounded text-sm flex justify-between items-center group hover:border-primary/50 cursor-grab">
                      <div>
                         <div className="font-mono font-bold text-xs">{field.field}</div>
                         <div className="text-[10px] text-muted-foreground">{field.type}</div>
                      </div>
                      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-50" />
                   </div>
                ))}
             </CardContent>
          </Card>

          {/* Mapping Zone */}
          <Card className="col-span-6 flex flex-col border-border/50 bg-muted/10 backdrop-blur-sm">
             <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-center text-muted-foreground">Transformation Rules</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 overflow-auto p-2 space-y-2">
                {mappingRules.map((rule) => (
                   <div key={rule.id} className="flex items-center justify-between p-3 bg-card border border-border rounded shadow-sm">
                      <div className="font-mono text-xs font-bold text-muted-foreground w-24 text-right">{rule.source}</div>
                      <div className="flex-1 mx-4 flex items-center">
                         <div className="h-[1px] flex-1 bg-border relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[10px] border border-border rounded text-primary font-medium whitespace-nowrap">
                               {rule.rule}
                            </div>
                         </div>
                         <ArrowRight className="w-4 h-4 text-muted-foreground ml-2" />
                      </div>
                      <div className="font-mono text-xs font-bold text-foreground w-24">{rule.target}</div>
                      <Badge variant="outline" className="ml-2 text-[10px] bg-green-500/10 text-green-500 border-green-500/20">
                         {rule.status}
                      </Badge>
                   </div>
                ))}
                {/* Empty State for drag drop */}
                <div className="h-12 border border-dashed border-border rounded flex items-center justify-center text-xs text-muted-foreground bg-muted/5">
                   Drag source fields here to map
                </div>
             </CardContent>
          </Card>

          {/* Target */}
          <Card className="col-span-3 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
             <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Target: Snowflake</CardTitle>
             </CardHeader>
             <CardContent className="flex-1 overflow-auto p-2 space-y-2">
                {targetSchema.map((field, i) => (
                   <div key={i} className="p-3 bg-background border border-border rounded text-sm flex justify-between items-center">
                      <div>
                         <div className="font-mono font-bold text-xs">{field.field}</div>
                         <div className="text-[10px] text-muted-foreground">{field.type} {field.required && "*"}</div>
                      </div>
                   </div>
                ))}
             </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}
