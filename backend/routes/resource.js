const express = require("express");
const router = express.Router();
const {
  getResources,
  getResourcesByCategory,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.get("/", getResources);
router.get("/category/:category", getResourcesByCategory);
router.get("/:id", getResourceById);

router.post("/", requireAuth, requireAdmin, createResource);
router.put("/:id", requireAuth, requireAdmin, updateResource);
router.delete("/:id", requireAuth, requireAdmin, deleteResource);

module.exports = router;
