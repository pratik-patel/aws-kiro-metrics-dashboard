import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Activity,
  LayoutDashboard, 
  Compass, 
  AlertTriangle, 
  Beaker, 
  FileText,
  Search,
  Bell,
  User,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/CommandPalette";
import { KIRO_DATA } from "@/lib/kiro-data";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/explorer", label: "Explorer", icon: Compass },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/studio", label: "Studio", icon: Beaker },
  { href: "/reports", label: "Reports & Evidence", icon: FileText },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-200 flex flex-col font-sans">
      {/* Premium Dark Shell Header */}
      <header className="sticky top-0 z-50 flex items-center h-16 px-6 border-b border-white/10 bg-[#0c1220]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0c1220]/80">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Kiro AI Governance</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-9 px-3 lg:px-4 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-white/10 text-white shadow-sm" 
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-400' : ''}`} />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {/* Global Search Trigger */}
          <Button 
            variant="outline" 
            className="hidden lg:flex w-64 justify-start text-muted-foreground bg-black/20 border-white/10 hover:bg-white/5 hover:text-slate-200 shadow-inner"
            onClick={() => {
              // Dispatch a keyboard event to trigger the command palette
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="text-sm font-normal">Search command palette...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Badges */}
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse" />
                {KIRO_DATA.meta.mode}
              </div>
              <div className="flex items-center px-2.5 py-1 rounded-full bg-slate-800 border border-white/5 text-slate-300 text-xs font-medium">
                {KIRO_DATA.meta.freshness}
              </div>
            </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-full"
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              }}
            >
              <Search className="h-4 w-4 lg:hidden" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-full relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0c1220]"></span>
            </Button>
            <div className="w-px h-5 bg-white/10 mx-2 hidden sm:block" />
            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 ml-1">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-slate-100 hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-b from-[#0a0f18] to-[#05080f]">
        <div className="h-full">
          {children}
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}
