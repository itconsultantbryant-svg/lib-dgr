const { sql, send, requireAdmin } = require('../_lib');
module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const subscribers = await sql`SELECT id,email,subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 500`;
  return send(res, 200, { subscribers });
};
