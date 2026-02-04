const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const c = require("../controllers/clubController");

// Private endpoints (resource)
router.get("/", requireAuth, c.list);
router.get("/:id", requireAuth, c.detail);

// Admin CRUD
router.get("/admin/new", requireAuth, c.showNew);
router.post("/", requireAuth, c.create);

router.get("/admin/:id/edit", requireAuth, c.showEdit);
router.put("/:id", requireAuth, c.update);
router.delete("/:id", requireAuth, c.remove);

// User join/leave
router.post("/:id/join", requireAuth, c.join);
router.post("/:id/leave", requireAuth, c.leave);

module.exports = router;
