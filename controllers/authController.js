const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function setCookie(res, token) {
  const cookieName = process.env.COOKIE_NAME || "token";
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false 
  });
}

function strongPassword(pw) {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);
}

exports.home = (req, res) => {
  if (req.user) return res.redirect("/clubs");
  res.redirect("/login");
};

exports.showRegister = (req, res) => {
  res.render("register", { error: null, success: null, values: {} });
};

exports.showLogin = (req, res) => {
  res.render("login", { error: null, values: {} });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.trim().length < 2)
      return res.status(400).render("register", { error: "Username min 2.", success: null, values: req.body });

    if (!email || !email.includes("@"))
      return res.status(400).render("register", { error: "Valid email required.", success: null, values: req.body });

    if (!password || !strongPassword(password))
      return res.status(400).render("register", {
        error: "Password 8+ with uppercase, lowercase, number.",
        success: null,
        values: { username, email }
      });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).render("register", { error: "Email already used.", success: null, values: { username, email } });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash, role: "user" });

    const token = signToken(user._id);
    setCookie(res, token);

    return res.render("register", { error: null, success: "Successful! Your account is created.", values: {} });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).render("login", { error: "Email and password are required.", values: { email } });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).render("login", { error: "Wrong email or password.", values: { email } });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).render("login", { error: "Wrong email or password.", values: { email } });

    const token = signToken(user._id);
    setCookie(res, token);

    res.redirect("/clubs");
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "token";
  res.clearCookie(cookieName);
  res.redirect("/login");
};
