import { Activity, Globe, Hash, Search } from "lucide-react";

export function Dashboard() {
  const stats = [
    { label: "Queries Logged", value: "0000", bg: "bg-emerald-500/10", text: "text-emerald-500" },
    { label: "IPs Scanned", value: "0000", bg: "bg-blue-500/10", text: "text-blue-500" },
    { label: "Hashes Analyzed", value: "0000", bg: "bg-orange-500/10", text: "text-orange-500" },
    { label: "Uptime", value: "100%", bg: "bg-zinc-500/10", text: "text-zinc-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 flex items-center gap-3">
          <Activity className="w-8 h-8 text-emerald-500" />
          Dashboard Overview
        </h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">System initialized and ready for intelligence gathering.</p>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 border border-[#1a1a1a] rounded bg-[#0a0a0a] flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-sans z-10">{s.label}</div>
            <div className={`text-4xl font-light tracking-tighter ${s.text} z-10`}>{s.value}</div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl transition-all group-hover:scale-150 ${s.bg}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[#1a1a1a] rounded bg-[#0a0a0a] p-4 text-sm text-zinc-400">
          <h2 className="text-emerald-500 font-bold uppercase text-xs mb-4">Quick Start Guide</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 mt-0.5 text-zinc-600 shrink-0" />
              <span>Use the <strong className="text-zinc-200">Network Recon</strong> tool to gather Geolocation, ISP, and DNS records for any IP or Domain.</span>
            </li>
            <li className="flex items-start gap-2">
              <Hash className="w-4 h-4 mt-0.5 text-zinc-600 shrink-0" />
              <span>Identify unknown cryptographic hashes with the <strong className="text-zinc-200">Hash Analyzer</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <Search className="w-4 h-4 mt-0.5 text-zinc-600 shrink-0" />
              <span>Investigate online presence rapidly with the <strong className="text-zinc-200">Social Recon</strong> module.</span>
            </li>
          </ul>
        </div>

        <div className="border border-[#1a1a1a] rounded bg-[#0a0a0a] p-4 text-sm text-zinc-400 flex flex-col items-center justify-center min-h-[200px]">
           <div className="w-full flex justify-between space-x-1">
             {Array.from({length: 40}).map((_, i) => (
               <div key={i} className="w-1.5 h-16 bg-zinc-800 rounded-sm relative overflow-hidden">
                 <div className="absolute bottom-0 w-full bg-emerald-500/50" style={{ height: `${Math.random() * 100}%` }}></div>
               </div>
             ))}
           </div>
           <div className="mt-4 text-[10px] uppercase tracking-widest text-zinc-600">Simulated Network Activity</div>
        </div>
      </div>
    </div>
  );
}
