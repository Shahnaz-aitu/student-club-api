const User = require("../models/User");

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("clubs");
    res.render("profile", { user, error: null, success: null });
  } catch (e) {
    next(e);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const userNow = await User.findById(req.user._id).populate("clubs");

    if (!username || username.trim().length < 2)
      return res.status(400).render("profile", { user: userNow, error: "Username min 2.", success: null });

    if (!email || !email.includes("@"))
      return res.status(400).render("profile", { user: userNow, error: "Valid email required.", success: null });

    const emailTaken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
    if (emailTaken)
      return res.status(400).render("profile", { user: userNow, error: "Email already used.", success: null });

    await User.findByIdAndUpdate(req.user._id, { username, email });
    const updated = await User.findById(req.user._id).populate("clubs");

    res.render("profile", { user: updated, error: null, success: "Profile updated!" });
  } catch (e) {
    next(e);
  }
};
