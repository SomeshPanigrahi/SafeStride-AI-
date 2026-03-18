const asyncHandler = require("express-async-handler");
const Run = require("../models/Run");



// ==============================
// ADD RUN
// ==============================

const addRun = asyncHandler(async (req, res) => {

  console.log("Request Body:", req.body);

  const { distance, duration, intensity, date } = req.body;


  // ✅ VALIDATION

  if (!distance || !duration || !intensity || !date) {
    res.status(400);
    throw new Error("Please provide all run details");
  }

  if (distance <= 0) {
    res.status(400);
    throw new Error("Distance must be greater than 0");
  }

  if (duration <= 0) {
    res.status(400);
    throw new Error("Duration must be greater than 0");
  }

  if (intensity < 1 || intensity > 10) {
    res.status(400);
    throw new Error("Intensity must be between 1 and 10");
  }


  const dailyLoad = duration * intensity;


  const run = await Run.create({
    user: req.user._id,
    distance,
    duration,
    intensity,
    date,
    dailyLoad,
  });

  res.status(201).json(run);

});



// ==============================
// ADD BULK RUNS
// ==============================

const addBulkRuns = asyncHandler(async (req, res) => {

  const runs = req.body;

  if (!Array.isArray(runs) || runs.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of runs");
  }


  // ✅ validate each run

  const runsWithLoad = runs.map(run => {

    if (
      !run.distance ||
      !run.duration ||
      !run.intensity ||
      !run.date
    ) {
      throw new Error("Invalid run data");
    }

    if (run.distance <= 0) {
      throw new Error("Distance must be > 0");
    }

    if (run.duration <= 0) {
      throw new Error("Duration must be > 0");
    }

    if (run.intensity < 1 || run.intensity > 10) {
      throw new Error("Intensity must be 1-10");
    }

    return {
      ...run,
      dailyLoad: run.duration * run.intensity,
      user: req.user._id,
    };

  });


  const savedRuns =
    await Run.insertMany(runsWithLoad);

  res.status(201).json(savedRuns);

});



// ==============================
// GET RUNS
// ==============================

const getRuns = asyncHandler(async (req, res) => {

  const runs = await Run.find({
    user: req.user._id
  }).sort({ date: -1 });

  res.status(200).json(runs);

});



// ==============================
// DELETE RUN
// ==============================

const deleteRun = asyncHandler(async (req, res) => {

  const run = await Run.findById(req.params.id);

  if (!run) {
    res.status(404);
    throw new Error("Run not found");
  }

  // SECURITY CHECK
  if (run.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this run");
  }

  await run.deleteOne();

  res.json({
    message: "Run removed successfully"
  });

});



// ==============================
// UPDATE RUN
// ==============================

const updateRun = asyncHandler(async (req, res) => {

  const run = await Run.findById(req.params.id);

  if (!run) {
    res.status(404);
    throw new Error("Run not found");
  }

  // SECURITY CHECK
  if (run.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this run");
  }

  const {
    distance,
    duration,
    intensity,
    date
  } = req.body;


  // ✅ VALIDATION

  if (distance !== undefined && distance <= 0) {
    res.status(400);
    throw new Error("Distance must be > 0");
  }

  if (duration !== undefined && duration <= 0) {
    res.status(400);
    throw new Error("Duration must be > 0");
  }

  if (
    intensity !== undefined &&
    (intensity < 1 || intensity > 10)
  ) {
    res.status(400);
    throw new Error("Intensity must be 1-10");
  }


  run.distance = distance ?? run.distance;
  run.duration = duration ?? run.duration;
  run.intensity = intensity ?? run.intensity;
  run.date = date ?? run.date;


  // recalc load
  run.dailyLoad =
    run.duration * run.intensity;


  const updatedRun =
    await run.save();

  res.json(updatedRun);

});



// ==============================
// EXPORT
// ==============================

module.exports = {
  addRun,
  addBulkRuns,
  getRuns,
  deleteRun,
  updateRun
};