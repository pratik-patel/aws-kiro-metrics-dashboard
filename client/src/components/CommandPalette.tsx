import { useState, useEffect } from "react";
import { Search, Command } from "lucide-react";
import { useLocation } from "wouter";
import { MOCK_DATA } from "@/lib/mock-data";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle palette with Cmd+K or Ctrl+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // Escape closes the palette
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-50 transition-opacity" onClick={() => setOpen(false)} />
      <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-2xl translate-x-[-50%] bg-[#121A2B] border border-[rgba(164,180,210,0.12)] rounded-[18px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-[rgba(164,180,210,0.12)] px-4">
          <Search className="w-5 h-5 text-[#A8B3C7] mr-2" />
          <input
            autoFocus
            className="flex h-14 w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#7D8AA3] text-[#F3F7FF]"
            placeholder="Search cost centers, teams, engineers, or commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-[#182235] px-2 py-1 rounded-md text-[10px] text-[#7D8AA3]">
            <span>ESC</span>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {search ? (
            <div className="p-2 space-y-4">
              {/* Fake search results based on mock data */}
              <div>
                <h4 className="text-xs font-medium text-[#7D8AA3] mb-2 px-2 uppercase tracking-wider">Cost Centers</h4>
                {MOCK_DATA.costCenters.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <div key={c.id} onClick={() => { setLocation(`/detail/cost-center/${c.id}`); setOpen(false); }} className="px-2 py-2 text-sm text-[#F3F7FF] hover:bg-[#182235] rounded-lg cursor-pointer flex justify-between">
                    {c.name}
                    <span className="text-[#A8B3C7]">{c.consumption}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-[#7D8AA3]">
              Type a command or search...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
