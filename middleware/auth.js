const jwt = require("jsonwebtoken");
const User = require("../models/User");

function readToken(req) {
  const cookieName = process.env.COOKIE_NAME || "token";
  const fromCookie = req.cookies?.[cookieName];
  const fromHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  return fromCookie || fromHeader;
}

exports.optionalAuth = async (req, res, next) => {
  try {
    const token = readToken(req);
    if (!token) {
      req.user = null;
      res.locals.currentUser = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    req.user = user || null;
    res.locals.currentUser = user || null;
    next();
  } catch {
    req.user = null;
    res.locals.currentUser = null;
    next();
  }
};

exports.requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).render("login", { error: "Please login first.", values: {} });
  next();
};
