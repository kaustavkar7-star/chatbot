import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'n8n-chat-proxy',
        configureServer(server) {
          server.middlewares.use('/api/chat-proxy', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const targetUrl = parsed.targetUrl;
                  const payload = parsed.payload;

                  if (!targetUrl) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing targetUrl parameter' }));
                    return;
                  }

                  const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json, text/plain, */*',
                    },
                    body: JSON.stringify(payload),
                  });

                  const contentType = response.headers.get('content-type') || 'application/json';
                  const responseText = await response.text();
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', contentType);
                  res.end(responseText);
                } catch (error: any) {
                  res.statusCode = 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      error: 'Failed to communicate with n8n endpoint via proxy',
                      details: error?.message || String(error),
                    })
                  );
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
