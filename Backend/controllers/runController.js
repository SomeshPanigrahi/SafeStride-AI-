const asyncHandler = require("express-async-handler");
const Run = require("../models/Run");

const addRun = asyncHandler(async (req, res) => {

   console.log("Request Body:", req.body);


  const { distance, duration, intensity, date } = req.body;

  if (!distance || !duration || !intensity || !date) {
    res.status(400);
    throw new Error("Please provide all run details");
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


const addBulkRuns = asyncHandler(async (req, res) => {

  const runs = req.body;

  if (!Array.isArray(runs) || runs.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of runs");
  }

  const runsWithLoad = runs.map(run => ({
    ...run,
    dailyLoad: run.duration * run.intensity,
    user: req.user._id
  }));

  const savedRuns = await Run.insertMany(runsWithLoad);

  res.status(201).json(savedRuns);

});


const getRuns = asyncHandler(async (req, res) => {

  const runs = await Run.find({ user: req.user._id }).sort({ date: -1 });

  res.status(200).json(runs);

});




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

  res.json({ message: "Run removed successfully" });

});









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

  const { distance, duration, intensity, date } = req.body;

  run.distance = distance || run.distance;
  run.duration = duration || run.duration;
  run.intensity = intensity || run.intensity;
  run.date = date || run.date;

  // Recalculate training load
  run.dailyLoad = run.duration * run.intensity;

  const updatedRun = await run.save();

  res.json(updatedRun);

});


module.exports = { addRun, addBulkRuns,getRuns, deleteRun, updateRun };