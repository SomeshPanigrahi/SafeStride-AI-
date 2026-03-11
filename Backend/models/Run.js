const mongoose = require("mongoose");

const runSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    intensity: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dailyLoad: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Run = mongoose.model("Run", runSchema);

module.exports = Run;