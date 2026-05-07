const Joi = require("joi");


// SINGLE RUN SCHEMA

const runSchema = Joi.object({
  distance: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Distance must be a number",
      "number.min": "Distance cannot be negative",
      "any.required": "Distance is required",
    }),

  duration: Joi.number()
    .min(1)
    .required()
    .messages({
      "number.base": "Duration must be a number",
      "number.min": "Duration must be at least 1 minute",
      "any.required": "Duration is required",
    }),

  intensity: Joi.number()
    .min(1)
    .max(10)
    .required()
    .messages({
      "number.base": "Intensity must be a number",
      "number.min": "Minimum intensity is 1",
      "number.max": "Maximum intensity is 10",
      "any.required": "Intensity is required",
    }),

  date: Joi.date()
    .required()
    .messages({
      "date.base": "Invalid date format",
      "any.required": "Date is required",
    }),

  notes: Joi.string()
    .max(200)
    .allow("", null)
    .messages({
      "string.max": "Notes cannot exceed 200 characters",
    }),
});


// BULK RUN SCHEMA

const bulkRunSchema = Joi.array()
  .items(runSchema)
  .min(1)
  .messages({
    "array.base": "Runs must be an array",
    "array.min": "At least one run is required",
  });

module.exports = {
  runSchema,
  bulkRunSchema,
};