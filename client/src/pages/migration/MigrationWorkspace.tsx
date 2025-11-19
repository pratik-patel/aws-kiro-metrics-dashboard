import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { migrationProjects } from "@/lib/migrationMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Clock, Database, Server } from "lucide-react";
import { Link } from "wouter";

export default function MigrationWorkspace() {
  return (
    <Layout>
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Migration Workspace</h1>
            <p className="text-muted-foreground mt-2">Manage and monitor enterprise data modernization programs.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Migration Project
          </Button>
        </div>

        {/* Active Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {migrationProjects.map((project) => (
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
          <div className="border border-dashed border-border rounded-xl flex flex-col items-center justify-center min-h-[250px] text-muted-foreground hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer gap-3">
             <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="w-6 h-6" />
             </div>
             <p className="font-medium text-sm">Create New Project</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
