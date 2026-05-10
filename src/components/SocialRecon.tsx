import React, { useState } from 'react';
import { Search, ExternalLink, User, Check, X, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SocialRecon() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setResults([]);
    setError('');

    try {
      const response = await fetch(`/api/social/${username}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to perform social scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-500" />
          Social & Identity Recon
        </h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">Cross-platform automated profile checker.</p>
      </header>

      <form onSubmit={handleScan} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-zinc-200 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3 outline-none"
            placeholder="Enter target username..."
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !username}
          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/50 uppercase tracking-widest text-xs font-bold px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? 'Scanning...' : 'Scan'}
          {!loading && <Play className="w-4 h-4 fill-current" />}
        </button>
      </form>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded text-sm text-red-500 text-center">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 border border-[#1a1a1a] border-dashed rounded bg-[#0a0a0a]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-xs uppercase tracking-widest text-zinc-500">Interrogating platforms...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((plat: any, idx: number) => (
            <a
               key={idx}
               href={plat.url}
               target="_blank"
               rel="noreferrer"
               className={cn(
                 "p-4 border rounded flex items-center justify-between group transition-all",
                 plat.exists 
                   ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500" 
                   : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333] opacity-60"
               )}
             >
               <div className="flex items-center gap-3">
                 {plat.exists ? (
                   <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                     <Check className="w-3 h-3 text-emerald-500" />
                   </div>
                 ) : (
                   <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                     <X className="w-3 h-3 text-zinc-500" />
                   </div>
                 )}
                 <span className={cn(
                   "font-semibold transition-colors",
                   plat.exists ? "text-emerald-400 group-hover:text-emerald-300" : "text-zinc-500 group-hover:text-zinc-400"
                 )}>
                   {plat.name}
                 </span>
               </div>
               
               <ExternalLink className={cn(
                 "w-4 h-4 transition-colors",
                 plat.exists ? "text-emerald-500/50 group-hover:text-emerald-400" : "text-zinc-700 group-hover:text-zinc-500"
               )} />
             </a>
          ))}
        </div>
      )}
      
      {!loading && results.length === 0 && !error && (
        <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded text-sm text-blue-400 text-center">
          Enter a username and click Scan to automatically verify existence across multiple platforms. Note: Some platforms may block automated checks and return false negatives (Not Found).
        </div>
      )}
    </div>
  );
}
