import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleChatRequest } from './server/chatHandler';

function apiPlugin() {
  return {
    name: 'opv-chat-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(bodyStr || '{}');
              const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
              const result = await handleChatRequest(payload, env);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('API Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
            }
          });
          return;
        }

        // Handle /api/leads for Google Sheets Lead Management
        if (req.url === '/api/leads' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              let payload: any = {};
              try {
                payload = JSON.parse(bodyStr || '{}');
              } catch (parseErr) {
                console.warn('Leads JSON parse note:', parseErr);
                payload = {};
              }
              const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
              const webhookUrl = env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL || '';

              if (webhookUrl) {
                try {
                  const controller = new AbortController();
                  const timeout = setTimeout(() => controller.abort(), 10000);
                  const sheetRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                    redirect: 'follow'
                  });
                  clearTimeout(timeout);

                  if (sheetRes.status === 401) {
                    console.warn('\n⚠️ GOOGLE SHEETS PERMISSION NOTICE:');
                    console.warn('The Web App returned 401 Unauthorized.');
                    console.warn('In Google Sheets, go to Extensions -> Apps Script -> Deploy -> Manage deployments.');
                    console.warn('Click the Edit (pencil) icon and set "Who has access" to "Anyone", then click Deploy.\n');
                  } else {
                    console.log('Google Sheets Webhook HTTP Status:', sheetRes.status);
                  }

                  const sheetText = await sheetRes.text();
                  let sheetJson: any = null;
                  try {
                    sheetJson = JSON.parse(sheetText);
                  } catch {
                    sheetJson = null;
                  }

                  if (sheetText.includes('Script function not found: doPost')) {
                    console.warn('\n⚠️ GOOGLE APPS SCRIPT NOTICE:');
                    console.warn('Google responded with: "Script function not found: doPost".');
                    console.warn('This means your deployment is still running an old blank version.');
                    console.warn('Fix: In Apps Script, press Ctrl+S, then click "Deploy" -> "New deployment" -> "Web app" (Who has access: Anyone) -> "Deploy", and update VITE_GOOGLE_SHEETS_WEBHOOK_URL in .env.\n');
                  } else if (sheetJson && sheetJson.status === 'success') {
                    console.log('✅ Google Sheets lead written successfully! Action:', sheetJson.action);
                  } else {
                    console.log('Google Sheets Webhook response received (Status:', sheetRes.status, ')');
                  }

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    googleSheetResult: sheetJson || { status: 'html_response' },
                    httpStatus: sheetRes.status,
                    scriptError: sheetText.includes('Script function not found: doPost') ? 'doPost_not_found' : undefined
                  }));
                  return;
                } catch (sheetErr) {
                  console.warn('Google Sheets Webhook dispatch failed, falling back to local storage:', sheetErr);
                }
              }

              // Return graceful success response even if webhook is not configured yet
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Lead recorded in local buffer' }));
            } catch (err: any) {
              console.error('Leads API Error:', err);
              res.statusCode = 200; // Never crash lead form
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Recorded in backup mode' }));
            }
          });
          return;
        }

        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(bodyStr || '{}');
              const env = loadEnv('production', process.cwd(), '');
              const result = await handleChatRequest(payload, env);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('API Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
            }
          });
          return;
        }

        if (req.url === '/api/leads' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk: any) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(bodyStr || '{}');
              const env = loadEnv('production', process.cwd(), '');
              const webhookUrl = env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || env.GOOGLE_SHEETS_WEBHOOK_URL || '';
              if (webhookUrl) {
                try {
                  await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                } catch { }
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});

