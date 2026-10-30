const { sql, body, send, requireAdmin } = require('../_lib');
module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (req.method === 'GET') { const rows = await sql`SELECT content_key,content,updated_at FROM content_entries ORDER BY content_key`; return send(res, 200, { entries: rows }); }
  if (req.method === 'PUT') { const { key, content } = body(req); if (!key || typeof content !== 'object') return send(res,400,{error:'A content key and object are required.'}); await sql`INSERT INTO content_entries (content_key,content) VALUES (${key},${JSON.stringify(content)}) ON CONFLICT (content_key) DO UPDATE SET content=EXCLUDED.content,updated_at=now()`; return send(res,200,{message:'Content saved.'}); }
  return send(res,405,{error:'Method not allowed.'});
};
