const { sql, body, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' });
  const { email } = body(req);
  if (!/^\S+@\S+\.\S+$/.test(email || '')) return send(res, 400, { error: 'Enter a valid email address.' });
  await sql`INSERT INTO newsletter_subscribers (email) VALUES (${email.toLowerCase()}) ON CONFLICT (email) DO NOTHING`;
  return send(res, 201, { message: 'You are on the preview mailing list.' });
};
