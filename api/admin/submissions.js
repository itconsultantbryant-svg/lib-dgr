const { sql, send, requireAdmin } = require('../_lib');
module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const rows = await sql`SELECT id,full_name,email,organization,phone,inquiry_type,message,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 100`;
  return send(res, 200, { submissions: rows });
};
