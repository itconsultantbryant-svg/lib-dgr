const { sql, send, requireAdmin } = require('../_lib');
module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const [summary, daily, pages, sources, events, devices] = await Promise.all([
    sql`SELECT count(*)::int AS views, count(DISTINCT NULLIF(session_id,''))::int AS visitors, count(DISTINCT path)::int AS pages FROM analytics_events WHERE created_at > now() - interval '30 days'`,
    sql`SELECT to_char(date_trunc('day',created_at),'Mon DD') AS day, count(*)::int AS views, count(DISTINCT NULLIF(session_id,''))::int AS visitors FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY date_trunc('day',created_at) ORDER BY date_trunc('day',created_at)`,
    sql`SELECT path,count(*)::int AS views,count(DISTINCT NULLIF(session_id,''))::int AS visitors FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY path ORDER BY views DESC LIMIT 12`,
    sql`SELECT CASE WHEN referrer='' OR referrer IS NULL THEN 'Direct / unknown' ELSE split_part(regexp_replace(referrer,'^https?://',''),'/',1) END AS source,count(*)::int AS views FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY 1 ORDER BY views DESC LIMIT 8`,
    sql`SELECT event_name,count(*)::int AS count FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY event_name ORDER BY count DESC`,
    sql`SELECT CASE WHEN user_agent ILIKE '%mobile%' THEN 'Mobile' WHEN user_agent ILIKE '%tablet%' THEN 'Tablet' ELSE 'Desktop / other' END AS device,count(*)::int AS views FROM analytics_events WHERE created_at > now() - interval '30 days' GROUP BY 1 ORDER BY views DESC`
  ]);
  return send(res, 200, { summary: summary[0], daily, pages, sources, events, devices });
};
