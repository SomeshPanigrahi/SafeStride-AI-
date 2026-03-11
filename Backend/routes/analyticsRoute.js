const express = require("express");
const router = express.Router();

const { getTrainingLoad } = require("../controllers/analyticsController");
const { protect } = require("../Middleware/authMiddleware");

router.get("/load", protect, getTrainingLoad);

module.exports = router;