import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { migrationProjects as initialMockProjects } from "@/lib/migrationMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Clock, Database, Server, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function MigrationWorkspace() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [projects, setProjects] = React.useState(initialMockProjects);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form refs to capture data without controlled inputs for simplicity
  const nameRef = React.useRef<HTMLInputElement>(null);
  const [sourceSystem, setSourceSystem] = React.useState("legacy_db2");
  const [targetSystem, setTargetSystem] = React.useState("snowflake");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject = {
      id: `MP-2025-00${projects.length + 1}`,
      name: nameRef.current?.value || "New Migration Project",
      status: "Planning", // Initial status
      progress: 0,
      source: sourceSystem === "legacy_db2" ? "Legacy Mainframe (Db2)" : 
              sourceSystem === "oracle_ebs" ? "Oracle EBS" :
              sourceSystem === "sap_ecc" ? "SAP ECC" : "Flat File (CSV)",
      target: targetSystem === "snowflake" ? "Snowflake Cloud Data Platform" : 
              targetSystem === "databricks" ? "Databricks Lakehouse" :
              targetSystem === "bigquery" ? "Google BigQuery" : "PostgreSQL",
      owner: "Alexandra Chen",
      lastUpdated: "Just now"
    };

    setProjects([...projects, newProject]);
    setIsLoading(false);
    setIsDialogOpen(false);
    
    toast({
      title: "Project Created Successfully",
      description: `${newProject.name} has been initialized.`,
    });

    // Optional: Auto-navigate or let user see it
    // setLocation("/migration-designer");
  };

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Migration Workspace</h1>
            <p className="text-muted-foreground mt-2">Manage and monitor enterprise data modernization programs.</p>
          </div>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" /> New Migration Project
          </Button>
        </div>

        {/* Active Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                   <Badge variant="outline" className="bg-background/50">{project.id}</Badge>
                   <Badge className={
                      project.status === "In Progress" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20" :
                      project.status === "Completed" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" :
                      "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
                   }>
                      {project.status}
                   </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription className="text-xs pt-1">Owner: {project.owner}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Source/Target */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 p-2 rounded border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3 h-3" /> {project.source}
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3 h-3" /> {project.target}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span>Migration Progress</span>
                      <span className="font-mono">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-between items-center">
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated {project.lastUpdated}
                     </span>
                     <Link href="/migration-designer">
                       <Button variant="ghost" size="sm" className="h-7 text-xs group-hover:translate-x-1 transition-transform">
                         Open Designer <ArrowRight className="w-3 h-3 ml-1" />
                       </Button>
                     </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* New Project Placeholder */}
          <div 
            onClick={() => setIsDialogOpen(true)}
            className="border border-dashed border-border rounded-xl flex flex-col items-center justify-center min-h-[250px] text-muted-foreground hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer gap-3"
          >
             <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6" />
             </div>
             <p className="font-medium text-sm">Create New Project</p>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Migration Project</DialogTitle>
            <DialogDescription>
              Initialize a new data migration workspace. This will set up source connectors and target schema validation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  ref={nameRef}
                  placeholder="e.g. Q1 2025 Private Credit Migration" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="source">Source System</Label>
                  <Select value={sourceSystem} onValueChange={setSourceSystem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legacy_db2">Legacy Db2</SelectItem>
                      <SelectItem value="oracle_ebs">Oracle EBS</SelectItem>
                      <SelectItem value="sap_ecc">SAP ECC</SelectItem>
                      <SelectItem value="csv_dump">Flat File (CSV)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target">Target System</Label>
                  <Select value={targetSystem} onValueChange={setTargetSystem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="snowflake">Snowflake</SelectItem>
                      <SelectItem value="databricks">Databricks</SelectItem>
                      <SelectItem value="bigquery">BigQuery</SelectItem>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Project Owner</Label>
                <Input id="owner" defaultValue="Alexandra Chen" disabled className="bg-muted" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>Create Project</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
