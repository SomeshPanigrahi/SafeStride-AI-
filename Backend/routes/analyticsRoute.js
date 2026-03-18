const express = require("express");

const router = express.Router();

const {

    getLoadSummary,
    getWeeklyLoad,
    getHistory,
    getRisk,
    getDashboard,

} = require("../controllers/analyticsController");

const { protect } =
    require("../Middleware/authMiddleware");



router.get(
    "/load",
    protect,
    getLoadSummary
);

router.get(
    "/weekly-load",
    protect,
    getWeeklyLoad
);

router.get(
    "/history",
    protect,
    getHistory
);

router.get(
    "/risk",
    protect,
    getRisk
);

router.get(
    "/dashboard",
    protect,
    getDashboard
);



module.exports = router;