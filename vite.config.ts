import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import https from 'https';
import { defineConfig, Plugin } from 'vite';

function videoStreamPlugin(): Plugin {
  return {
    name: 'video-stream-proxy',
    configureServer(server) {
      server.middlewares.use('/api/video-stream', (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
          const driveId = urlObj.searchParams.get('id') || '1GuOXl1YdhXj4JdnphW6oi8Zzv5DZ3tuT';
          const gdriveUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`;

          const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          };
          if (req.headers.range) {
            headers['range'] = req.headers.range as string;
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
                if (!res.headersSent) res.writeHead(500);
                res.end();
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
            if (!res.headersSent) res.writeHead(500);
            res.end();
          });

          req.on('close', () => {
            clientReq.destroy();
          });
        } catch {
          if (!res.headersSent) res.writeHead(500);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), videoStreamPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
