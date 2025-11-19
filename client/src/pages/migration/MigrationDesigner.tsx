import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sourceSchema, targetSchema, mappingRules as initialMappingRules } from "@/lib/migrationMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GripVertical, Wand2, Save, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function MigrationDesigner() {
  const { toast } = useToast();
  const [mappings, setMappings] = React.useState(initialMappingRules);
  const [isAutoMapping, setIsAutoMapping] = React.useState(false);

  const handleAutoMap = () => {
    setIsAutoMapping(true);
    toast({
      title: "Auto-Mapping Initiated",
      description: "Analyzing source schema and target constraints...",
    });

    setTimeout(() => {
      const newMapping = { 
        id: 5, 
        source: "COUNTERPARTY", 
        target: "counterparty_id", 
        rule: "LOOKUP_REF(CP_MASTER)", 
        status: "New" 
      };
      
      // Check if already exists to avoid dupes in this mock
      if (!mappings.find(m => m.source === "COUNTERPARTY")) {
         setMappings(prev => [...prev, newMapping]);
         toast({
            title: "Mapping Suggestion Found",
            description: "Mapped 'COUNTERPARTY' to 'counterparty_id' with 98% confidence.",
          });
      } else {
         toast({
            title: "No New Mappings",
            description: "All compatible fields are already mapped.",
          });
      }
      setIsAutoMapping(false);
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setMappings(prev => prev.filter(m => m.id !== id));
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Schema Mapper</h1>
            <p className="text-sm text-muted-foreground">Global Private Credit Migration (MP-2025-001)</p>
          </div>
          <div className="flex gap-2">
             <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                onClick={handleAutoMap} 
                disabled={isAutoMapping}
             >
                <Wand2 className={`w-4 h-4 ${isAutoMapping ? "animate-spin" : ""}`} /> 
                {isAutoMapping ? "Analyzing..." : "Auto-Map"}
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
                   <div key={i} className="p-3 bg-background border border-border rounded text-sm flex justify-between items-center group hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors">
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
             <CardHeader className="pb-3 border-b border-border/50 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Transformation Rules</CardTitle>
                <Badge variant="outline" className="text-[10px]">{mappings.length} Active Rules</Badge>
             </CardHeader>
             <CardContent className="flex-1 overflow-auto p-2 space-y-2 relative">
                <AnimatePresence>
                  {mappings.map((rule) => (
                     <motion.div 
                        key={rule.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded shadow-sm group"
                     >
                        <div className="font-mono text-xs font-bold text-muted-foreground w-24 text-right truncate" title={rule.source}>{rule.source}</div>
                        <div className="flex-1 mx-4 flex items-center">
                           <div className="h-[1px] flex-1 bg-border relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[10px] border border-border rounded text-primary font-medium whitespace-nowrap flex items-center gap-1">
                                 {rule.rule}
                              </div>
                           </div>
                           <ArrowRight className="w-4 h-4 text-muted-foreground ml-2" />
                        </div>
                        <div className="font-mono text-xs font-bold text-foreground w-24 truncate" title={rule.target}>{rule.target}</div>
                        
                        <div className="flex items-center gap-2 ml-2">
                           <Badge variant="outline" className={`text-[10px] border-opacity-50 ${
                              rule.status === 'Valid' ? 'bg-green-500/10 text-green-500 border-green-500' : 'bg-blue-500/10 text-blue-500 border-blue-500'
                           }`}>
                              {rule.status}
                           </Badge>
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(rule.id)}
                           >
                              <Trash2 className="w-3 h-3" />
                           </Button>
                        </div>
                     </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State / Drop Target */}
                <div className="h-16 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center text-xs text-muted-foreground bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer">
                   <Plus className="w-4 h-4 mb-1 opacity-50" />
                   <span>Drag source fields here to create new mapping</span>
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
                   <div key={i} className="p-3 bg-background border border-border rounded text-sm flex justify-between items-center group">
                      <div>
                         <div className="font-mono font-bold text-xs">{field.field}</div>
                         <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            {field.type}
                            {field.required && <span className="text-red-400" title="Required">*</span>}
                         </div>
                      </div>
                      {field.required && <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-50" />}
                   </div>
                ))}
             </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}
