import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  PieChart, 
  BarChart3, 
  Briefcase,
  Settings2,
  Play,
  ShieldCheck,
  GitBranch,
  FileText,
  Database,
  ChevronRight
} from "lucide-react";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const isMigrationModule = location.startsWith("/migration");

  const mainNav = [
    { 
      label: "Unified Portfolio", 
      path: "/unified-portfolio", 
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: location === "/unified-portfolio" || location === "/" 
    },
    { 
      label: "Private Markets", 
      path: "/private-credit", 
      icon: <PieChart className="w-4 h-4" />,
      active: location === "/private-credit"
    },
    { 
      label: "Analytics", 
      path: "/analytics", 
      icon: <BarChart3 className="w-4 h-4" />,
      disabled: true 
    },
    { 
      label: "Data Migration", 
      path: "/migration-workspace", 
      icon: <Database className="w-4 h-4" />,
      active: isMigrationModule
    },
  ];

  const migrationSteps = [
    { label: "Workspace", path: "/migration-workspace", icon: <Briefcase className="w-3 h-3" /> },
    { label: "Designer", path: "/migration-designer", icon: <Settings2 className="w-3 h-3" /> },
    { label: "Execution", path: "/migration-execution", icon: <Play className="w-3 h-3" /> },
    { label: "Validation", path: "/migration-validation", icon: <ShieldCheck className="w-3 h-3" /> },
    { label: "Lineage", path: "/migration-lineage", icon: <GitBranch className="w-3 h-3" /> },
    { label: "Impact Report", path: "/migration-summary", icon: <FileText className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {/* Primary Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            {/* Brand */}
            <Link href="/unified-portfolio">
              <a className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <span className="font-bold text-white text-lg">U</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg tracking-tight leading-none">
                    Unified Markets
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Platform
                  </span>
                </div>
              </a>
            </Link>

            {/* Main Menu */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNav.map((item) => (
                item.disabled ? (
                   <span key={item.path} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                      {item.icon}
                      {item.label}
                   </span>
                ) : (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        item.active
                          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* User & System Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", isMigrationModule ? "bg-emerald-500" : "bg-green-500")}></span>
              {isMigrationModule ? "Migration Active" : "System Operational"}
            </div>
            <div className="h-8 w-[1px] bg-border/50"></div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-foreground">Alexandra Chen</div>
                <div className="text-[10px] text-muted-foreground">Chief Investment Officer</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 border border-white/20 flex items-center justify-center text-xs font-bold text-gray-600 shadow-inner">
                AC
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation (Migration Module Only) */}
        {isMigrationModule && (
          <div className="w-full border-t border-border/50 bg-muted/10 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center h-12 gap-1 overflow-x-auto no-scrollbar">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2 flex-shrink-0">
                  Migration Suite
                </span>
                <ChevronRight className="w-3 h-3 text-muted-foreground mr-2 flex-shrink-0" />
                
                {migrationSteps.map((step) => (
                  <Link key={step.path} href={step.path}>
                    <a className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      location === step.path 
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}>
                      {step.icon}
                      {step.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
