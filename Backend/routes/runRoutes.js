

const express = require("express");

const router = express.Router();

const {
  addRun,
  addBulkRuns,
  getRuns,
  deleteRun,
  updateRun,
} = require("../controllers/runController");

const { protect } = require("../Middleware/authMiddleware");

const {
  validateRun,
  validateBulkRuns,
} = require("../Middleware/validateRun");

// ==============================
// ROUTES
// ==============================

router.post("/", protect, validateRun, addRun);

router.post("/bulk", protect, validateBulkRuns, addBulkRuns);

router.get("/", protect, getRuns);

router.put("/:id", protect, validateRun, updateRun);

router.delete("/:id", protect, deleteRun);

module.exports = router;