import { useState } from 'react';
import { Hash, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HashAnalyzer() {
  const [hash, setHash] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const analyzeHash = (input: string) => {
    const len = input.length;
    const isHex = /^[A-Fa-f0-9]+$/.test(input);
    const isBcrypt = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(input);
    const isMD5Crypt = /^\$1\$[./A-Za-z0-9]{1,8}\$[./A-Za-z0-9]{22}$/.test(input);
    const isSHA256Crypt = /^\$5\$[./A-Za-z0-9]{1,16}\$[./A-Za-z0-9]{43}$/.test(input);
    const isSHA512Crypt = /^\$6\$[./A-Za-z0-9]{1,16}\$[./A-Za-z0-9]{86}$/.test(input);

    let possibles: string[] = [];

    if (isBcrypt) possibles.push("Bcrypt (Blowfish)");
    if (isMD5Crypt) possibles.push("MD5 Crypt");
    if (isSHA256Crypt) possibles.push("SHA-256 Crypt");
    if (isSHA512Crypt) possibles.push("SHA-512 Crypt");

    if (isHex) {
      if (len === 32) {
        possibles.push("MD5", "MD4", "NTLM");
      }
      if (len === 40) {
        possibles.push("SHA-1", "MySQL5.x");
      }
      if (len === 56) {
        possibles.push("SHA-224", "SHA3-224");
      }
      if (len === 64) {
        possibles.push("SHA-256", "SHA3-256", "GOST R 34.11-94");
      }
      if (len === 96) {
        possibles.push("SHA-384");
      }
      if (len === 128) {
        possibles.push("SHA-512", "Whirlpool", "SHA3-512");
      }
    }

    setResults(possibles);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 flex items-center gap-3">
          <Hash className="w-8 h-8 text-orange-500" />
          Hash Analyzer
        </h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">Identify cryptographic hashes and encryption signatures system.</p>
      </header>

      <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded p-6">
        <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-bold">Input Hash String</label>
        <textarea
          className="w-full h-32 bg-[#111] border border-[#222] rounded p-4 text-orange-400 font-mono text-sm outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 resize-none"
          placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value.trim());
            analyzeHash(e.target.value.trim());
          }}
        />

        <div className="mt-8">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest border-b border-[#1a1a1a] pb-2 mb-4">Diagnostics Result</div>
          
          {!hash ? (
             <div className="text-zinc-500 text-sm italic">Waiting for input...</div>
          ) : results.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
               {results.map((res, i) => (
                 <div key={i} className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded text-emerald-400 text-sm font-mono">
                   <ShieldCheck className="w-4 h-4 shrink-0" />
                   {res}
                 </div>
               ))}
             </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Unknown Hash format. Ensure there are no spaces or invalid characters.</span>
            </div>
          )}
        </div>

        {hash && (
           <div className="mt-6 flex items-center justify-between text-xs text-zinc-500 font-mono border-t border-[#1a1a1a] pt-4">
             <div>Length: {hash.length} chars</div>
             <div>Format: {/^[A-Fa-f0-9]+$/.test(hash) ? 'Hexadecimal' : 'Complex string'}</div>
           </div>
        )}
      </div>
    </div>
  );
}
