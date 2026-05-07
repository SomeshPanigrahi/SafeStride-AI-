
const asyncHandler = require("express-async-handler");
const Run = require("../models/Run");


// ADD RUN

const addRun = asyncHandler(async (req, res) => {
  const { distance, duration, intensity, date, notes } = req.body;

  const dailyLoad = duration * intensity;

  const run = await Run.create({
    user: req.user._id,
    distance,
    duration,
    intensity,
    date,
    dailyLoad,
    notes: notes || "",
  });

  res.status(201).json(run);
});


// ADD BULK RUNS

const addBulkRuns = asyncHandler(async (req, res) => {
  const runs = req.body.runs;

  const runsWithLoad = runs.map((run) => ({
    ...run,
    dailyLoad: run.duration * run.intensity,
    user: req.user._id,
  }));

  const savedRuns = await Run.insertMany(runsWithLoad);

  res.status(201).json(savedRuns);
});


// GET RUNS

const getRuns = asyncHandler(async (req, res) => {
  const runs = await Run.find({
    user: req.user._id,
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

  if (run.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await run.deleteOne();

  res.json({ message: "Run removed successfully" });
});


// UPDATE RUN

const updateRun = asyncHandler(async (req, res) => {
  const run = await Run.findById(req.params.id);

  if (!run) {
    res.status(404);
    throw new Error("Run not found");
  }

  if (run.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const { distance, duration, intensity, date, notes } = req.body;

  run.distance = distance ?? run.distance;
  run.duration = duration ?? run.duration;
  run.intensity = intensity ?? run.intensity;
  run.date = date ?? run.date;

  run.dailyLoad = run.duration * run.intensity;

  const updatedRun = await run.save();

  res.json(updatedRun);
});

module.exports = {
  addRun,
  addBulkRuns,
  getRuns,
  deleteRun,
  updateRun,
};