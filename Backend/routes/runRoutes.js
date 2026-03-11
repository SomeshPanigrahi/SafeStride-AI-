const express = require("express");
const router = express.Router();
const { addRun, addBulkRuns, getRuns,deleteRun,updateRun } = require("../controllers/runController");
const { protect } = require("../Middleware/authMiddleware");


router.post("/", protect, addRun);

router.post("/bulk", protect, addBulkRuns);

router.get("/", protect, getRuns);

router.delete("/:id", protect, deleteRun);

router.put("/:id", protect, updateRun);

module.exports = router;  