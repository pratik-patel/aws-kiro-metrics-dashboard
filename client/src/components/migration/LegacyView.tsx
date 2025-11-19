import * as React from "react";
import { legacyData } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Clock } from "lucide-react";

export function LegacyView() {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Simulate slow loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 2; // Slow increment
      });
    }, 100); // 5 seconds total approx
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full border border-gray-300 bg-[#f0f0f0] text-gray-600 font-serif shadow-inner overflow-hidden flex flex-col">
      <div className="bg-[#e0e0e0] border-b border-gray-400 px-4 py-2 flex justify-between items-center">
        <span className="font-bold text-sm uppercase tracking-wider">Legacy Trade Reconciliation System v4.2</span>
        <div className="flex items-center gap-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 border border-yellow-300">
          <Clock className="w-3 h-3" />
          Status: Delayed (T+2)
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-64 h-4 bg-gray-300 border border-gray-400 p-0.5">
              <div 
                className="h-full bg-blue-800" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-xs animate-pulse">Querying Mainframe... Please wait...</span>
          </div>
        ) : (
          <table className="w-full text-xs border-collapse border border-gray-400 bg-white">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-400 p-1 font-normal">Trade ID</th>
                <th className="border border-gray-400 p-1 font-normal">Asset Class</th>
                <th className="border border-gray-400 p-1 font-normal">Qty</th>
                <th className="border border-gray-400 p-1 font-normal">Sts</th>
                <th className="border border-gray-400 p-1 font-normal">Settlement</th>
              </tr>
            </thead>
            <tbody>
              {legacyData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50">
                  <td className="border border-gray-400 p-1 font-mono">{row.id}</td>
                  <td className="border border-gray-400 p-1">{row.asset}</td>
                  <td className="border border-gray-400 p-1 text-right">{row.quantity.toLocaleString()}</td>
                  <td className="border border-gray-400 p-1">
                    {row.status === "Mismatch" || row.status === "Failed" ? (
                      <span className="text-red-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {row.status}
                      </span>
                    ) : (
                      row.status
                    )}
                  </td>
                  <td className="border border-gray-400 p-1">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="bg-[#d0d0d0] border-t border-gray-400 px-2 py-1 text-[10px] font-mono text-gray-500">
        Last Sync: 48 hours ago | Server: US-EAST-LEGACY-04
      </div>
    </div>
  );
}
