
const mongoose = require("mongoose");
const Run = require("../models/Run");
const { getRiskLevel } = require("../utils/riskUtils");
const { generateAIExplanation } = require("./aiService"); // AI


const getDateOnly = (date) => {
  return new Date(date).toISOString().split("T")[0];
};


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


const getDashboardData = async (userId) => {
  const [load, weekly, history, totalRuns] = await Promise.all([
    calculateLoad(userId),
    getWeeklyData(userId),
    getHistoryData(userId),
    Run.countDocuments({ user: userId }),
  ]);

  let explanation = "";

  
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


module.exports = {
  calculateLoad,
  getWeeklyData,
  getHistoryData,
  getDashboardData,
};

