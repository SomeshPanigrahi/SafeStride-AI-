// const mongoose = require("mongoose");
// const Run = require("../models/Run");
// const { getRiskLevel } = require("../utils/riskUtils");

// // ==============================
// // Helper: Normalize date (avoid timezone bugs)
// // ==============================
// const getDateOnly = (date) => {
//   return new Date(date).toISOString().split("T")[0];
// };

// // ==============================
// // LOAD CALCULATION (ACWR)
// // ==============================
// const calculateLoad = async (userId) => {
//   const now = new Date();

//   const last7 = new Date();
//   last7.setDate(now.getDate() - 7);

//   const last28 = new Date();
//   last28.setDate(now.getDate() - 28);

//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   // 🔥 Fetch runs once (more efficient than 2 aggregations)
//   const runs = await Run.find({
//     user: userObjectId,
//     date: { $lte: now }, // include past runs only
//   });

//   let acuteTotal = 0;
//   let chronicTotal = 0;

//   runs.forEach((run) => {
//     const runDate = new Date(run.date);

//     if (runDate >= last7) {
//       acuteTotal += run.dailyLoad || 0;
//     }

//     if (runDate >= last28) {
//       chronicTotal += run.dailyLoad || 0;
//     }
//   });

//   const acuteLoad = acuteTotal / 7;

//   let chronicLoad = chronicTotal / 28;
//   if (chronicTotal === 0) chronicLoad = acuteLoad;

//   const acwr = chronicLoad === 0 ? 0 : acuteLoad / chronicLoad;

//   const risk = getRiskLevel(acwr);

//   return {
//     acuteLoad,
//     chronicLoad,
//     acwr,
//     ...risk,
//   };
// };

// // ==============================
// // WEEKLY DATA (Last 7 Days)
// // ==============================
// const getWeeklyData = async (userId) => {
//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   const runs = await Run.find({ user: userObjectId });

//   const now = new Date();
//   const weekly = [];

//   for (let i = 6; i >= 0; i--) {
//     const day = new Date();
//     day.setDate(now.getDate() - i);

//     weekly.push({
//       day: getDateOnly(day),
//       load: 0,
//     });
//   }

//   runs.forEach((run) => {
//     const runDate = getDateOnly(run.date);

//     weekly.forEach((d) => {
//       if (d.day === runDate) {
//         d.load += run.dailyLoad || 0;
//       }
//     });
//   });

//   return weekly;
// };

// // ==============================
// // HISTORY DATA (Last 28 Days)
// // ==============================
// const getHistoryData = async (userId) => {
//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   const runs = await Run.find({ user: userObjectId });

//   const now = new Date();
//   const history = [];

//   for (let i = 27; i >= 0; i--) {
//     const day = new Date();
//     day.setDate(now.getDate() - i);

//     history.push({
//       date: getDateOnly(day),
//       load: 0,
//     });
//   }

//   runs.forEach((run) => {
//     const runDate = getDateOnly(run.date);

//     history.forEach((d) => {
//       if (d.date === runDate) {
//         d.load += run.dailyLoad || 0;
//       }
//     });
//   });

//   return history;
// };

// // ==============================
// // RISK DATA
// // ==============================
// const getRiskData = async (userId) => {
//   const load = await calculateLoad(userId);

//   return {
//     acwr: load.acwr,
//     level: load.level,
//     message: load.message,
//   };
// };

// // ==============================
// // DASHBOARD (FINAL RESPONSE)
// // ==============================
// const getDashboardData = async (userId) => {
//   const [load, weekly, history, totalRuns] = await Promise.all([
//     calculateLoad(userId),
//     getWeeklyData(userId),
//     getHistoryData(userId),
//     Run.countDocuments({ user: userId }),
//   ]);

//   return {
//     summary: {
//       acuteLoad: load.acuteLoad,
//       chronicLoad: load.chronicLoad,
//       acwr: load.acwr,
//       riskLevel: load.level,
//     },

