import express from 'express';
import path from 'path';
import https from 'https';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Streaming Proxy endpoint for Google Drive VSL Video
  app.get('/api/video-stream', (req, res) => {
    try {
      const driveId = (req.query.id as string) || '1GuOXl1YdhXj4JdnphW6oi8Zzv5DZ3tuT';
      const gdriveUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`;

      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };
      if (req.headers.range) {
        headers['range'] = req.headers.range;
      }

      const clientReq = https.get(gdriveUrl, { headers }, (gRes) => {
        if (gRes.statusCode && gRes.statusCode >= 300 && gRes.statusCode < 400 && gRes.headers.location) {
          const redirectReq = https.get(gRes.headers.location, { headers }, (redRes) => {
            res.writeHead(redRes.statusCode || 200, {
              'Content-Type': redRes.headers['content-type'] || 'video/mp4',
              'Content-Range': redRes.headers['content-range'] || '',
              'Content-Length': redRes.headers['content-length'] || '',
              'Accept-Ranges': 'bytes',
              'Access-Control-Allow-Origin': '*',
              'Cross-Origin-Resource-Policy': 'cross-origin',
            });
            redRes.pipe(res);
          });
          redirectReq.on('error', () => {
            if (!res.headersSent) res.status(500).end();
          });
          return;
        }

        res.writeHead(gRes.statusCode || 200, {
          'Content-Type': gRes.headers['content-type'] || 'video/mp4',
          'Content-Range': gRes.headers['content-range'] || '',
          'Content-Length': gRes.headers['content-length'] || '',
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        });
        gRes.pipe(res);
      });

      clientReq.on('error', () => {
        if (!res.headersSent) res.status(500).end();
      });

      req.on('close', () => {
        clientReq.destroy();
      });
    } catch {
      if (!res.headersSent) res.status(500).end();
    }
  });

  // Serve static files from public directory (e.g. videos, assets)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
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
