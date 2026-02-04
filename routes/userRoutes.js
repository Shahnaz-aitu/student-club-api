const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const c = require("../controllers/userController");

router.get("/profile", requireAuth, c.profile);
router.put("/profile", requireAuth, c.updateProfile);

module.exports = router;
