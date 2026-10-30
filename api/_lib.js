const { neon } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

const sql = neon(process.env.DATABASE_URL);
const secret = process.env.ADMIN_JWT_SECRET;

function body(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return req.body || {};
}
function send(res, status, data) { return res.status(status).json(data); }
function token(req) { return (req.headers.authorization || '').replace(/^Bearer\s+/i, ''); }
function requireAdmin(req, res) {
  try { return jwt.verify(token(req), secret); }
  catch { send(res, 401, { error: 'Authentication required.' }); return null; }
}
module.exports = { sql, body, send, requireAdmin, jwt, secret };
