import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

const require = createRequire(import.meta.url);

// Runs the production Vercel functions under `npm run dev`, avoiding a separate
// mock API and keeping local admin testing aligned with deployed behavior.
function localApi() {
  return {
    name: 'integrated-dgr-local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const pathname = (req.url || '/').split('?')[0].replace(/^\/+/, '') || 'index';
        const file = resolve(process.cwd(), 'api', `${pathname}.js`);
        if (!existsSync(file)) return next();
        try {
          let raw = '';
          for await (const part of req) raw += part;
          req.body = raw ? JSON.parse(raw) : {};
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
          delete require.cache[file];
          await require(file)(req, res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Local API error.', detail: error.message }));
        }
      });
    }
  };
}

export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return { plugins: [localApi()] };
};
