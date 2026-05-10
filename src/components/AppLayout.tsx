import { Activity, Globe, Hash, Search, Shield, ShieldAlert, Terminal } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { NetworkTool } from './NetworkTool';
import { HashAnalyzer } from './HashAnalyzer';
import { SocialRecon } from './SocialRecon';
import { Dashboard } from './Dashboard';

const navItems = [
  { href: '/', label: 'Overview', icon: Activity },
  { href: '/network', label: 'Network/IP Recon', icon: Globe },
  { href: '/hash', label: 'Hash Analyzer', icon: Hash },
  { href: '/social', label: 'Social Recon', icon: Search },
];

export function AppLayout() {
  const [location] = useLocation();

  return (
    <div className="flex bg-[#050505] text-zinc-300 h-screen overflow-hidden font-mono selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a]">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-2 text-emerald-500">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="font-bold tracking-tighter uppercase">OSINT Nexus</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4 font-sans font-semibold">Modules</div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors group",
                  isActive 
                    ? "bg-[#141414] text-emerald-400 border border-emerald-500/20" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-[#111]"
                )}
              >
                  <Icon className={cn("w-4 h-4", isActive ? "text-emerald-500" : "text-zinc-600 group-hover:text-zinc-400")} />
                  {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            <span>SYS.STATUS: ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 border-l border-r border-[#1a1a1a] min-h-full bg-[#050505]">
          {location === '/' && <Dashboard />}
          {location === '/network' && <NetworkTool />}
          {location === '/hash' && <HashAnalyzer />}
          {location === '/social' && <SocialRecon />}
        </div>
      </main>

    </div>
  );
}
