const express = require("express");
const router = express.Router();
const {
  getPrayers,
  getPrayerById,
  createPrayer,
  updatePrayer,
  deletePrayer,
} = require("../controllers/prayerController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/", getPrayers);
router.get("/:id", requireAuth, requireAdmin, getPrayerById);
router.post("/", requireAuth, requireAdmin, createPrayer);
router.put("/:id", requireAuth, requireAdmin, updatePrayer);
router.delete("/:id", requireAuth, requireAdmin, deletePrayer);

module.exports = router;
