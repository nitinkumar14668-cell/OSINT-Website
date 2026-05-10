import { useState } from 'react';
import { Search, ExternalLink, User } from 'lucide-react';

export function SocialRecon() {
  const [username, setUsername] = useState('');

  const platforms = [
    { name: 'GitHub', url: `https://github.com/{}`, color: 'hover:border-zinc-300 hover:text-zinc-300' },
    { name: 'Twitter / X', url: `https://twitter.com/{}`, color: 'hover:border-blue-400 hover:text-blue-400' },
    { name: 'Instagram', url: `https://instagram.com/{}`, color: 'hover:border-pink-500 hover:text-pink-500' },
    { name: 'Reddit', url: `https://reddit.com/user/{}`, color: 'hover:border-orange-500 hover:text-orange-500' },
    { name: 'TikTok', url: `https://tiktok.com/@{}`, color: 'hover:border-rose-400 hover:text-rose-400' },
    { name: 'Medium', url: `https://medium.com/@{}`, color: 'hover:border-green-500 hover:text-green-500' },
    { name: 'Pinterest', url: `https://pinterest.com/{}`, color: 'hover:border-red-500 hover:text-red-500' },
    { name: 'GitLab', url: `https://gitlab.com/{}`, color: 'hover:border-orange-400 hover:text-orange-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-zinc-100 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-500" />
          Social & Identity Recon
        </h1>
        <p className="text-zinc-500 mt-2 text-sm uppercase tracking-wide">Cross-platform username investigation tool.</p>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-zinc-200 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-12 p-4 outline-none transition-all"
          placeholder="Enter target username..."
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform) => {
           const targetUrl = username ? platform.url.replace('{}', username) : '#';
           return (
             <a
               key={platform.name}
               href={targetUrl}
               target="_blank"
               rel="noreferrer"
               className={`
                 p-4 border border-[#1a1a1a] bg-[#0a0a0a] rounded flex items-center justify-between group transition-all
                 ${!username ? 'opacity-50 cursor-not-allowed grayscale' : `cursor-pointer ${platform.color}`}
               `}
               onClick={(e) => !username && e.preventDefault()}
             >
               <span className="font-semibold text-zinc-400 group-hover:text-inherit transition-colors">{platform.name}</span>
               <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-inherit transition-colors" />
             </a>
           );
        })}
      </div>
      
      <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded text-sm text-blue-400 text-center">
         Enter a username above, then click the platform links to check for profile existence.
      </div>
    </div>
  );
}
