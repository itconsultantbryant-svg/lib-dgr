const bcrypt = require('bcryptjs');
const { sql, body, send, jwt, secret } = require('../_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' });
  const { email, password } = body(req);
  if (!email || !password) return send(res, 400, { error: 'Email and password are required.' });
  const rows = await sql`SELECT id,email,password_hash,display_name,role FROM admin_users WHERE email=${String(email).toLowerCase()}`;
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return send(res, 401, { error: 'Invalid email or password.' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '8h' });
  return send(res, 200, { token, user: { email: user.email, displayName: user.display_name, role: user.role } });
};
