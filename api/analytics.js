const { sql, body, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' });
  const { path, eventName = 'page_view' } = body(req);
  if (!path || String(path).length > 300) return send(res, 400, { error: 'A valid path is required.' });
  await sql`INSERT INTO analytics_events (event_name,path) VALUES (${String(eventName).slice(0,80)},${String(path).slice(0,300)})`;
  return send(res, 204, {});
};
