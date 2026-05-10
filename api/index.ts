import express from 'express';
import dns from 'dns/promises';

const app = express();

app.use(express.json());

// OSINT APIs - IP Lookup
app.get('/api/ip/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const resp = await fetch(`http://ip-api.com/json/${query}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    const data = await resp.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// OSINT APIs - DNS records
app.get('/api/dns/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const records: any = {};
    
    try { records.A = await dns.resolve4(domain); } catch(e) {}
    try { records.AAAA = await dns.resolve6(domain); } catch(e) {}
    try { records.MX = await dns.resolveMx(domain); } catch(e) {}
    try { records.TXT = await dns.resolveTxt(domain); } catch(e) {}
    try { records.NS = await dns.resolveNs(domain); } catch(e) {}
    
    res.json({ domain, records });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// OSINT APIs - Social Recon
app.get('/api/social/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const platforms = [
      { name: 'GitHub', url: `https://github.com/${username}` },
      { name: 'GitLab', url: `https://gitlab.com/${username}` },
      { name: 'Reddit', url: `https://www.reddit.com/user/${username}/about.json`, profileUrl: `https://reddit.com/user/${username}` },
      { name: 'Pinterest', url: `https://www.pinterest.com/${username}/` },
      { name: 'HackerOne', url: `https://hackerone.com/${username}` },
      { name: 'Bugcrowd', url: `https://bugcrowd.com/${username}` },
      { name: 'Codecademy', url: `https://www.codecademy.com/profiles/${username}` },
      { name: 'Pastebin', url: `https://pastebin.com/u/${username}` },
      { name: 'Roblox', url: `https://www.roblox.com/user.aspx?username=${username}` },
    ];

    const results = await Promise.all(platforms.map(async (plat) => {
      try {
        const response = await fetch(plat.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
          }
        });
        
        return {
          name: plat.name,
          url: plat.profileUrl || plat.url,
          exists: response.status === 200,
          status: response.status
        };
      } catch (err) {
        return {
          name: plat.name,
          url: plat.profileUrl || plat.url,
          exists: false,
          error: true
        };
      }
    }));

    res.json({ username, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
