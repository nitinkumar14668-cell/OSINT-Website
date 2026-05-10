import React, { useState } from 'react';
import { Search, MapPin, Server, Activity, ArrowRight, ShieldAlert, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NetworkTool() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [dnsData, setDnsData] = useState<any>(null);
  const [error, setError] = useState('');

  const isDomain = (str: string) => {
    // very basic check if it looks like a domain instead of IP
    return /[a-zA-Z]/.test(str) && str.includes('.');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setData(null);
    setDnsData(null);

    const isDom = isDomain(query);

    try {
      const res = await fetch(`/api/ip/${query}`);
      const result = await res.json();
      
      if (result.status === 'fail') {
        setError(result.message || 'Failed to resolve.');
      } else {
        setData(result);
      }

      if (isDom) {
        const dnsRes = await fetch(`/api/dns/${query}`);
        const dnsResult = await dnsRes.json();
        if (!dnsResult.error) {
          setDnsData(dnsResult);
        }
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100">Network & IP Recon</h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">Gather intelligence on target IP addresses or domain names.</p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-zinc-200 text-sm rounded focus:ring-emerald-500 focus:border-emerald-500 block pl-10 p-3 outline-none"
            placeholder="Enter IP Address (e.g., 8.8.8.8) or Domain (e.g., target.com)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query}
          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 uppercase tracking-widest text-xs font-bold px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? 'Scanning...' : 'Execute'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 flex items-center gap-3 text-red-400 text-sm rounded">
          <ShieldAlert className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      )}

      {loading && (
        <div className="h-64 border border-[#1a1a1a] border-dashed rounded flex flex-col items-center justify-center text-zinc-500 gap-4">
           <Activity className="w-8 h-8 animate-pulse text-emerald-600" />
           <div className="text-xs uppercase tracking-widest animate-pulse">Running diagnostics...</div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded p-6">
             <h3 className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
               <MapPin className="w-4 h-4" /> Geolocation Data
             </h3>
             <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">IP/Target</div>
               <div className="text-zinc-200">{data.query}</div>
               
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">Location</div>
               <div className="text-zinc-200">{data.city}, {data.regionName}, {data.country}</div>
               
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">Coords</div>
               <div className="text-zinc-200 font-mono text-xs">{data.lat}, {data.lon}</div>
               
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">Timezone</div>
               <div className="text-zinc-200">{data.timezone}</div>
             </div>
          </div>

          <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded p-6">
             <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
               <Server className="w-4 h-4" /> Infrastructure
             </h3>
             <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">ISP</div>
               <div className="text-zinc-200">{data.isp || 'N/A'}</div>
               
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">Organization</div>
               <div className="text-zinc-200">{data.org || 'N/A'}</div>
               
               <div className="text-zinc-600 uppercase text-[10px] tracking-wider pt-0.5">AS Number</div>
               <div className="text-zinc-200 font-mono text-xs">{data.as || 'N/A'}</div>
             </div>
          </div>
        </div>
      )}

      {dnsData && dnsData.records && (
        <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded p-6">
           <h3 className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
             <Globe className="w-4 h-4" /> DNS Records ({dnsData.domain})
           </h3>
           <div className="space-y-6">
             {Object.entries(dnsData.records).map(([type, records]) => {
               if (!records || (Array.isArray(records) && records.length === 0)) return null;
               return (
                 <div key={type}>
                   <div className="text-zinc-600 uppercase text-[10px] tracking-widest border-b border-[#1a1a1a] pb-1 mb-2">Type {type}</div>
                   <ul className="space-y-1">
                     {Array.isArray(records) ? records.map((r: any, idx: number) => (
                       <li key={idx} className="text-zinc-300 font-mono text-sm bg-[#111] p-1.5 rounded">{typeof r === 'object' ? JSON.stringify(r) : r}</li>
                     )) : (
                       <li className="text-zinc-300 font-mono text-sm bg-[#111] p-1.5 rounded">{records as React.ReactNode}</li>
                     )}
                   </ul>
                 </div>
               );
             })}
             {Object.values(dnsData.records).every(r => !r || (Array.isArray(r) && r.length === 0)) && (
               <div className="text-zinc-500 text-sm italic">No standard DNS records mapped.</div>
             )}
           </div>
        </div>
      )}

    </div>
  );
}
