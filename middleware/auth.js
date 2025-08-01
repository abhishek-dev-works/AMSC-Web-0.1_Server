// middlewares/auth.js
const jwt = require('jsonwebtoken');

function getTokenFromReq(req) {
  // 1) Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);

  // 2) Cookie (optional, uncomment if you plan to set cookies)
  // if (req.cookies && req.cookies.token) return req.cookies.token;

  return null;
}

/**
 * Require a valid JWT. On success: req.user = decoded payload
 * Responds 401 with a clear error for missing/invalid/expired token
 */
function requireAuth(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail fast if secret is not configured
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // Differentiate common errors
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: token expired' });
      }
      return res.status(401).json({ message: 'Unauthorized: invalid token' });
    }
    // Attach decoded payload to request (e.g., { sub, role, email, iat, exp })
    req.user = decoded;
    next();
  });
}

/**
 * Optional: role guard. Use after requireAuth.
 *   router.get('/admin', requireAuth, requireRole('ADMIN'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userRole = req.user.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
