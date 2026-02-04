const Club = require("../models/Club");
const User = require("../models/User");

function isAdmin(req) {
  return req.user && req.user.role === "admin";
}

exports.list = async (req, res, next) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    const me = await User.findById(req.user._id).select("clubs");
    const myClubIds = me.clubs.map(String);
    res.render("clubs/index", { clubs, myClubIds });
  } catch (e) {
    next(e);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });

    const me = await User.findById(req.user._id).select("clubs role");
    const isMember = me.clubs.map(String).includes(String(club._id));

    res.render("clubs/detail", { club, isMember, error: null });
  } catch (e) {
    next(e);
  }
};

// ADMIN create form
exports.showNew = (req, res) => {
  if (!isAdmin(req)) return res.status(403).render("error", { status: 403, message: "Forbidden." });
  res.render("clubs/form", { mode: "create", club: {}, error: null });
};

// ADMIN create
exports.create = async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).render("error", { status: 403, message: "Forbidden." });

    const { name, description, location, meetingTime } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).render("clubs/form", { mode: "create", club: req.body, error: "Name min 2." });
    if (!description || description.trim().length < 10)
      return res.status(400).render("clubs/form", { mode: "create", club: req.body, error: "Description min 10." });

    await Club.create({ name, description, location, meetingTime, createdBy: req.user._id });
    res.redirect("/clubs");
  } catch (e) {
    next(e);
  }
};

// ADMIN edit form
exports.showEdit = async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).render("error", { status: 403, message: "Forbidden." });
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });
    res.render("clubs/form", { mode: "edit", club, error: null });
  } catch (e) {
    next(e);
  }
};

// ADMIN update
exports.update = async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).render("error", { status: 403, message: "Forbidden." });

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });

    const { name, description, location, meetingTime } = req.body;

    if (!name || name.trim().length < 2)
      return res.status(400).render("clubs/form", { mode: "edit", club: { ...club.toObject(), ...req.body }, error: "Name min 2." });

    if (!description || description.trim().length < 10)
      return res.status(400).render("clubs/form", { mode: "edit", club: { ...club.toObject(), ...req.body }, error: "Description min 10." });

    await Club.findByIdAndUpdate(req.params.id, { name, description, location, meetingTime });
    res.redirect("/clubs/" + req.params.id);
  } catch (e) {
    next(e);
  }
};

// ADMIN delete
exports.remove = async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).render("error", { status: 403, message: "Forbidden." });

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });

    await Club.findByIdAndDelete(req.params.id);
    await User.updateMany({}, { $pull: { clubs: club._id } });

    res.redirect("/clubs");
  } catch (e) {
    next(e);
  }
};

// USER join (max 3)
exports.join = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });

    const user = await User.findById(req.user._id);
    if (user.role !== "user") return res.status(403).render("error", { status: 403, message: "Only user can join." });

    if (user.clubs.map(String).includes(String(club._id))) return res.redirect("/clubs/" + club._id);

    if (user.clubs.length >= 3)
      return res.status(400).render("clubs/detail", { club, isMember: false, error: "You can join max 3 clubs." });

    user.clubs.push(club._id);
    await user.save();
    res.redirect("/clubs/" + club._id);
  } catch (e) {
    next(e);
  }
};

// USER leave (min 1)
exports.leave = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).render("error", { status: 404, message: "Club not found." });

    const user = await User.findById(req.user._id);
    if (user.role !== "user") return res.status(403).render("error", { status: 403, message: "Only user can leave." });

    const isMember = user.clubs.map(String).includes(String(club._id));
    if (!isMember) return res.redirect("/clubs/" + club._id);

    if (user.clubs.length <= 1)
      return res.status(400).render("clubs/detail", { club, isMember: true, error: "You must be in min 1 club." });

    user.clubs = user.clubs.filter((id) => String(id) !== String(club._id));
    await user.save();
    res.redirect("/clubs/" + club._id);
  } catch (e) {
    next(e);
  }
};
