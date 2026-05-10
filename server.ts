import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dns from 'dns/promises';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // OSINT APIs
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
