import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import {
  gnaniSpeechToText,
  gnaniTextToSpeech,
  isGnaniBackendConfigured,
  GNANI_VOICE_CATALOGUE,
} from './server/gnaniBackendService.ts';

// Backend Proxy Plugin to securely handle Gnani Voice AI calls
function gnaniBackendPlugin(backendApiKey: string, backendBaseUrl: string): Plugin {
  process.env.GNANI_API_KEY_ID = backendApiKey;
  process.env.GNANI_API_BASE_URL = backendBaseUrl;

  return {
    name: 'cropshield-gnani-backend',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // 1. Backend Status & Voice Catalogue Endpoint
        if (url === '/api/gnani/status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              configured: isGnaniBackendConfigured(),
              voiceCatalogue: GNANI_VOICE_CATALOGUE,
              sttModel: 'prisma-v2.5',
              ttsModel: 'timbre-v2.5',
            })
          );
          return;
        }

        // 2. Secure STT Endpoint
        if (url === '/api/gnani/stt' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
              const fullBuffer = Buffer.concat(chunks);
              const langCode = (req.headers['x-language-code'] as string) || 'te-IN';

              const result = await gnaniSpeechToText(fullBuffer, {
                languageCode: langCode,
                timeoutMs: 30000,
              });

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 502;
              res.end(JSON.stringify(result));
            });
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        // 3. Secure TTS Endpoint (with Audio Caching & Voice Selection)
        if (url === '/api/gnani/tts' && req.method === 'POST') {
          try {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              const payload = JSON.parse(body || '{}');
              const { text, language, voice, speed } = payload;

              if (!text) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Text is required for TTS' }));
                return;
              }

              const result = await gnaniTextToSpeech({
                text,
                language: language || 'te-IN',
                voice,
                speed,
                timeoutMs: 30000,
              });

              if (result.success && result.audioBuffer) {
                res.setHeader('Content-Type', result.contentType || 'audio/wav');
                res.setHeader('X-Gnani-Source', result.source);
                res.statusCode = 200;
                res.end(Buffer.from(result.audioBuffer));
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 502;
                res.end(JSON.stringify(result));
              }
            });
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gnaniApiKey = (env.GNANI_API_KEY_ID || env.GNANI_API_KEY || '').trim();
  const gnaniBaseUrl = (env.GNANI_API_BASE_URL || 'https://api.vachana.ai').trim();

  return {
    plugins: [
      react(),
      gnaniBackendPlugin(gnaniApiKey, gnaniBaseUrl),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react/')) {
                return 'vendor-react';
              }
              if (id.includes('leaflet') || id.includes('react-leaflet')) {
                return 'vendor-maps';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
            }
          },
        },
      },
    },
  };
});
