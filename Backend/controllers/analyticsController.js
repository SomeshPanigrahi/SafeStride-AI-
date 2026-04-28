const asyncHandler = require("express-async-handler");

const {
    calculateLoad,
    getWeeklyData,
    getHistoryData,
    getRiskData,
    getDashboardData,
} = require("../Services/analyticsService");

// ==============================
// Load
// ==============================
const getLoadSummary = asyncHandler(async (req, res) => {
    const data = await calculateLoad(req.user._id);   // ✅ FIX
    res.json(data);
});

// ==============================
// Weekly
// ==============================
const getWeeklyLoad = asyncHandler(async (req, res) => {
    const data = await getWeeklyData(req.user._id);   // ✅ FIX
    res.json(data);
});

// ==============================
// History
// ==============================
const getHistory = asyncHandler(async (req, res) => {
    const data = await getHistoryData(req.user._id);  // ✅ FIX
    res.json(data);
});

// ==============================
// Risk
// ==============================
const getRisk = asyncHandler(async (req, res) => {
    const data = await getRiskData(req.user._id);     // ✅ FIX
    res.json(data);
});

// ==============================
// Dashboard
// ==============================
const getDashboard = asyncHandler(async (req, res) => {
    const data = await getDashboardData(req.user._id); // ✅ FIX
    res.json(data);
});

module.exports = {
    getLoadSummary,
    getWeeklyLoad,
    getHistory,
    getRisk,
    getDashboard,
};