const {
  runSchema,
  bulkRunSchema,
} = require("../validators/runValidators");



const validateRun = (req, res, next) => {
  const { error } = runSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};


// VALIDATE BULK RUNS
// ==============================
const validateBulkRuns = (req, res, next) => {
  const { error } = bulkRunSchema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateRun,
  validateBulkRuns,
};