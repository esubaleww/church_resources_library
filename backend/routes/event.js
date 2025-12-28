const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getEventRsvps,
} = require("../controllers/eventController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/", getEvents);
router.get("/me", requireAuth, getEvents);
router.get("/:id", requireAuth, requireAdmin, getEventById);
router.post("/", requireAuth, requireAdmin, createEvent);
router.put("/:id", requireAuth, requireAdmin, updateEvent);
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);
router.get("/:id/rsvps", requireAuth, requireAdmin, getEventRsvps);
router.post("/:id/rsvp", rsvpToEvent);

module.exports = router;
