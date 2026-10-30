const { sql, send, requireAdmin } = require('../_lib');
module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const [contacts, subscribers, views, recentContacts, topPages] = await Promise.all([
    sql`SELECT count(*)::int AS count FROM contact_submissions`, sql`SELECT count(*)::int AS count FROM newsletter_subscribers`,
    sql`SELECT count(*)::int AS count FROM analytics_events WHERE created_at > now() - interval '24 hours'`,
    sql`SELECT id,full_name,email,inquiry_type,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 8`,
    sql`SELECT path,count(*)::int AS views FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY path ORDER BY views DESC LIMIT 8`
  ]);
  return send(res, 200, { metrics:{contacts:contacts[0].count,subscribers:subscribers[0].count,views24h:views[0].count}, recentContacts, topPages });
};
