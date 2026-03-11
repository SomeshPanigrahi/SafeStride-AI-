const asyncHandler = require("express-async-handler");
const Run = require("../models/Run");

const getTrainingLoad = asyncHandler(async (req, res) => {

  const runs = await Run.find({ user: req.user._id });

  let acuteLoad = 0;
    let chronicLoad = 0;

  runs.forEach(run => {

    const runDate = new Date(run.date);
    const today = new Date();

    const diffDays = (today - runDate) / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) {
      acuteLoad += run.dailyLoad;
    }

    if (diffDays <= 28) {
      chronicLoad += run.dailyLoad;
    }

  });

  chronicLoad = chronicLoad / 28;

  // 🟢 Cold Start Handling
  if (chronicLoad === 0) {
    chronicLoad = acuteLoad;
  }

  // Calculate ACWR
  const acwr = chronicLoad === 0 ? 0 : acuteLoad / chronicLoad;

  let riskLevel = "Optimal";

  if (acwr < 0.8) riskLevel = "Undertraining";
  else if (acwr > 1.5) riskLevel = "High Injury Risk";
  else if (acwr > 1.3) riskLevel = "Warning";

  res.json({
    acuteLoad,
    chronicLoad,
    acwr,
    riskLevel
  });

});

module.exports = { getTrainingLoad };