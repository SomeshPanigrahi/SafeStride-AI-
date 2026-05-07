// const express = require("express");
// const router = express.Router();
// const { addRun, addBulkRuns, getRuns,deleteRun,updateRun } = require("../controllers/runController");
// const { protect } = require("../Middleware/authMiddleware");

// const {
//   validateRun,
//   validateBulkRuns,
// } = require("../middleware/validateRun");


// router.post("/", protect, validateRun,addRun);

// router.post("/bulk", protect,validateBulkRuns,addBulkRuns);

// router.get("/", protect, getRuns);

// router.delete("/:id", protect, deleteRun);

// router.put("/:id", protect, validateRun, updateRun);

// module.exports = router;


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
} = require("../middleware/validateRun");

// ==============================
// ROUTES
// ==============================

router.post("/", protect, validateRun, addRun);

router.post("/bulk", protect, validateBulkRuns, addBulkRuns);

router.get("/", protect, getRuns);

router.put("/:id", protect, validateRun, updateRun);

router.delete("/:id", protect, deleteRun);

module.exports = router;