//     totalRuns,

//     weeklyLoad: weekly,
//     history,
//   };
// };

// // ==============================
// // EXPORTS
// // ==============================
// module.exports = {
//   calculateLoad,
//   getWeeklyData,
//   getHistoryData,
//   getRiskData,
//   getDashboardData,
// };

const mongoose = require("mongoose");
const Run = require("../models/Run");
const { getRiskLevel } = require("../utils/riskUtils");
const { generateAIExplanation } = require("./aiService"); // AI

// ==============================
// Helper: Normalize date
// ==============================
const getDateOnly = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

// ==============================
// LOAD CALCULATION (ACWR)
// ==============================
const calculateLoad = async (userId) => {
  const now = new Date();

  const last7 = new Date();
  last7.setDate(now.getDate() - 7);

  const last28 = new Date();
  last28.setDate(now.getDate() - 28);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const runs = await Run.find({
    user: userObjectId,
    date: { $lte: now },
  });

  let acuteTotal = 0;
  let chronicTotal = 0;

  runs.forEach((run) => {
    const runDate = new Date(run.date);

    if (runDate >= last7) acuteTotal += run.dailyLoad || 0;
    if (runDate >= last28) chronicTotal += run.dailyLoad || 0;
  });

  const acuteLoad = acuteTotal / 7;

  let chronicLoad = chronicTotal / 28;
  if (chronicTotal === 0) chronicLoad = acuteLoad;

  const acwr = chronicLoad === 0 ? 0 : acuteLoad / chronicLoad;

  const risk = getRiskLevel(acwr);

  return {
    acuteLoad,
    chronicLoad,
    acwr,
    ...risk,
  };
};

// ==============================
// WEEKLY DATA
// ==============================
const getWeeklyData = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const runs = await Run.find({ user: userObjectId });

  const now = new Date();
  const weekly = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(now.getDate() - i);

    weekly.push({
      day: getDateOnly(day),
      load: 0,
    });
  }

  runs.forEach((run) => {
    const runDate = getDateOnly(run.date);

    weekly.forEach((d) => {
      if (d.day === runDate) {
        d.load += run.dailyLoad || 0;
      }
    });
  });

  return weekly;
};

// ==============================
// HISTORY DATA
// ==============================
const getHistoryData = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const runs = await Run.find({ user: userObjectId });

  const now = new Date();
  const history = [];

  for (let i = 27; i >= 0; i--) {
    const day = new Date();
    day.setDate(now.getDate() - i);

    history.push({
      date: getDateOnly(day),
      load: 0,
    });
  }

  runs.forEach((run) => {
    const runDate = getDateOnly(run.date);

    history.forEach((d) => {
      if (d.date === runDate) {
        d.load += run.dailyLoad || 0;
      }
    });
  });

  return history;
};

// ==============================
// DASHBOARD (SAFE + AI)
// ==============================
const getDashboardData = async (userId) => {
  const [load, weekly, history, totalRuns] = await Promise.all([
    calculateLoad(userId),
    getWeeklyData(userId),
    getHistoryData(userId),
    Run.countDocuments({ user: userId }),
  ]);

  let explanation = "";

  // 🛡 SAFE AI CALL (IMPORTANT)
  try {
    explanation = await generateAIExplanation({
      acuteLoad: load.acuteLoad,
      chronicLoad: load.chronicLoad,
      acwr: load.acwr,
      riskLevel: load.level,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    explanation = "AI insights temporarily unavailable.";
  }

  return {
    summary: {
      acuteLoad: load.acuteLoad,
      chronicLoad: load.chronicLoad,
      acwr: load.acwr,
      riskLevel: load.level,
    },

    totalRuns,
    weeklyLoad: weekly,
    history,

    explanation, // ✅ Always safe now
  };
};

// ==============================
module.exports = {
  calculateLoad,
  getWeeklyData,
  getHistoryData,
  getDashboardData,
};

