const { sql, body, send } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' });
  const { name, email, organization = '', phone = '', type = 'General inquiry', message } = body(req);
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !message) return send(res, 400, { error: 'Please provide a name, valid email, and message.' });
  await sql`INSERT INTO contact_submissions (full_name,email,organization,phone,inquiry_type,message) VALUES (${name},${email},${organization},${phone},${type},${message})`;
  return send(res, 201, { message: 'Thank you. Your inquiry has been received.' });
};
