const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getMyMessages,
  getAllMessages,
  addAdminReply,
  deleteMyContact,
} = require("../controllers/contactController.js");
const { requireAuth, requireAdmin } = require("../middleware/auth.js");

router.post("/", requireAuth, createContactMessage);

router.get("/mine", requireAuth, getMyMessages);
router.delete("/:id", requireAuth, deleteMyContact);

router.get("/admin", requireAuth, requireAdmin, getAllMessages);

router.post("/admin/:id/replies", requireAuth, requireAdmin, addAdminReply);

module.exports = router;
