import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Database, PieChart, BookOpen, BarChart3 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    {
      label: "Portfolio",
      path: "/unified-portfolio",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    {
      label: "Private Markets",
      path: "/private-credit",
      icon: <PieChart className="w-4 h-4 mr-2" />,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: <BarChart3 className="w-4 h-4 mr-2" />,
      disabled: true
    },
    {
      label: "Migration Demo",
      path: "/data-migration",
      icon: <Database className="w-4 h-4 mr-2" />,
    },
    {
      label: "Data Dictionary",
      path: "/data-dictionary",
      icon: <BookOpen className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/unified-portfolio">
              <a className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="font-bold text-white text-lg">U</span>
                </div>
                <span className="font-display font-bold text-lg tracking-tight">
                  Unified Markets <span className="text-muted-foreground font-normal">Platform</span>
                </span>
              </a>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                item.disabled ? (
                   <span key={item.path} className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-muted-foreground/50 cursor-not-allowed">
                      {item.icon}
                      {item.label}
                   </span>
                ) : (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={cn(
                        "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        location === item.path
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

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 border border-white/20 flex items-center justify-center text-xs font-bold text-gray-600 shadow-inner">
              CIO
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
